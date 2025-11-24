const playIcon =
  '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const pauseIcon =
  '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';

// #region Language
let currentLang = "en";
const languageBtn = document.getElementById("languageBtn");

languageBtn.addEventListener("click", () => {
  currentLang = currentLang === "tr" ? "en" : "tr";
  updateLanguage(currentLang);
});

const translations = {
  tr: {
    title: "Kronometre ve Geri Sayım",
    stopwatch: "Kronometre",
    countdown: "Geri Sayım",
    start: "Başlat",
    pause: "Beklet",
    reset: "Sıfırla",
    hours: "Saat",
    minutes: "Dakika",
    seconds: "Saniye",
  },
  en: {
    title: "Stopwatch and Countdown",
    stopwatch: "Stopwatch",
    countdown: "Countdown",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
};

function updateLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  document.title = t.title;

  document.querySelector("#stopwatchTitle").textContent = t.stopwatch;
  document.querySelector("#countdownTitle").textContent = t.countdown;

  document.querySelector("#hoursLabel").textContent = t.hours;
  document.querySelector("#minutesLabel").textContent = t.minutes;
  document.querySelector("#secondsLabel").textContent = t.seconds;

  updateButtonTexts();

  document.getElementById("langText").textContent = lang.toUpperCase();

  if (stopwatchCard.style.display !== "none") {
    toggleBtn.textContent = t.stopwatch;
  } else {
    toggleBtn.textContent = t.countdown;
  }
}

function updateButtonTexts() {
  const t = translations[currentLang];
  const stopwatchBtn = document.getElementById("stopwatchStartBtn");
  const countdownBtn = document.getElementById("countdownStartBtn");

  if (stopwatchRunning) {
    stopwatchBtn.innerHTML = pauseIcon + " " + t.pause;
  } else {
    stopwatchBtn.innerHTML = playIcon + " " + t.start;
  }

  if (countdownRunning) {
    countdownBtn.innerHTML = pauseIcon + " " + t.pause;
  } else {
    countdownBtn.innerHTML = playIcon + " " + t.start;
  }

  document.querySelectorAll(".reset-btn").forEach((btn) => {
    const icon = btn.querySelector("svg").outerHTML;
    btn.innerHTML = icon + " " + t.reset;
  });
}
// #endregion Language

// #region Theme
const themeColors = document.querySelectorAll(".theme-color");

themeColors.forEach((color) => {
  color.addEventListener("click", () => {
    const theme = color.dataset.theme;
    changeTheme(theme);
  });
});

function changeTheme(theme) {
  document.body.classList = "";
  document.body.classList.add("theme-" + theme);

  themeColors.forEach((c) => c.classList.remove("active"));
  document.querySelector(`.theme-color-${theme}`).classList.add("active");
}
// #endregion Theme

// #region Night Mode
let nightMode = false;
const nightModeBtn = document.getElementById("nightModeBtn");
const moonIcon = document.getElementById("moonIcon");
const sunIcon = document.getElementById("sunIcon");

nightModeBtn.addEventListener("click", () => {
  nightMode = !nightMode;
  document.body.classList.toggle("night-mode", nightMode);

  if (nightMode) {
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
  } else {
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
  }
});
// #endregion Night Mode

// #region Stopwatch
let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0;
let stopwatchInterval;
let stopwatchRunning = false;

const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const stopwatchStartBtn = document.getElementById("stopwatchStartBtn");
const stopwatchResetBtn = document.getElementById("stopwatchResetBtn");

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function updateStopwatchDisplay() {
  const currentTime = Date.now() - stopwatchStartTime + stopwatchElapsedTime;
  stopwatchDisplay.textContent = formatTime(currentTime);
}

function stopwatchStartPause() {
  const t = translations[currentLang];
  if (stopwatchRunning) {
    clearInterval(stopwatchInterval);
    stopwatchElapsedTime += Date.now() - stopwatchStartTime;
    stopwatchRunning = false;
    stopwatchStartBtn.innerHTML = playIcon + " " + t.start;
  } else {
    stopwatchStartTime = Date.now();
    stopwatchInterval = setInterval(updateStopwatchDisplay, 10);
    stopwatchRunning = true;
    stopwatchStartBtn.innerHTML = pauseIcon + " " + t.pause;
  }
}

function stopwatchReset() {
  const t = translations[currentLang];
  clearInterval(stopwatchInterval);
  stopwatchStartTime = 0;
  stopwatchElapsedTime = 0;
  stopwatchRunning = false;
  stopwatchDisplay.textContent = "00:00:00";
  stopwatchStartBtn.innerHTML = playIcon + " " + t.start;
}

stopwatchStartBtn.addEventListener("click", stopwatchStartPause);
stopwatchResetBtn.addEventListener("click", stopwatchReset);
// #endregion Stopwatch

// #region Countdown
let countdownTotalSeconds = 60;
let countdownRemainingSeconds = 60;
let countdownInterval;
let countdownRunning = false;

const countdownDisplay = document.getElementById("countdownDisplay");
const countdownStartBtn = document.getElementById("countdownStartBtn");
const countdownResetBtn = document.getElementById("countdownResetBtn");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const timeInputsDiv = document.getElementById("timeInputs");

function formatCountdownTime(totalSecs) {
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function updateCountdownFromInputs() {
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  countdownTotalSeconds = hours * 3600 + minutes * 60 + seconds;
  countdownRemainingSeconds = countdownTotalSeconds;
  countdownDisplay.textContent = formatCountdownTime(countdownRemainingSeconds);
  countdownDisplay.classList.remove("countdown-finished");
}

function updateCountdownDisplay() {
  countdownRemainingSeconds--;
  countdownDisplay.textContent = formatCountdownTime(countdownRemainingSeconds);

  if (countdownRemainingSeconds <= 0) {
    clearInterval(countdownInterval);
    countdownRunning = false;
    const t = translations[currentLang];
    countdownStartBtn.innerHTML = playIcon + " " + t.start;
    countdownDisplay.classList.add("countdown-finished");
    timeInputsDiv.style.display = "flex";
  }
}

function countdownStartPause() {
  const t = translations[currentLang];
  if (countdownRunning) {
    clearInterval(countdownInterval);
    countdownRunning = false;
    countdownStartBtn.innerHTML = playIcon + " " + t.start;
  } else {
    if (countdownRemainingSeconds <= 0) {
      updateCountdownFromInputs();
    }
    if (countdownRemainingSeconds > 0) {
      timeInputsDiv.style.display = "none";
      countdownInterval = setInterval(updateCountdownDisplay, 1000);
      countdownRunning = true;
      countdownStartBtn.innerHTML = pauseIcon + " " + t.pause;
      countdownDisplay.classList.remove("countdown-finished");
    }
  }
}

function countdownReset() {
  const t = translations[currentLang];
  clearInterval(countdownInterval);
  countdownRunning = false;
  updateCountdownFromInputs();
  countdownStartBtn.innerHTML = playIcon + " " + t.start;
  timeInputsDiv.style.display = "flex";
}

hoursInput.addEventListener("input", updateCountdownFromInputs);
minutesInput.addEventListener("input", updateCountdownFromInputs);
secondsInput.addEventListener("input", updateCountdownFromInputs);

function handleWheel(input, min, max) {
  input.addEventListener("wheel", (e) => {
    e.preventDefault();
    let value = parseInt(input.value) || 0;

    if (e.deltaY < 0) {
      value++;
    } else {
      value--;
    }

    if (value < min) value = min;
    if (value > max) value = max;

    input.value = value;
    updateCountdownFromInputs();
  });
}

handleWheel(hoursInput, 0, 23);
handleWheel(minutesInput, 0, 59);
handleWheel(secondsInput, 0, 59);

countdownStartBtn.addEventListener("click", countdownStartPause);
countdownResetBtn.addEventListener("click", countdownReset);
// #endregion Countdown

// #region Fullscreen
const fullscreenBtn = document.getElementById("fullscreenBtn");
const expandIcon = document.getElementById("expandIcon");
const shrinkIcon = document.getElementById("shrinkIcon");

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .then(() => {
        expandIcon.style.display = "none";
        shrinkIcon.style.display = "block";
      })
      .catch((err) => {
        console.log("Fullscreen error:", err);
      });
  } else {
    document.exitFullscreen().then(() => {
      expandIcon.style.display = "block";
      shrinkIcon.style.display = "none";
    });
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    expandIcon.style.display = "block";
    shrinkIcon.style.display = "none";
  }
});
// #endregion Fullscreen

// #region Toggle Button
const toggleBtn = document.getElementById("toggleToolBtn");
const stopwatchCard = document.getElementById("stopwatchCard");
const countdownCard = document.getElementById("countdownCard");

toggleBtn.onclick = function () {
  const t = translations[currentLang];

  if (stopwatchCard.style.display !== "none") {
    stopwatchCard.style.display = "none";
    countdownCard.style.display = "block";
    toggleBtn.textContent = t.countdown;
  } else {
    countdownCard.style.display = "none";
    stopwatchCard.style.display = "block";
    toggleBtn.textContent = t.stopwatch;
  }
};
// #endregion Toggle Button

// #region Clock
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("liveClock").textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();
// #endregion Clock
