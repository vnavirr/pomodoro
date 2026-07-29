const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const shortBreakBtn = document.getElementById('shortBreakBtn');
const longBreakBtn = document.getElementById('longBreakBtn');
const pomodoroBtn = document.getElementById('pomodoroBtn');
const timerText = document.getElementById('timerText');
const pomodoroCountText = document.getElementById('pomodoroCount');

// times associated with statuses
const TIMES = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60
}

let countdown;
let currentStatus = 'work';
let timeLeft = TIMES[currentStatus];
let pomodoroCount = 0;

// update timer text display & pomodoro count display 
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  pomodoroCountText.textContent = pomodoroCount;
}

// show start btn & hide pause/reset btn
function showStartBtn() {
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';
}

// show pause & reset btns & hide start btn
function showPauseResetBtn() {
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';
}

// show start & reset btns & hide pause btn
function showStartResetBtn() {
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
}

// switch between work, short break, and long break modes
function switchMode(status) {
    clearInterval(countdown);  // pause the timer
    timeLeft = TIMES[status];  // set timeLeft based on the selected mode
    currentStatus = status;  // update currentStatus
    updateDisplay();
    showStartBtn();
}

// get the next status based on the current status and pomodoro count
function getNextStatus() {
    if (currentStatus !== 'work') return 'work';
    return (pomodoroCount + 1) % 4 === 0 ? 'long_break' : 'short_break';
}

// handle the end of a session, update pomodoro count if it was a work session, and switch to the next mode
function handleSessionEnd() {
    clearInterval(countdown);
    alert("time is up!");

    if (currentStatus === 'work') {
        pomodoroCount++;
    }

    switchMode(getNextStatus());
}

// clicking start btn 
startBtn.addEventListener('click', () => {

    // update UI
    showPauseResetBtn();

    countdown = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
           handleSessionEnd();
        }
    }, 1000);

});

// clicking pause btn
pauseBtn.addEventListener('click', () => {
    
    // pause timer
    clearInterval(countdown);

    // update UI
    showStartResetBtn();

});

// clicking reset btn
resetBtn.addEventListener('click', () => {

    // reset timer
    clearInterval(countdown);
    timeLeft = TIMES[currentStatus];

    // update UI
    updateDisplay();
    showStartBtn();
});

// clicking pomodoro btn
pomodoroBtn.addEventListener('click', () => switchMode('work') );

// clicking short break btn
shortBreakBtn.addEventListener('click', () => switchMode('short_break') );

// clicking long break btn
longBreakBtn.addEventListener('click', () => switchMode('long_break') );
