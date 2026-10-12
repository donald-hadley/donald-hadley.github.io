const setup = document.querySelector('#setup');
const quiz = document.querySelector('#quiz');
const maximumInput = document.querySelector('#maximum');
const setupError = document.querySelector('#setup-error');
const firstNumber = document.querySelector('#first-number');
const secondNumber = document.querySelector('#second-number');
const symbol = document.querySelector('#symbol');
const message = document.querySelector('#message');
const messageText = document.querySelector('#message-text');
const lessButton = document.querySelector('#less');
const greaterButton = document.querySelector('#greater');
const correctDisplay = document.querySelector('#correct-count');
const wrongDisplay = document.querySelector('#wrong-count');

let maximum = 10;
let first = 0;
let second = 1;
let correctCount = 0;
let wrongCount = 0;
let answerLocked = false;
let nextQuestionTimer = null;

function updateStats() {
  correctDisplay.textContent = correctCount;
  wrongDisplay.textContent = wrongCount;
}

function newProblem() {
  window.clearTimeout(nextQuestionTimer);
  nextQuestionTimer = null;
  quiz.classList.remove('celebrating');
  lessButton.classList.remove('correct-choice');
  greaterButton.classList.remove('correct-choice');
  first = Math.floor(Math.random() * (maximum + 1));
  // Choose uniformly from the remaining numbers without retrying equal pairs.
  second = Math.floor(Math.random() * maximum);
  if (second >= first) second++;
  firstNumber.textContent = first;
  secondNumber.textContent = second;
  symbol.textContent = '?';
  messageText.textContent = '';
  message.className = '';
  message.hidden = true;
  answerLocked = false;
  lessButton.disabled = false;
  greaterButton.disabled = false;
  lessButton.focus();
}

function startQuiz() {
  const selectedMaximum = Number(maximumInput.value);
  if (!Number.isInteger(selectedMaximum) || selectedMaximum < 1) {
    setupError.textContent = 'Enter a whole number of 1 or greater.';
    maximumInput.focus();
    return;
  }
  if (!Number.isSafeInteger(selectedMaximum) || selectedMaximum >= Number.MAX_SAFE_INTEGER) {
    setupError.textContent = 'Choose a smaller maximum so the numbers can be compared accurately.';
    maximumInput.focus();
    return;
  }
  maximum = selectedMaximum;
  setupError.textContent = '';
  setup.hidden = true;
  quiz.hidden = false;
  newProblem();
}

function checkAnswer(answer) {
  if (answerLocked || quiz.hidden) return;
  message.hidden = false;
  const expected = first < second ? '<' : '>';
  if (answer === expected) {
    answerLocked = true;
    correctCount++;
    symbol.textContent = expected;
    messageText.textContent = 'Hooray! You got it!';
    message.className = 'correct';
    quiz.classList.add('celebrating');
    (expected === '<' ? lessButton : greaterButton).classList.add('correct-choice');
    lessButton.disabled = true;
    greaterButton.disabled = true;
    nextQuestionTimer = window.setTimeout(newProblem, 3000);
  } else {
    wrongCount++;
    messageText.textContent = 'Try again! The open side faces the bigger number.';
    message.className = 'wrong';
  }
  updateStats();
}

document.querySelector('#start').addEventListener('click', startQuiz);
lessButton.addEventListener('click', () => checkAnswer('<'));
greaterButton.addEventListener('click', () => checkAnswer('>'));
document.querySelector('#reset').addEventListener('click', () => {
  correctCount = 0;
  wrongCount = 0;
  updateStats();
});
document.querySelector('#settings').addEventListener('click', () => {
  window.clearTimeout(nextQuestionTimer);
  nextQuestionTimer = null;
  quiz.hidden = true;
  setup.hidden = false;
  maximumInput.focus();
});
maximumInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') startQuiz();
});
document.addEventListener('keydown', event => {
  if (!quiz.hidden && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey && (event.key === '<' || event.key === '>')) {
    event.preventDefault();
    checkAnswer(event.key);
  }
});
