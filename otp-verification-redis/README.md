# OTP Verification Redis

This project shows a basic OTP verification flow using Redis TTL. The OTP is stored in Redis for a short time and expires automatically after 30 seconds.

## What This Code Does

The server creates and verifies OTPs using a mobile number.

- `POST /otp/send` generates a random 6-digit OTP and stores it in Redis with expiry
- `POST /otp/verify` checks whether the OTP is correct
- `GET /otp/ttl/:mobileNumber` shows the remaining TTL for that OTP key

After successful verification, the OTP is deleted from Redis.

## Why Redis Is Useful Here

- TTL makes OTP expiry automatic
- Redis is very fast for short-lived authentication data
- No need to manually clean expired OTPs
- Good fit for login, signup, and verification flows

## Advantages

- Very fast OTP storage and lookup
- Built-in expiry with TTL
- Simple and clean implementation
- Good for temporary verification data

## Disadvantages

- This is only a demo and returns OTP in the response
- No real SMS sending
- No retry limit or attempt count
- No rate limiting or abuse protection
- If Redis restarts and persistence is not configured, OTP data can be lost

## Run

```bash
npm install
npm start
```

## Example Request

```json
POST /otp/send
{
  "mobileNumber": "9876543210"
}
```

```json
POST /otp/verify
{
  "mobileNumber": "9876543210",
  "otp": "123456"
}
```
