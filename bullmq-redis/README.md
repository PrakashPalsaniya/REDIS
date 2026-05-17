# BullMQ Redis

This project shows a basic BullMQ setup using Redis. It demonstrates how jobs are added from an API, stored in a queue, and processed by a worker.

## What This Code Does

The server includes both the API and the worker in a single file for learning purposes.

- `POST /job` adds a job into the BullMQ queue
- `GET /jobs` returns queue job counts
- A BullMQ `Worker` processes jobs in the background
- `completed` and `failed` events are logged in the console

This project does not send real emails. It only demonstrates queue flow.

## Why BullMQ Is Useful

- Good for background jobs
- Helps reduce load on the main server
- Supports retries and backoff
- More production-friendly than raw Redis list handling
- Useful for email jobs, video processing, notifications, and reports

## Advantages

- Clean queue architecture
- Retry support with `attempts`
- Backoff support for failures
- Separate producer and worker logic pattern
- Better base for production systems


## Run

```bash
npm install
npm start
```

## Example Request

```json
POST /job
{
  "to": "demo@example.com",
  "subject": "Welcome",
  "body": "This is a BullMQ job."
}
```
