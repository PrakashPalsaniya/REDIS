const express = require("express");
const { Queue, Worker } = require("bullmq");

const app = express();
const PORT = process.env.PORT || 6000;
const queueName = "emailQueue";

app.use(express.json());

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

const emailQueue = new Queue(queueName, { connection });

const worker = new Worker(
  queueName,
  async (job) => {
    console.log("Processing job:", job.id, job.data);

    return {
      success: true,
      message: `Processed job for ${job.data.to}`,
    };
  },
  { connection }
);

worker.on("completed", (job, result) => {
  console.log("Job completed:", job.id, result);
});

worker.on("failed", (job, error) => {
  console.log("Job failed:", job?.id, error.message);
});

app.get("/", (_req, res) => {
  res.json({
    message: "BullMQ API is running",
    endpoints: {
      addJob: "POST /job",
      queueInfo: "GET /jobs",
    },
  });
});

app.post("/job", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "to, subject and body are required.",
      });
    }

    const job = await emailQueue.add(
      "sendEmail",
      { to, subject, body },
      {
        attempts: 3,
        backoff: {
          type: "fixed",
          delay: 3000,
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Job added to BullMQ queue.",
      jobId: job.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/jobs", async (_req, res) => {
  try {
    const waiting = await emailQueue.getWaitingCount();
    const active = await emailQueue.getActiveCount();
    const completed = await emailQueue.getCompletedCount();
    const failed = await emailQueue.getFailedCount();

    return res.json({
      success: true,
      queueName,
      counts: {
        waiting,
        active,
        completed,
        failed,
      },
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
