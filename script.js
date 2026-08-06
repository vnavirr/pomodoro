const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const shortBreakBtn = document.getElementById('shortBreakBtn');
const longBreakBtn = document.getElementById('longBreakBtn');
const pomodoroBtn = document.getElementById('pomodoroBtn');
const timerText = document.getElementById('timerText');
const pomodoroCountText = document.getElementById('pomodoroCount');
const totalPomodoroCountText = document.getElementById('totalPomodoroCount');

// times associated with statuses
const TIMES = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60
}

let countdown;
let currentStatus = 'work';
let timeLeft = TIMES[currentStatus];

// update pomodoro count
let pomodoroCount = 0;
let totalPomodoroCount = 0;

window.pomodoroStore.getCount().then((count) => {
    totalPomodoroCount = count;
    updateDisplay();
});


// update timer text display & pomodoro count display 
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  pomodoroCountText.textContent = pomodoroCount;
  totalPomodoroCountText.textContent = totalPomodoroCount;
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

// change type button backgrounds
function updateTypeBtnBackgrounds() {

    if (currentStatus === 'work') {
        pomodoroBtn.style.backgroundColor = '#CFA88C';
        shortBreakBtn.style.backgroundColor = '#F3D5C2';
        longBreakBtn.style.backgroundColor = '#F3D5C2';
    } else if (currentStatus === 'short_break') {
        pomodoroBtn.style.backgroundColor = '#F3D5C2';
        shortBreakBtn.style.backgroundColor = '#CFA88C';
        longBreakBtn.style.backgroundColor = '#F3D5C2';
    } else if (currentStatus === 'long_break') {
        pomodoroBtn.style.backgroundColor = '#F3D5C2';
        shortBreakBtn.style.backgroundColor = '#F3D5C2';
        longBreakBtn.style.backgroundColor = '#CFA88C';
    }
}

// switch between work, short break, and long break modes
function switchMode(status) {
    clearInterval(countdown);  // pause the timer
    timeLeft = TIMES[status];  // set timeLeft based on the selected mode
    currentStatus = status;  // update currentStatus
    updateDisplay();
    showStartBtn();
    updateTypeBtnBackgrounds();
}

// get the next status based on the current status and pomodoro count
function getNextStatus() {
    if (currentStatus !== 'work') return 'work';
    return (pomodoroCount) % 4 === 0 ? 'long_break' : 'short_break';
}

// handle the end of a session, update pomodoro count if it was a work session, and switch to the next mode
function handleSessionEnd() {
    clearInterval(countdown);
    alert("time is up!");

    if (currentStatus === 'work') {
        pomodoroCount++;
        totalPomodoroCount++;
        window.pomodoroStore.setCount(totalPomodoroCount);
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



// APP CONTROLS -----------------------------------------------------------------------------------

// window controls 
const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');

closeBtn.addEventListener('click', () => window.windowControls.close());
minimizeBtn.addEventListener('click', () => window.windowControls.minimize());


// title bar appear & disappear
const titleBar = document.querySelector(".title-bar");

window.windowControls.onCursorEnter(() => {
    titleBar.classList.remove("hidden");
});

window.windowControls.onCursorLeave(() => {
    titleBar.classList.add("hidden");
});
