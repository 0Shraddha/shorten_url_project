const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

const app = express();

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/urlshortener")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple in-memory rate limiter per IP for URL shortening
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 shorten requests per window
const ipRequestLog = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  let timestamps = ipRequestLog.get(ip) || [];
  // Remove timestamps outside the current window
  timestamps = timestamps.filter((ts) => ts > windowStart);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const earliest = timestamps[0];
    const msUntilReset = RATE_LIMIT_WINDOW_MS - (now - earliest);
    const retryAfterSeconds = Math.max(1, Math.ceil(msUntilReset / 1000));

    return res.status(429).json({
      error: "Rate limit exceeded. Please try again later.",
      retry_after_seconds: retryAfterSeconds,
    });
  }

  timestamps.push(now);
  ipRequestLog.set(ip, timestamps);
  next();
}

// Home page (server-side rendered list, if you still use EJS)
app.get("/", async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.render("index", { shortUrls });
  } catch (err) {
    console.error("Error loading URLs:", err);
    res.status(500).send("Internal server error");
  }
});

// API: list all shortened URLs for analytics dashboard
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await ShortUrl.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a shortened URL (JSON API for React frontend)
app.post("/shorten", rateLimiter, async (req, res) => {
  try {
    const originalUrl = req.body.originalUrl || req.body.fullUrl;

    if (!originalUrl) {
      return res.status(400).json({ error: "originalUrl is required" });
    }

    // Basic URL validation on the server side
    try {
      // eslint-disable-next-line no-new
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Create a new short URL document
    const shortUrlDoc = await ShortUrl.create({ fullUrl: originalUrl });

    const shortUrl = `${req.protocol}://${req.get("host")}/${shortUrlDoc.shortCode}`;

    return res.status(201).json({
      short_url: shortUrl,
      fullUrl: shortUrlDoc.fullUrl,
      shortCode: shortUrlDoc.shortCode,
      clicks: shortUrlDoc.clicks,
    });
  } catch (err) {
    console.error("Error creating short URL:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// API: analytics for a specific short URL (last 7 days click counts)
app.get("/api/urls/:shortCode/analytics", async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ shortCode: req.params.shortCode });

        if (!shortUrl) {
            return res.status(404).json({ error: "URL not found" });
        }

        // Filter clicks from the last 7 days
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentClicks = shortUrl.clickTimestamps.filter(
            (timestamp) => new Date(timestamp) >= sevenDaysAgo
        );

        // Group clicks by day
        const analytics = {};
        recentClicks.forEach((timestamp) => {
            const day = new Date(timestamp).toISOString().split("T")[0]; // Format: YYYY-MM-DD
            analytics[day] = (analytics[day] || 0) + 1;
        });

        const labels = Object.keys(analytics).sort(); // Sorted dates
        const counts = labels.map((label) => analytics[label]);

        res.json({ labels, counts });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
});

// Redirect handler for visiting a short URL (tracks clicks with timestamps)
app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await ShortUrl.findOne({ shortCode });

    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    urlDoc.clicks += 1;
    urlDoc.clickTimestamps.push(new Date());
    await urlDoc.save();
ƒ
    return res.redirect(urlDoc.fullUrl);
  } catch (err) {
    console.error("Error handling redirect:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete URL route
app.delete("/api/urls/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUrl = await ShortUrl.findByIdAndDelete(id);

        if (!deletedUrl) {
            return res.status(404).json({ error: "URL not found" });
        }

        res.status(200).json({ message: "URL deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete URL" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});