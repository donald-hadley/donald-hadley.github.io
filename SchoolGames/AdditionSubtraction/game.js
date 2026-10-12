const setup = document.querySelector('#setup');
const quiz = document.querySelector('#quiz');
const maximumInput = document.querySelector('#maximum');
const answerInput = document.querySelector('#answer');
const problem = document.querySelector('#problem');
const message = document.querySelector('#message');
const messageText = document.querySelector('#message-text');
const checkButton = document.querySelector('#check');
const setupError = document.querySelector('#setup-error');
const correctCountDisplay = document.querySelector('#correct-count');
const wrongCountDisplay = document.querySelector('#wrong-count');

let maximum = 10;
let correctAnswer = 0;
let correctCount = 0;
let wrongCount = 0;
let answerLocked = false;
let nextQuestionTimer = null;

function updateStats() {
  correctCountDisplay.textContent = correctCount;
  wrongCountDisplay.textContent = wrongCount;
}

function randomNumber(upTo = maximum) {
  return Math.floor(Math.random() * (upTo + 1));
}

function newProblem() {
  window.clearTimeout(nextQuestionTimer);
  nextQuestionTimer = null;
  answerLocked = false;
  quiz.classList.remove('celebrating');
  answerInput.disabled = false;
  checkButton.disabled = false;
  let first = randomNumber();
  let second = randomNumber();
  const addition = Math.random() < 0.5;

  if (!addition && second > first) {
    [first, second] = [second, first];
  }

  correctAnswer = addition ? first + second : first - second;
  problem.textContent = `${first} ${addition ? '+' : '−'} ${second}`;
  answerInput.value = '';
  messageText.textContent = '';
  message.className = '';
  message.hidden = true;
  answerInput.focus();
}

function startQuiz() {
  const selectedMaximum = Number(maximumInput.value);

  if (!Number.isInteger(selectedMaximum) || selectedMaximum < 1) {
    setupError.textContent = 'Enter a whole number of 1 or greater.';
    maximumInput.focus();
    return;
  }

  if (!Number.isSafeInteger(selectedMaximum) || selectedMaximum > Math.floor(Number.MAX_SAFE_INTEGER / 2)) {
    setupError.textContent = 'Choose a smaller maximum so the answers can be calculated accurately.';
    maximumInput.focus();
    return;
  }

  maximum = selectedMaximum;
  setupError.textContent = '';
  setup.hidden = true;
  quiz.hidden = false;
  newProblem();
}

function checkAnswer() {
  if (answerLocked || quiz.hidden) return;
  message.hidden = false;

  if (answerInput.value.trim() === '') {
    messageText.textContent = 'Enter an answer first.';
    message.className = 'wrong';
    answerInput.focus();
    return;
  }

  if (Number(answerInput.value) === correctAnswer) {
    answerLocked = true;
    correctCount++;
    updateStats();
    messageText.textContent = 'Hooray! You got it!';
    message.className = 'correct';
    quiz.classList.add('celebrating');
    problem.textContent = `${problem.textContent} = ${correctAnswer}`;
    answerInput.disabled = true;
    checkButton.disabled = true;
    nextQuestionTimer = window.setTimeout(newProblem, 3000);
  } else {
    wrongCount++;
    updateStats();
    messageText.textContent = 'Wrong — try again!';
    message.className = 'wrong';
    answerInput.select();
  }
}

document.querySelector('#start').addEventListener('click', startQuiz);
document.querySelector('#check').addEventListener('click', checkAnswer);
document.querySelector('#reset').addEventListener('click', () => {
  correctCount = 0;
  wrongCount = 0;
  updateStats();
  answerInput.focus();
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

answerInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') checkAnswer();
});
