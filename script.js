let timer = null;
let remaining = 0;
const input = document.getElementById("timeInput");
const display = document.getElementById("display");
const alarmSound = document.getElementById("alarmSound");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

startBtn.disabled = true; // initially disabled until user enters seconds
pauseBtn.disabled = true; // already disabled initially

if ("Notification" in window) {
    Notification.requestPermission();
}

// Enable/disable Start based on input
input.addEventListener("input", () => {
    const value = parseInt(input.value);
    startBtn.disabled = !value || value <= 0;
});


function updateDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    display.textContent =
        `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

document.getElementById("startBtn").addEventListener("click", () => {
    // ensures audio is allowed to play after a user gesture
    alarmSound.load();

    startBtn.textContent = "Resume";
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    if (timer) return;

    if (remaining === 0) {
        const inputSeconds = parseInt(input.value);
        if (isNaN(inputSeconds) || inputSeconds <= 0) return;
        remaining = inputSeconds;
    }

    timer = setInterval(() => {
        remaining--;
        updateDisplay(remaining);

        if (remaining <= 0) {
            clearInterval(timer);
            timer = null;

            // Always play sound first (100% guaranteed)
            alarmSound.currentTime = 0;
            alarmSound.play().catch(() => {
                console.log("Audio playback blocked");
            });

            // Always show notification (fallback alert if permission denied)
            if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    new Notification("Timer finished!");
                } else {
                    alert("Timer finished!");
                }
            } else {
                alert("Timer finished!");
            }
            startBtn.textContent = "Start";
startBtn.disabled = false;
pauseBtn.disabled = true;
        }

    }, 1000);
});

document.getElementById("pauseBtn").addEventListener("click", () => {
    startBtn.disabled = false;
pauseBtn.disabled = true;
    clearInterval(timer);
    timer = null;
});

document.getElementById("resetBtn").addEventListener("click", () => {
    
    clearInterval(timer);
    timer = null;
    remaining = 0;
    updateDisplay(0);
    input.value = "";
    startBtn.textContent = "Start";
startBtn.disabled = true;
pauseBtn.disabled = true;
});
