(function () {
  var timer = document.getElementById("js-timer");
  var sessionValue = document.getElementById("js-session-value");
  var btnSessionIncrease = document.getElementById("js-session-timer-inc");
  var btnSessionDecrease = document.getElementById("js-session-timer-dec");
  var breakValue = document.getElementById("js-break-value");
  var btnBreakIncrease = document.getElementById("js-break-timer-inc");
  var btnBreakDecrease = document.getElementById("js-break-timer-dec");
  var startBtn = document.getElementById("js-start-btn");
  var resetBtn = document.getElementById("js-reset-btn");
  var status = document.getElementById("js-status");

  var DEFAULT_STEP = 60;
  var DEFAULT_BREAK = 300;
  var DEFAULT_SESSION = 1500;
  var DEFAULT_ROUND = 1;

  var breakDuration = DEFAULT_BREAK;
  var sessionDuration = DEFAULT_SESSION;
  var currentTimer = sessionDuration;
  var isRunning = false;
  var isSession = true;
  var timerRef = null;
  var round = DEFAULT_ROUND;

  function secondsToString(sec) {
    var secStr = new Intl.NumberFormat("en-IN", {
      minimumIntegerDigits: 2
    }).format(sec % 60);

    var minStr = new Intl.NumberFormat("en-IN", {
      minimumIntegerDigits: 2
    }).format(Math.floor(sec / 60));

    return minStr + ":" + secStr;
  }

  function changeSessionDuration(value) {
    if (sessionDuration + value <= 0) return;
    if (isRunning) return;
    sessionDuration += value;
    sessionValue.innerHTML = secondsToString(sessionDuration);
  }

  function changeBreakDuration(value) {
    if (breakDuration + value <= 0) return;
    if (isRunning) return;
    breakDuration += value;
    breakValue.innerHTML = secondsToString(breakDuration);
  }

  function resetAll() {
    window.dispatchEvent(new Event("pauseTimer"));
    breakValue.innerHTML = secondsToString(breakDuration);
    sessionValue.innerHTML = secondsToString(sessionDuration);
    currentTimer = sessionDuration;
    timer.innerHTML = secondsToString(currentTimer);
    timerRef = null;
    round = DEFAULT_ROUND;
    status.innerHTML = "Pomodoro Clock";
  }

  function toggleTimer() {
    if (timerRef === null) currentTimer = sessionDuration;
    if (!isRunning) {
      window.dispatchEvent(new CustomEvent("startTimer"));
    } else {
      window.dispatchEvent(new CustomEvent("pauseTimer"));
    }
  }

  btnSessionIncrease.addEventListener("click", function () {
    changeSessionDuration(DEFAULT_STEP);
  });

  btnSessionDecrease.addEventListener("click", function () {
    changeSessionDuration(-DEFAULT_STEP);
  });

  btnBreakIncrease.addEventListener("click", function () {
    changeBreakDuration(DEFAULT_STEP);
  });

  btnBreakDecrease.addEventListener("click", function () {
    changeBreakDuration(-DEFAULT_STEP);
  });

  resetBtn.addEventListener("click", function () {
    resetAll();
  });

  startBtn.addEventListener("click", function () {
    toggleTimer();
  });

  window.addEventListener("startTimer", function () {
    isRunning = true;
    timerRef = setInterval(function () {
      currentTimer--;
      if (currentTimer < 0) {
        if (isSession) {
          isSession = false;
          currentTimer = breakDuration;
        } else {
          isSession = true;
          currentTimer = sessionDuration;
          round++;
        }
      }
      startBtn.innerHTML = "Pause";
      timer.innerHTML = secondsToString(currentTimer);
      status.innerHTML = (isSession ? "Session " : "Break ") + round;
    }, 1000);
  });

  window.addEventListener("pauseTimer", function () {
    isRunning = false;
    startBtn.innerHTML = "Start";
    clearInterval(timerRef);
  });

  resetAll();
})();
