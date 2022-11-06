const frontPage = document.querySelector(".frontPage");
const quizPage = document.querySelector(".quizPage");
const startButton = document.querySelector("#start-button");
const timeLimit = document.querySelector("#timeLimit");
const question = document.querySelector("#question");
const answers = document.querySelector("#answers");
const bubbleAnswers = document.querySelector("#bubbleAnswers");
startButton.addEventListener("click", () => {
    frontPage.style.display = "none";
    quizPage.style.display = "block";
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// TYPEWRITER SCRIPT FOR THE MAIN PAGE'S TEXT //
// TYPEWRITER SCRIPT FOR THE MAIN PAGE'S TEXT //
// TYPEWRITER SCRIPT FOR THE MAIN PAGE'S TEXT //
class Typerwriter {
    constructor(el, options) {
        this.el = el;
        this.words = [...this.el.dataset.typewriter.split(",")];
        this.speed = options?.speed || 100;
        this.delay = options?.delay || 1500;
        this.repeat = options?.repeat;
        this.initTyping();
    }

    wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    toggleTyping = () => this.el.classList.toggle("typing");

    async typewrite(word) {
        await this.wait(this.delay);
        this.toggleTyping();
        for (const letter of word.split("")) {
            this.el.textContent += letter;
            await this.wait(this.speed);
        }
        this.toggleTyping();
        await this.wait(this.delay);
        this.toggleTyping();
        while (this.el.textContent.length !== 0) {
            this.el.textContent = this.el.textContent.slice(0, -1);
            await this.wait(this.speed);
        }
        this.toggleTyping();
    }

    async initTyping() {
        for (const word of this.words) {
            await this.typewrite(word);
        }
        if (this.repeat) {
            await this.initTyping();
        } else {
            this.el.style.animation = "none";
        }
    }
}

document.querySelectorAll("[data-typewriter]").forEach((el) => {
    new Typerwriter(el, {
        repeat: true,
    });
});
//https://codepen.io/Coding-in-Public/pen/yLPYjrv
// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 280;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
    info: {
        color: "green",
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD,
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD,
    },
};

const TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("progressBar").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
  )}</span>
</div>
`;

startTimer();

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML =
            formatTime(timeLeft);
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
            onTimesUp();
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}
