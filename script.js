function addCandle(left, top) {
  const candlesContainer = document.querySelector(".candles");
  const candle = document.createElement("div");
  candle.classList.add("candle");
  candle.style.left = left + "px";
  candle.style.bottom = (120 + top) + "px"; // فوق سطح الكيكة

  const flame = document.createElement("div");
  flame.classList.add("flame");

  candle.appendChild(flame);
  candlesContainer.appendChild(candle);
}

// إحداثيات كلمة VOVI
const wordPattern = [
  // V
  { left: 40, top: 0 },
  { left: 50, top: 15 },
  { left: 60, top: 30 },
  { left: 70, top: 15 },
  { left: 80, top: 0 },

  // O
  { left: 110, top: 0 },
  { left: 100, top: 15 },
  { left: 110, top: 30 },
  { left: 120, top: 15 },
  { left: 130, top: 0 },

  // V
  { left: 160, top: 0 },
  { left: 170, top: 15 },
  { left: 180, top: 30 },
  { left: 190, top: 15 },
  { left: 200, top: 0 },

  // I
  { left: 230, top: 0 },
  { left: 230, top: 15 },
  { left: 230, top: 30 }
];

function placeWordCandles() {
  wordPattern.forEach(pos => {
    addCandle(pos.left, pos.top);
  });
}

// أول ما الصفحة تفتح
window.onload = placeWordCandles;