const frontPage = document.querySelector(".frontPage");
const quizPage = document.querySelector(".quizPage");
const endPage = document.querySelector(".endPage");
const startButton = document.querySelector("#start-button");
const timeLimit = document.querySelector("#timeLimit");
const question = document.querySelector("#question");
const scoreText = document.querySelector("#scoreText");
const emoji = document.querySelector("#emoji");
const answers = Array.from(document.querySelectorAll(".answer"));
const bubbleAnswers = document.querySelector("#bubbleAnswers");
const inputBar = document.querySelector("#questions");
const questionNbStr = document.querySelector("#questions");
const minQuestion = 0;
const maxQuestion = 10;
let apiUrl = "https://the-trivia-api.com/api/questions?";
let currentQuestion = {};
let questions = [];
let currentQuestionNumber = 0;
let score = 0;
let questionNb;

startButton.addEventListener("click", () => {
    questionNb = parseInt(questionNbStr.value);
    if (questionNb > minQuestion && questionNb <= maxQuestion) {
        frontPage.style.display = "none";
        quizPage.style.display = "block";
        apiUrl = `${apiUrl}limit=${questionNb}`;

        fetchJSON((data) => {
            questions = data;
            passToNextQuestion();
        });

        startTimer();
        createDots();
    } else {
        alert("Please enter a valid number of questions.");
    }
});

async function fetchJSON(callback = () => {}) {
    const response = await fetch(apiUrl);
    const data = await response.json();

    callback(data);
}

function createDots() {
    for (let i = 0; i < questionNb; i++) {
        let newSpan = document.createElement("span");

        newSpan.setAttribute("data-number", i);
        newSpan.classList.add("dot");

        let bubbleAnswersDiv = document.getElementById("bubbleAnswers");
        bubbleAnswersDiv.appendChild(newSpan);
    }
}

function passToNextQuestion() {
    currentQuestion = questions[currentQuestionNumber];
    displayQuestionAndAnswers();
}

function displayQuestionAndAnswers() {
    //displays a question
    let questionNumPool = shuffleArray([0, 1, 2, 3]); // 1 3 0 4
    let numberOfAnswers = 4;

    answers[questionNumPool.pop()].innerHTML =
        questions[currentQuestionNumber].correctAnswer; // [3]

    for (let i = 0; i < numberOfAnswers - 1; i++) {
        // let poppedQuestion = questionNumPool.pop();
        // let btnGetted = answers[poppedQuestion];
        // btnGetted.innerHTML
        answers[questionNumPool.pop()].innerHTML =
            questions[currentQuestionNumber].incorrectAnswers[i];
    }

    question.innerHTML = questions[currentQuestionNumber].question;
}

answers.forEach((e) => {
    e.addEventListener("click", () => {
        if (e.textContent === questions[currentQuestionNumber].correctAnswer) {
            Array.from(document.querySelectorAll(".dot"))[
                currentQuestionNumber
            ].style.backgroundColor = "lightGreen";

            score++;
        } else {
            Array.from(document.querySelectorAll(".dot"))[
                currentQuestionNumber
            ].style.backgroundColor = "Crimson";
        }
        checkQuestionScore();
        passToNextQuestion();
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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

function setProgressBar() {
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
}

setProgressBar();

function onTimesUp() {
    Array.from(document.querySelectorAll(".dot"))[
        currentQuestionNumber
    ].style.backgroundColor = "Crimson";

    checkQuestionScore();
    passToNextQuestion();
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
            setProgressBar();

            timePassed = 0;
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
function checkQuestionScore() {
    currentQuestionNumber++;
    if (currentQuestionNumber >= questions.length) {
        dislayEndPage();
        currentQuestionNumber--;
    }
}
function dislayEndPage() {
    quizPage.style.display = "none";
    endPage.style.display = "block";
    scoreText.innerHTML = `Score : ${score} / ${questions.length}`;
    let scorePercentage = (score / questions.length) * 100;
    if (scorePercentage < 20 && scorePercentage >= 0) {
        emoji.src = "/pictures/20-0.jpg";
    } else if (scorePercentage < 40 && scorePercentage >= 20) {
        emoji.src = "/pictures/40-20.jpg";
    } else if (scorePercentage < 60 && scorePercentage >= 40) {
        emoji.src = "/pictures/60-40.jpg";
    } else if (scorePercentage < 80 && scorePercentage >= 60) {
        emoji.src = "/pictures/80-60.jpg";
    } else if (scorePercentage < 100 && scorePercentage >= 80) {
        emoji.src =
            "C:/Users/aliba/Documents/Quiz_Javascript/pictures/100-80.jpg";
    } else console.log("Error, could not load the picture!");
}
