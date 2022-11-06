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
