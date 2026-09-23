const { setCorsHeaders } = require("../lib/cookies");

const FIREBASE_URL = process.env.FIREBASE_URL;
const FIREBASE_SECRET = process.env.FIREBASE_SECRET;

// Dev mode: always write to saves/dev, ignore cookies entirely.
const SAVE_KEY = "dev";

module.exports = async function handler(req, res) {
  setCorsHeaders(res, "POST, OPTIONS", req);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: "Invalid push subscription" });
    }

    await fetch(`${FIREBASE_URL}/saves/${SAVE_KEY}/subscription.json?auth=${FIREBASE_SECRET}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    return res.status(200).json({ success: true, saveCode: SAVE_KEY });
  } catch (error) {
    console.error("save-push error:", error);
    return res.status(500).json({ error: "Failed to save subscription" });
  }
};
