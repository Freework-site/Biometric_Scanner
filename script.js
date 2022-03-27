const { sin, PI } = Math;
const fullCircle = 2 * PI;
const canvas = document.getElementById("canvas");
const range = x => Array(x).fill(0).map((_, index) => index)
const norm = (val, min, max)=>(val - min) / (max - min)
const lerp = (nrm, min, max)=>(max - min) * nrm + min
const lerpMap = (val, sMin, sMax, dMin, dMax)=>lerp(norm(val, sMin, sMax), dMin, dMax)
const w = 400;
const h = 250;
canvas.width = 2 * w;
canvas.height = 2 * h;
const ctx = canvas.getContext("2d");
ctx.translate(w, h);

const rect = ({ color, x, y, w, h }) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

function clear() {
  rect({
    color: "#001b30",
    x: -w,
    y: -h,
    w: 2 * w,
    h: 2 * h
  });
}

const line = ({ x1, y1, x2, y2 }) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#00ffff";
  ctx.stroke();
  ctx.closePath();
};

const flashLight = (y, frameWidth) => {
  ctx.save();
  const lightLength = frameWidth * 0.9;
  const hx = 8;
  ctx.beginPath();
  ctx.moveTo(-lightLength, y);
  ctx.quadraticCurveTo(0, y - hx, lightLength, y);
  ctx.quadraticCurveTo(0, y + hx, -lightLength, y);
  ctx.fillStyle = "#00faff";
  ctx.shadowColor = "#00faff";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

const frameWidth = 100;
const frameHeight = 120;
const frameLength = 30;
let i = -50;
let multiplier = -1;
const update = () => {
  clear();
  line({
    x1: frameWidth,
    y1: frameHeight,
    x2: frameWidth - frameLength,
    y2: frameHeight
  });
  line({
    x1: frameWidth,
    y1: frameHeight,
    x2: frameWidth,
    y2: frameHeight - frameLength
  });

  line({
    x1: -frameWidth,
    y1: frameHeight,
    x2: -(frameWidth - frameLength),
    y2: frameHeight
  });
  line({
    x1: -frameWidth,
    y1: frameHeight,
    x2: -frameWidth,
    y2: frameHeight - frameLength
  });

  line({
    x1: frameWidth,
    y1: -frameHeight,
    x2: frameWidth - frameLength,
    y2: -frameHeight
  });
  line({
    x1: frameWidth,
    y1: -frameHeight,
    x2: frameWidth,
    y2: -(frameHeight - frameLength)
  });

  line({
    x1: -frameWidth,
    y1: -frameHeight,
    x2: -(frameWidth - frameLength),
    y2: -frameHeight
  });
  line({
    x1: -frameWidth,
    y1: -frameHeight,
    x2: -frameWidth,
    y2: -(frameHeight - frameLength)
  });

  i += multiplier;
  if (i === -frameHeight) {
    i = frameHeight;
  }

  var grd = ctx.createLinearGradient(0, i, 0, frameHeight);
  grd.addColorStop(0, "#00faff55");
  grd.addColorStop(1, "#001b30");

  ctx.fillStyle = grd;
  ctx.fillRect(-frameWidth, i, 2 * frameWidth, frameHeight - i);

  const numberOfCircles = 20;
  range(numberOfCircles).map(j => {
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      (frameWidth / numberOfCircles) * 0.8 * j,
      (frameHeight / numberOfCircles) * 0.8 * j,
      0,
      0,
      fullCircle
    );
    ctx.strokeStyle = "#00faff";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  flashLight(i, frameWidth);

  const numberTicks = Math.ceil(frameWidth / 2);
  range(numberTicks).map(k => {
    ctx.beginPath();
    ctx.moveTo(k * 4 - frameWidth, frameHeight + 100);
    ctx.lineTo(k * 4 - frameWidth, frameHeight + 75);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle =
      (k < lerpMap(i, frameHeight, -frameHeight, 0, numberTicks) &&
        "#0197fe") ||
      "#1a2e40";
    ctx.stroke();
  });

  ctx.font = "20px Courier New";
  ctx.fillStyle = `rgba(0,153,255, ${sin(i / 10)})`;
  ctx.fillText("SCANNING...", -50, frameHeight + 30);
  ctx.fillStyle = `rgb(0,153,255)`;
  ctx.fillText(
    `${Math.ceil(lerpMap(i, frameHeight, -frameHeight, 0, 100))}%`,
    -20,
    frameHeight + 55
  );
};
const render = () => {
  update();
  requestAnimationFrame(render);
};

render();
