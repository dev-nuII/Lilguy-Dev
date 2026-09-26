// wiring/game-input.js
// Routes clicks/taps on the canvas into handleClick().
canvas.addEventListener("click", (e) => {
  const { x, y } = getCanvasCoords(e.clientX, e.clientY);
  handleClick(x, y);
});
canvas.addEventListener("touchstart", (e) => {
  if (isBossfight !== false){
  e.preventDefault();
  const touch = e.touches[0];
  const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
  handleClick(x, y);
  } else {
  };
}, { passive: false });

