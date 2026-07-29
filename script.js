const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const shortBreakBtn = document.getElementById('shortBreakBtn');
const longBreakBtn = document.getElementById('longBreakBtn');
const pomodoroBtn = document.getElementById('pomodoroBtn');
const timerText = document.getElementById('timerText');
const pomodoroCountText = document.getElementById('pomodoroCount');

const WORK_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

let countdown;
let timeLeft = WORK_TIME;
let currentStatus = 'work';
let pomodoroCount = 0;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  pomodoroCountText.textContent = pomodoroCount;
}

function showStartBtn() {
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';
}

// clicking start btn 
startBtn.addEventListener('click', () => {

    // update UI
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';

    countdown = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(countdown);
            alert("time is up!");

            // update pomodoro count
            if (currentStatus === 'work') {
                pomodoroCount++;
            }

            // change status and set timeLeft for next session
            if (currentStatus === 'work' && (pomodoroCount % 4) !== 0) {
                timeLeft = SHORT_BREAK_TIME;
                currentStatus = 'short_break';
                showStartBtn();
            } else if (currentStatus === 'work' && (pomodoroCount % 4) === 0) {
                timeLeft = LONG_BREAK_TIME;
                currentStatus = 'long_break';
                showStartBtn();
            } else {
                timeLeft = WORK_TIME;
                currentStatus = 'work';
                showStartBtn();
            }

            updateDisplay();}
    }, 1000);

});

// clicking pause btn
pauseBtn.addEventListener('click', () => {
    
    // pause timer
    clearInterval(countdown);

    // update UI
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';

});


// clicking reset btn
resetBtn.addEventListener('click', () => {

    // reset timer
    clearInterval(countdown);

    if (currentStatus === "work") {
        timeLeft = WORK_TIME;
    } else if (currentStatus === "short_break") {
        timeLeft = SHORT_BREAK_TIME;
    } else if (currentStatus === "long_break") {
        timeLeft = LONG_BREAK_TIME;
    }

    updateDisplay();

    // update UI
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';

});

// clicking pomodoro btn
pomodoroBtn.addEventListener('click', () => {
    // reset timer
    clearInterval(countdown);
    timeLeft = WORK_TIME;
    currentStatus = 'work';
    updateDisplay();
    showStartBtn();
});

// clicking short break btn
shortBreakBtn.addEventListener('click', () => {
    // reset timer
    clearInterval(countdown);
    timeLeft = SHORT_BREAK_TIME;
    currentStatus = 'short_break';
    updateDisplay();
    showStartBtn();
});

// clicking long break btn
longBreakBtn.addEventListener('click', () => {
    // reset timer
    clearInterval(countdown);
    timeLeft = LONG_BREAK_TIME;
    currentStatus = 'long_break';
    updateDisplay();
    showStartBtn();
});