const mongoose = require("mongoose");
const crypto = require("crypto");

function generateAlias() {
  // Generate a URL-safe base64 string and take the first 6 characters
  return crypto.randomBytes(4).toString("base64url").slice(0, 6);
}

const shortUrlSchema = new mongoose.Schema(
    {
      fullUrl: { type: String, required: true },
      shortCode: {
        type: String,
        required: true,
        default: generateAlias,
        minlength: 6,
        maxlength: 6,
        index: true,
        unique: true,
      },
      clicks: { type: Number, required: true, default: 0 },
      clickTimestamps: {
        type: [Date],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("ShortUrl", shortUrlSchema);