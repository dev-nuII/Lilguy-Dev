const FIREBASE_URL = process.env.FIREBASE_URL;
const FIREBASE_SECRET = process.env.FIREBASE_SECRET;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

const TZ = "America/Chicago";
const SLEEP_DURATION_MS = 8 * 60 * 60 * 1000;

const now = Date.now();
const todayStr = toLocalDateStr(now);

const wakeAt = now + SLEEP_DURATION_MS;

function toLocal(iso) {
  return new Date(iso).toLocaleString("en-US", { timeZone: TZ });
}

function toLocalDateStr(ms) {
  // YYYY-MM-DD in the target TZ, for the "already slept today" check
  const d = new Date(ms);
  return d.toLocaleDateString("en-CA", { timeZone: TZ }); // en-CA gives YYYY-MM-DD
}

function getCurrentLocalHour() {
  return Number(
    new Date().toLocaleString("en-US", { timeZone: TZ, hour: "numeric", hour12: false })
  );
}


await fetch(`${FIREBASE_URL}/saves/${state.save_code}.json?auth=${FIREBASE_SECRET}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sleeping: true,
            sleep_wake_at: wakeAt,
            sleep_wake_at_local: toLocal(new Date(wakeAt).toISOString()),
            slept_today: todayStr,
            stop_hunger_check: true,
          }),
