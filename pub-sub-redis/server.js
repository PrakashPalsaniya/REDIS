const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 7000;
const CHANNEL_NAME = "notifications";

app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
const subscriber = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

publisher.on("connect", () => {
  console.log("Publisher connected to Redis");
});

subscriber.on("connect", () => {
  console.log("Subscriber connected to Redis");
});

publisher.on("error", (error) => {
  console.error("Publisher Redis error:", error.message);
});

subscriber.on("error", (error) => {
  console.error("Subscriber Redis error:", error.message);
});

subscriber.subscribe(CHANNEL_NAME, (error) => {
  if (error) {
    console.error("Subscribe error:", error.message);
    return;
  }

  console.log(`Subscribed to channel: ${CHANNEL_NAME}`);
});

subscriber.on("message", (channel, message) => {
  console.log(`New message from ${channel}: ${message}`);
});

app.get("/", (_req, res) => {
  res.json({
    message: "Pub/Sub Redis API is running",
    channel: CHANNEL_NAME,
    endpoints: {
      publishMessage: "POST /publish",
    },
  });
});

app.post("/publish", async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        error: "title and body are required.",
      });
    }

    const payload = {
      title,
      body,
      createdAt: new Date().toISOString(),
    };

    await publisher.publish(CHANNEL_NAME, JSON.stringify(payload));

    return res.status(201).json({
      success: true,
      message: "Message published successfully.",
      channel: CHANNEL_NAME,
      payload,
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
