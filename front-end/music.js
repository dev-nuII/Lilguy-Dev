// title screen music
let titleStarted = false;

function tryStartTitle() {
  if (titleStarted) return;
  const t = document.getElementById("myAudio7");
  t.loop = true;
  t.volume = 0.4;
  t.play().then(() => { titleStarted = true; }).catch(() => {});
}

function stopTitle() {
  const t = document.getElementById("myAudio7");
  const steps = 15;
  let i = 0;
  const startVol = t.volume;
  const fade = setInterval(() => {
    i++;
    t.volume = Math.max(0, startVol * (1 - i / steps));
    if (i >= steps) {
      clearInterval(fade);
      t.pause();
      t.currentTime = 0;
    }
  }, 40);
}

const AMBIENT_VOL = 0.4;
let currentTrack = null;
const fadeTimers = {};

const seasonTrack = {
  spring: "myAudio1",
  summer: "myAudio5",
  fall:   "myAudio8",
  winter: "myAudio3",
};

function wantedTrack() {
  if (state.weather === "snow")  return "myAudio9";
  if (state.weather === "rain")  return "myAudio6";
  if (state.weather === "storm") return "myAudio4";
  if (state.weather === "cloudy") return "myAudio2";
  return seasonTrack[state.season] || "myAudio1";
}

function fadeTo(audio, target, ms, onDone) {
  clearInterval(fadeTimers[audio.id]);
  const steps = 20, start = audio.volume;
  let i = 0;
  fadeTimers[audio.id] = setInterval(() => {
    i++;
    audio.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
    if (i >= steps) { clearInterval(fadeTimers[audio.id]); if (onDone) onDone(); }
  }, ms / steps);
}

function playTrack(id) {
  if (currentTrack === id) return;
  const prev = currentTrack ? document.getElementById(currentTrack) : null;
  currentTrack = id;

  const next = document.getElementById(id);
  next.loop = true;
  next.volume = 0;
  next.currentTime = 0;
  next.play()
    .then(() => fadeTo(next, AMBIENT_VOL, 2500))
    .catch(err => console.log("track blocked:", id, err.name));

  if (prev) fadeTo(prev, 0, 2000, () => prev.pause());
}

function stopAllMusic() {
  if (currentTrack) {
    const a = document.getElementById(currentTrack);
    fadeTo(a, 0, 2000, () => a.pause());
    currentTrack = null;
  }
}

function startMusicSystem() {
  playTrack(wantedTrack());
}

function onWeatherChanged() {
  if (!state.sleeping) playTrack(wantedTrack());
}
