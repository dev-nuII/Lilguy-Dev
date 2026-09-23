const { setCorsHeaders } = require("../lib/cookies");

const FIREBASE_URL = process.env.FIREBASE_URL;
const FIREBASE_SECRET = process.env.FIREBASE_SECRET;

// Always wipes saves/dev — nothing else. Fixed key, no cookies, no wildcard,
// so this can never touch a real player's save no matter what's in the request.
const SAVE_KEY = "dev";

module.exports = async function handler(req, res) {
  setCorsHeaders(res, "PUT, OPTIONS", req);
  if (req.method === "OPTIONS") return res.status(200).end();

  
  try {
    // Full overwrite (PUT) of /saves/dev with an empty object — the key
    // stays in the tree, it just has nothing in it. This endpoint doesn't
    // take save data in the body; it only ever resets to empty.
    const resp = await fetch(
      `${FIREBASE_URL}/saves/${SAVE_KEY}.json?auth=${FIREBASE_SECRET}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    if (!resp.ok) {
      throw new Error(`Firebase returned ${resp.status}`);
    }

    return res.status(200).json({ success: true, wiped: SAVE_KEY });
  } catch (error) {
    console.error("reset-dev-save error:", error);
    return res.status(500).json({ error: "Failed to wipe dev save" });
  }
};
