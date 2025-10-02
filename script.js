// script.js
document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  // Read candles from URL: ?candles=23
  function getCandlesFromURL() {
    const params = new URLSearchParams(window.location.search);
    const n = parseInt(params.get("candles"));
    return isNaN(n) ? 0 : n;
  }

  function updateCandleCount() {
    const activeCandles = candles.filter(c => !c.classList.contains("out")).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = (left) + "px";
    candle.style.top = (top) + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  // Add candle on click (manual)
  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  // Audio detection
  function isBlowing() {
    if (!analyser) return false;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
    const average = sum / bufferLength;

    // threshold — قللتها لـ 20 عشان الاستجابة تكون أسهل
    return average > 20;
  }

  function blowOutCandles() {
    if (!candles.length) return;
    if (isBlowing()) {
      let blownOut = 0;
      candles.forEach(c => {
        if (!c.classList.contains("out") && Math.random() > 0.5) {
          c.classList.add("out");
          blownOut++;
        }
      });
      if (blownOut > 0) updateCandleCount();
    }
  }

  // Try to access mic
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        // poll every 200ms
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }

  // H E A R T   S H A P E  — parametric heart
  function heartCoordinates(t, scale, rect) {
    // classic parametric heart
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    // center the heart inside cake rect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2.5; // bias upwards a bit to fit on icing
    return {
      x: centerX + x * scale,
      y: centerY - y * scale
    };
  }

  // Place initial candles from URL in heart shape
  const initialCandles = getCandlesFromURL();

  // Wait a tick to ensure cake layout computed correctly
  requestAnimationFrame(() => {
    const rect = cake.getBoundingClientRect();
    if (initialCandles > 0) {
      // choose scale that fits the cake width — tweak multiplier if needed
      // scale relative to rect.width: larger width -> larger scale
      const scale = Math.min(rect.width, rect.height) / 35; // empirical
      for (let i = 0; i < initialCandles; i++) {
        const t = (Math.PI * 2 * i) / initialCandles;
        const { x, y } = heartCoordinates(t, scale, rect);
        addCandle(x, y);
      }
    }
  });
});