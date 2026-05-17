const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 3000;
const BANNER_KEY = "site:banner";

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (error) => {
  console.error("Redis error:", error.message);
});

app.get("/", (req, res) => {
  res.json({
    message: "Site Banner API is running",
  
  });
});

// SET: save or update the banner message in Redis.
app.post("/banner", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid banner message.",
      });
    }

    await redis.set(BANNER_KEY, message.trim());

    return res.status(201).json({
      success: true,
      action: "SET",
      key: BANNER_KEY,
      message: message.trim(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET: fetch the banner message from Redis.
app.get("/banner", async (req, res) => {
  try {
    const banner = await redis.get(BANNER_KEY);

    if (!banner) {
      return res.status(404).json({
        success: false,
        action: "GET",
        message: "No banner found.",
      });
    }

    return res.json({
      success: true,
      action: "GET",
      key: BANNER_KEY,
      banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// EXISTS: check whether the banner key is available in Redis.
app.get("/banner/exists", async (req, res) => {
  try {
    const exists = await redis.exists(BANNER_KEY);

    return res.json({
      success: true,
      action: "EXISTS",
      key: BANNER_KEY,
      exists: Boolean(exists),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DEL: remove the banner key from Redis.
app.delete("/banner", async (req, res) => {
  try {
    const deletedCount = await redis.del(BANNER_KEY);

    if (!deletedCount) {
      return res.status(404).json({
        success: false,
        action: "DEL",
        message: "Banner does not exist.",
      });
    }

    return res.json({
      success: true,
      action: "DEL",
      key: BANNER_KEY,
      deleted: true,
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
