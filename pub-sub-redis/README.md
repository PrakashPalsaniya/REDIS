# Pub/Sub Redis

This small project is a basic example of how Redis Pub/Sub works in a Node.js app.

The idea is simple:

- a publisher sends a message to a Redis channel
- a subscriber listens to that channel
- whenever a new message comes in, the subscriber receives it instantly

This pattern is very useful when you want different parts of your system to react to events, like notifications, emails, chat updates, or live UI changes.

## What this project does

This project uses:

- `Express` for the API
- `ioredis` for Redis connection
- one Redis client as a publisher
- one Redis client as a subscriber

Inside the code:

- `POST /publish` sends a message to the `notifications` channel
- the subscriber is already listening to the same channel
- when a message is published, it gets printed in the console

So this project helps you understand the core Pub/Sub flow without adding extra complexity.

## Why Pub/Sub is useful

In real applications, one service often needs to inform another service that something happened.

For example:

- a new order was placed
- a user signed up
- a payment was completed
- a notification needs to be shown

Instead of tightly connecting every service, you can publish an event to a channel and let subscribers handle it on their own side.

That makes the system cleaner and easier to scale.

## Advantages

- very fast communication
- simple event-based architecture
- useful for real-time updates
- easy to understand and easy to test
- good starting point for notifications and messaging systems

## Limitations

- this is a basic demo only
- messages are not stored permanently for later delivery
- if no subscriber is listening at that moment, the message is missed
- there is no retry system here
- there is no production monitoring or authentication

So Pub/Sub is great for live communication, but not always enough when you need guaranteed delivery.

## How to run

```bash
npm install
npm start
```

For development:

```bash
npm run dev
```

## Example request

```json
POST /publish
{
  "title": "New Notification",
  "body": "Your profile was updated successfully."
}
```

## Final note

This project is intentionally small and simple. The goal is to make Pub/Sub feel easy before moving to larger real-world setups with multiple services, workers, and event consumers.
