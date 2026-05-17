const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 5000;
const QUEUE_NAME = "emailQueue";

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
    message: "Email Queue API is running",
    endpoints: {
      addJob: "POST /email",
      processJob: "GET /email/process",
      queueSize: "GET /email/queue-size",
    },
  });
});

app.post("/email", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "to, subject and body are required.",
      });
    }

    const job = {
      to,
      subject,
      body,
      createdAt: new Date().toISOString(),
    };

    await redis.lpush(QUEUE_NAME, JSON.stringify(job));

    return res.status(201).json({
      success: true,
      message: "Email job added to queue.",
      job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/email/process", async (req, res) => {
  try {
    const job = await redis.rpop(QUEUE_NAME);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "No email jobs in queue.",
      });
    }

    const parsedJob = JSON.parse(job);

    return res.json({
      success: true,
      message: "Email job processed.",
      processedJob: parsedJob,
      note: "This is a demo. No real email was sent.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/email/queue-size", async (req, res) => {
  try {
    const size = await redis.llen(QUEUE_NAME);

    return res.json({
      success: true,
      queue: QUEUE_NAME,
      size,
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
