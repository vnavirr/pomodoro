const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timerText = document.getElementById('timerText');

let countdown;
let timeLeft = 25 * 60;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
        }
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
    timeLeft = 25 * 60;
    updateDisplay();

    // update UI
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';
});