# Email Queue Redis Lists

This project shows how Redis Lists can be used like a simple queue for email jobs. It is a basic learning example using `LPUSH` and `RPOP`.

## What This Code Does

The server pushes email jobs into a Redis list and later processes them one by one.

- `POST /email` adds a new email job into the queue using `LPUSH`
- `GET /email/process` removes one job from the queue using `RPOP`
- `GET /email/queue-size` returns the current queue size using `LLEN`

This project does not send real emails. It only simulates queue processing.

## Why Redis Is Useful Here

- Fast queue operations
- Simple first step to understand job queues
- Useful for background jobs that should not block the main request
- Helps separate job creation from job processing

## Advantages

- Very simple to understand
- Fast enqueue and dequeue operations
- Good for learning Redis Lists
- Easy starting point for background processing

## Disadvantages

- Jobs can be lost if a worker crashes after popping
- No retry mechanism
- No failure tracking
- No parallel worker management
- Not ideal for production without a proper queue library

## Run

```bash
npm install
npm start
```

## Example Request

```json
POST /email
{
  "to": "demo@example.com",
  "subject": "Welcome",
  "body": "Your email job is queued."
}
```
