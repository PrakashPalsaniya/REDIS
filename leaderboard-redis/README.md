# Leaderboard Redis

This project is a simple Redis leaderboard demo built with Node.js, Express, and ioredis.

The goal is to show how Redis can handle counters, score updates, sorting, and ranking very efficiently. This is exactly the kind of thing Redis is really good at.

## What this project does

This server gives you a few practical endpoints:

- `POST /:id/view` increases the view count of a post using `INCR`
- `POST /leaderboard/score` adds or updates a user score using `ZINCRBY`
- `GET /leaderboard` returns the top 10 users using `ZREVRANGE`
- `GET /leaderboard/:userId/rank` returns a specific user rank using `ZREVRANK`

So in one small project, you get to see both counters and sorted sets in action.

## Why Redis is useful here

Leaderboards need fast writes and fast reads.

Users may keep scoring points again and again, and the app may need to show rankings very often. In a traditional database, that can become more expensive and more complex, especially when multiple updates happen at the same time.

Redis makes this easier because:

- increment operations are atomic
- sorted sets are built for ranking use cases
- reads are very fast
- concurrency handling is much cleaner

That is why Redis is such a good fit for gaming systems, points systems, scoreboards, trending lists, and ranking features.

## Advantages

- very fast score updates
- built-in ranking support with sorted sets
- simple counter handling with `INCR`
- good for real-time leaderboards
- handles concurrent updates cleanly

## Limitations

- this is a basic demo only
- no user authentication
- no validation for bad score input
- no persistence strategy explained here
- no pagination or advanced leaderboard filters

So this is great for understanding the core idea, but a production app would need more structure around it.

## How to run

```bash
npm install
npm start
```

For development:

```bash
npm run dev
```

## Example requests

```json
POST /leaderboard/score
{
  "userId": "user123",
  "score": 15
}
```

```bash
GET /leaderboard
GET /leaderboard/user123/rank
POST /post-101/view
```


