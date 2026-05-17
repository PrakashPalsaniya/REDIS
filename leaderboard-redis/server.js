const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 8000;
const LEADERBOARD_KEY = "leaderboard";

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (error) => {
  console.error("Redis error:", error.message);
});

app.get("/", (_req, res) => {
  res.json({
    message: "Leaderboard Redis API is running",
    endpoints: {
      incrementViews: "POST /:id/view",
      updateScore: "POST /leaderboard/score",
      getLeaderboard: "GET /leaderboard",
      getUserRank: "GET /leaderboard/:userId/rank",
    },
  });
});

app.post("/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    const views = await redis.incr(`post:${id}:views`);

    return res.json({
      success: true,
      postId: id,
      views,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/leaderboard/score", async (req, res) => {
  try {
    const { userId, score } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).json({
        success: false,
        error: "userId and score are required.",
      });
    }

    const updatedScore = await redis.zincrby(LEADERBOARD_KEY, score, userId);

    return res.status(201).json({
      success: true,
      userId,
      updatedScore: Number(updatedScore),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/leaderboard", async (_req, res) => {
  try {
    const topUsers = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, "WITHSCORES");
    const leaderboard = [];

    for (let i = 0; i < topUsers.length; i += 2) {
      leaderboard.push({
        rank: leaderboard.length + 1,
        userId: topUsers[i],
        score: Number(topUsers[i + 1]),
      });
    }

    return res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/leaderboard/:userId/rank", async (req, res) => {
  try {
    const { userId } = req.params;
    const rank = await redis.zrevrank(LEADERBOARD_KEY, userId);

    if (rank === null) {
      return res.status(404).json({
        success: false,
        message: "User not found in leaderboard.",
      });
    }

    return res.json({
      success: true,
      userId,
      rank: rank + 1,
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
