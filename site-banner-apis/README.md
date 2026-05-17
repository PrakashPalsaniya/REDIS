# Site Banner APIs

This project shows how Redis can be used to store a website banner or hello bar message, so the app does not need to hit the database again and again for the same small piece of data.

## What This Code Does

The server uses Express and Redis to manage one banner message.

- `POST /banner` stores or updates the banner in Redis using `SET`
- `GET /banner` reads the banner from Redis using `GET`
- `GET /banner/exists` checks whether the banner key exists using `EXISTS`
- `DELETE /banner` removes the banner from Redis using `DEL`

## Why Redis Is Useful Here

- Very fast read and write operations
- Reduces repeated database calls
- Great for small frequently-used data like banners, offers, alerts, and notification bars
- Easy to update from admin panels or backend services

## Advantages

- Fast response time
- Less database load
- Simple implementation
- Good for caching small UI data

## Disadvantages

- Data is temporary if Redis is cleared or not persisted
- Not ideal for complex relational data
- If Redis is down, banner fetch may fail unless fallback logic exists
- This demo stores only one banner and does not include admin auth

## Run

```bash
npm install
npm start
```

## Example Request

```json
POST /banner
{
  "message": "Big sale is live now!"
}
```
