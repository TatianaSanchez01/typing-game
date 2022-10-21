const quotes = [
    "For the last time, world of warcraft is not a cult",
    "It would be like Beyonce riding a dinosaur in the middle of Times Square. People would notice",
    "No one in Idris is going to teach you how to fight in five inch heels",
    "I'll love you until I die. And if there's a life after this, I'll love you then too",
    "When Glorious exploded, you saved my life",
    "When you walk into a room, magic or not, that lights up everything",
    "The law is hard, but it is the law",
    "You know, I pray every day... every day to the angels that they will see that our love is stronger than their spite",
    "It's more fun to break the rules than to follow them",
    "All the legends are true"
];

const quote = document.getElementById('quote');
const input = document.getElementById('typed-value');
const start = document.getElementById('start');
const message = document.getElementById('message');
const gamerName = document.getElementById('gamer-name');
const scoresUnorderedList = document.getElementById('scores-unordered-list');
const scores = getScores();

let wordQueue;
let highlightPosition;
let startTime;

start.addEventListener('click', startGame);
input.addEventListener('input', checkInput);

function startGame() {
    console.log("Game started!");

    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quoteText = quotes[quoteIndex];
    const scoreItem = {
        name: gamerName.value,
        milliseconds: 0
    };

    scores.push(scoreItem);
    initializeGame();


    wordQueue = quoteText.split(' ');
    quote.innerHTML = wordQueue.map(word => (`<span>${word}</span>`)).join('');


    highlightPosition = 0;
    quote.childNodes[highlightPosition].className = 'highlight';

    startTime = new Date().getTime();

    document.body.className = "";
    start.className = "started";
    setTimeout(() => {
        startTime.className = "button";
    }, 2000);

}

function checkInput() {
    const currentWord = wordQueue[0].replaceAll(".", "").replaceAll(",", "");
    const typedValue = input.value.trim();


    if (currentWord !== typedValue) {
        input.className = currentWord.startsWith(typedValue) ? "" : "error";
        return;
    }

    wordQueue.shift();
    input.value = "";
    quote.childNodes[highlightPosition].className = ""; // unhighlight word

    if (wordQueue.length === 0) { // if we have run out of words then game over.
        gameOver();
        return;
    }

    highlightPosition++;
    quote.childNodes[highlightPosition].className = 'highlight';
}

function gameOver() {
    const elapsedTime = new Date().getTime() - startTime;
    document.body.className = "winner";
    message.innerHTML = `<span class="congrats">Congratulations!</span> <br>
         You finished in ${elapsedTime / 1000} seconds.
`;

    const lastScoreItem = scores.pop();
    lastScoreItem.milliseconds = elapsedTime;
    scores.push(lastScoreItem);

    saveScores();

    while (scoresUnorderedList.firstChild) {
        scoresUnorderedList.removeChild(scoresUnorderedList.firstChild);
    }

    for (let score of getScores()) {
        const li = createElementForScore(score);
        scoresUnorderedList.appendChild(li);
    }
}

function getScores() {
    const noScoreFound = "[]";
    const scoresJSON = localStorage.getItem('scores') || noScoreFound;
    return JSON.parse(scoresJSON);
}

function saveScores() {
    const data = JSON.stringify(scores);
    localStorage.setItem('scores', data);
}

function createElementForScore(score) {
    const template = document.getElementById("score-item-template");
    const newListItem = template.content.cloneNode(true);

    const text = newListItem.querySelector(".score-text");
    text.innerHTML = score.name + " in " + score.milliseconds / 1000 + " seconds.";
    return newListItem;
}

function initializeGame() {
    quote.innerHTML = '';
    message.innerHTML = '';
}
