# URL Shortener

A simple URL shortener application built with Node.js, Express, MongoDB, and EJS. It includes features like URL shortening, click tracking, analytics, and rate limiting.

## Features
- Shorten long URLs into short.
- Track the number of clicks on each shortened URL.
- View analytics for 
- Rate limiting to prevent abuse.

## Rate Limiter

This project implements a simple **in-memory rate limiter** to prevent abuse of the `/shorten` endpoint.

- Limits each IP address to **5 requests per minute**.
- Uses a JavaScript `Map` to store request timestamps per IP.
- On each request:
  - Removes timestamps older than 1 minute.
  - Checks if the request count exceeds the limit.
  - Returns **HTTP 429 (Too Many Requests)** if exceeded.
  - Otherwise, allows the request to proceed.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0Shraddha/shorten_url_project.git
   cd shorten_url_project
2. Install dependencies
    ```bash
    npm i or install
3. Start MongoDB
    ```bash
    mongod
4. Start Backend server
    ```bash
    npm run devStart
     or 
    node server.js