const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 4000;
const OTP_TTL_SECONDS = 30;

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (error) => {
  console.error("Redis error:", error.message);
});

function getOtpKey(mobileNumber) {
  return `otp:${mobileNumber}`;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.get("/", (_req, res) => {
  res.json({
    message: "OTP Verification API is running",
    ttlSeconds: OTP_TTL_SECONDS,
    endpoints: {
      sendOtp: "POST /otp/send",
      verifyOtp: "POST /otp/verify",
      checkTtl: "GET /otp/ttl/:mobileNumber",
    },
  });
});

app.post("/otp/send", async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid mobile number.",
      });
    }

    const otp = generateOtp();
    const otpKey = getOtpKey(mobileNumber);

    await redis.set(otpKey, otp, "EX", OTP_TTL_SECONDS);

    return res.status(201).json({
      success: true,
      message: "OTP generated and stored in Redis.",
      mobileNumber,
      otp,
      expiresInSeconds: OTP_TTL_SECONDS,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/otp/verify", async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        error: "mobileNumber and otp are required.",
      });
    }

    const otpKey = getOtpKey(mobileNumber);
    const storedOtp = await redis.get(otpKey);

    if (!storedOtp) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "OTP expired or not found.",
      });
    }

    if (storedOtp !== String(otp).trim()) {
      return res.status(401).json({
        success: false,
        verified: false,
        message: "Invalid OTP.",
      });
    }

    await redis.del(otpKey);

    return res.json({
      success: true,
      verified: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/otp/ttl/:mobileNumber", async (req, res) => {
  try {
    const { mobileNumber } = req.params;

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        error: "Mobile number is required.",
      });
    }

    const otpKey = getOtpKey(mobileNumber);
    const ttl = await redis.ttl(otpKey);

    return res.json({
      success: true,
      mobileNumber,
      key: otpKey,
      ttlSeconds: ttl,
      message:
        ttl === -2
          ? "OTP not found or already expired."
          : ttl === -1
            ? "OTP exists but has no expiry."
            : "TTL fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
