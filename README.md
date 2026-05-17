# Redis Mini Projects

This folder contains a small collection of Redis practice projects built with Node.js and Express.

The goal of these projects is to understand Redis in a practical way by using different Redis features in small, focused examples. Each folder covers one concept and keeps the code simple enough to follow without too much extra setup.

## Projects

### 1. Site Banner APIs

Folder: [site-banner-apis](</redis/site-banner-apis>)

This project shows how to store and fetch a website banner using Redis instead of hitting the database again and again.

Main Redis commands used:

- `SET`
- `GET`
- `EXISTS`
- `DEL`

Useful for:

- hello bars
- sale banners
- announcements
- small cached UI content

README: [site-banner-apis/README.md](<redis/site-banner-apis/README.md>)

### 2. OTP Verification Redis

Folder: [otp-verification-redis](<redis/otp-verification-redis>)

This project shows how to build a basic OTP verification flow using Redis TTL.

Main Redis concepts used:

- `SET` with expiry
- `GET`
- `DEL`
- `TTL`

Useful for:

- login OTP
- signup verification
- short-lived authentication data

README: [otp-verification-redis/README.md](</redis/otp-verification-redis/README.md>)

### 3. Email Queue Redis Lists

Folder: [email-queue-redis-lists](<redis/email-queue-redis-lists>)

This project shows how Redis Lists can be used like a very simple queue system.

Main Redis commands used:

- `LPUSH`
- `RPOP`
- `LLEN`

Useful for:

- basic background job learning
- understanding queue flow
- simple job processing demos

README: [email-queue-redis-lists/README.md](</redis/email-queue-redis-lists/README.md>)

### 4. BullMQ Redis

Folder: [bullmq-redis](<redis/bullmq-redis>)

This project shows a more production-style queue setup using BullMQ on top of Redis.

Main concepts used:

- producer
- queue
- worker
- retries
- backoff

Useful for:

- background jobs
- email processing
- heavy async work
- scalable queue systems

README: [bullmq-redis/README.md](</redis/bullmq-redis/README.md>)

### 5. Pub/Sub Redis

Folder: [pub-sub-redis](<redis/pub-sub-redis>)

This project shows how Redis Pub/Sub works with a publisher, a channel, and a subscriber.

Main Redis concepts used:

- `PUBLISH`
- `SUBSCRIBE`

Useful for:

- notifications
- real-time events
- messaging systems
- UI updates

README: [pub-sub-redis/README.md](</redis/pub-sub-redis/README.md>)

### 6. Leaderboard Redis

Folder: [leaderboard-redis](<redis/leaderboard-redis>)

This project shows how Redis can manage counters and sorted rankings for a live leaderboard.

Main Redis commands used:

- `INCR`
- `ZINCRBY`
- `ZREVRANGE`
- `ZREVRANK`

Useful for:

- gaming leaderboards
- score systems
- trending rankings
- live stats

README: [leaderboard-redis/README.md](</redis/leaderboard-redis/README.md>)

## Why this folder is useful

Together, these projects cover some of the most practical Redis patterns:

- caching
- TTL-based expiry
- list-based queues
- production queueing with BullMQ
- publish/subscribe messaging
- sorted-set leaderboards




