const { setCorsHeaders } = require("../lib/cookies");

const FIREBASE_URL = process.env.FIREBASE_URL;
const FIREBASE_SECRET = process.env.FIREBASE_SECRET;

// Dev mode: always read/write saves/dev, ignore cookies entirely.
const SAVE_KEY = "dev";

async function fetchSave(code) {
  const resp = await fetch(`${FIREBASE_URL}/saves/${code}.json?auth=${FIREBASE_SECRET}`);
  return await resp.json(); // null if that save doesn't exist
}

async function createDevSave() {
  const defaultSave = {
    mental_state: "neutral",
    mood: 2,
    event_running: false,
    hp: 5,
    lilguy2_0: false,
    one: 0,
    change_change: 0,
    changevar: 1,
    x_pos: 180,
    y_pos: 0,
    x1_pos: 0,
    last_open_date: new Date().toISOString().slice(0, 10),
    streak: 0,
    bond: 0,
    animation: 0,
    last_hunger_check: new Date().toISOString(),
    hunger: 20,
    machine_id: "web-client",
    pets_today: 8,
    last_pet_str: new Date().toISOString(),
    weather: "clear",
    save_num: 0,
    save_code: SAVE_KEY,
  };

  await fetch(`${FIREBASE_URL}/saves/${SAVE_KEY}.json?auth=${FIREBASE_SECRET}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(defaultSave),
  });

  return defaultSave;
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res, "GET, OPTIONS", req);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    let save = await fetchSave(SAVE_KEY);

    if (!save) {
      // dev save doesn't exist yet — create it once
      save = await createDevSave();
    } else if (!save.save_code) {
      save.save_code = SAVE_KEY;
      await fetch(`${FIREBASE_URL}/saves/${SAVE_KEY}/save_code.json?auth=${FIREBASE_SECRET}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(SAVE_KEY),
      });
    }

    delete save.vapid_private_key; // never send this to the browser

    return res.status(200).json({ save, saveCode: SAVE_KEY });
  } catch (error) {
    console.error("load-save error:", error);
    return res.status(500).json({ error: "Failed to load save" });
  }
};
