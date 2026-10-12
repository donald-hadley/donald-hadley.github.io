var ITEMS = [
  {w:"diffuse", d:"to spread or scatter widely; wordy, unfocused"},
  {w:"doleful", d:"sad; dreary"},
  {w:"posthumous", d:"occurring or published after death"},
  {w:"spurious", d:"false; not genuine"},
  {w:"unbridled", d:"uncontrolled; lacking in restraint"},

  {w:"comely", d:"having a pleasing appearance"},
  {w:"erratic", d:"not regular or consistent; undependable"},
  {w:"feign", d:"to pretend"},
  {w:"impoverished", d:"poor; in a state of poverty; depleted"},
  {w:"sully", d:"to soil, stain, tarnish"},

  {w:"abridge", d:"to make shorter"},
  {w:"adherent", d:"a follower; supporter"},
  {w:"rift", d:"a split; break; breach"},
  {w:"terse", d:"brief and to the point (slightly negative connotation)"},
  {w:"trite", d:"commonplace; overused"},

  {w:"arduous", d:"requiring much effort"},
  {w:"auspicious", d:"favorable; fortunate"},
  {w:"juxtapose", d:"to place contrasting things side-by-side for comparison"},
  {w:"pliant", d:"bending readily; easily influenced"},
  {w:"revile", d:"to attack with words; call bad names"},

  {w:"abscond", d:"to run off and hide"},
  {w:"catalyst", d:"a substance that causes or hastens a change"},
  {w:"incorrigible", d:"not able to be corrected; beyond control"},
  {w:"intrepid", d:"brave; fearless; unshakable"},
  {w:"precipice", d:"a very steep cliff; the brink or edge of disaster"},

  {w:"latent", d:"hidden; present but not realized"},
  {w:"morose", d:"having a gloomy or sullen manner; not friendly"},
  {w:"opaque", d:"not letting light through; not clear or lucid; dense"},
  {w:"paramount", d:"chief in importance; above all others"},
  {w:"prattle", d:"to talk in an aimless or foolish way; babble"},

  {w:"cadence", d:"a flow or pattern of sounds, movements, or events"},
  {w:"denotation", d:"the literal meaning of a word—free from emotion"},
  {w:"genre", d:"a category of artistic, musical, or literary composition"},
  {w:"sedition", d:"the act of inciting resistance or rebellion against an established government"},
  {w:"transcendentalism", d:"a 19th-century philosophical and literary movement emphasizing nature and individualism"}
];

var current = null;
var opts = [];
var locked = false;
var nextQuestionTimer = null;

var total = 0;
var correct = 0;
var wrong = 0;
var streak = 0;

var wrongWords = [];

function randInt(n) { return Math.floor(Math.random() * n); }

function shuffle(a) {
  var i, j, t;
  for (i = a.length - 1; i > 0; i--) {
    j = randInt(i + 1);
    t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function setText(id, s) {
  var el = document.getElementById(id);
  if (el) el.textContent = s;
}

function setStatus(s) { setText("status", s); }

function setStats() {
  setText("count", "Question: " + total);
  setText("score", "Correct: " + correct + " | Wrong: " + wrong);
  setText("streak", "Streak: " + streak);
}

function disableChoices(dis) {
  var i, b;
  for (i = 0; i < 4; i++) {
    b = document.getElementById("b" + i);
    b.disabled = dis;
  }
}

function clearChoiceClasses() {
  var i, b;
  for (i = 0; i < 4; i++) {
    b = document.getElementById("b" + i);
    b.className = "";
  }
}

function buildOptions(correctWord) {
  var all = [];
  var i;
  for (i = 0; i < ITEMS.length; i++) all.push(ITEMS[i].w);

  var wrongs = [];
  while (wrongs.length < 3) {
    var w = all[randInt(all.length)];
    if (w === correctWord) continue;
    if (wrongs.indexOf(w) >= 0) continue;
    wrongs.push(w);
  }
  var o = [correctWord, wrongs[0], wrongs[1], wrongs[2]];
  return shuffle(o);
}

function renderWrongWords() {
  if (wrongWords.length === 0) {
    setText("wrongList", "None");
    return;
  }
  setText("wrongList", wrongWords.join(", "));
}

function addWrongWord(w) {
  if (wrongWords.indexOf(w) >= 0) return;
  wrongWords.push(w);
  renderWrongWords();
}

function nextQ() {
  window.clearTimeout(nextQuestionTimer);
  nextQuestionTimer = null;
  locked = false;
  disableChoices(false);
  clearChoiceClasses();
  setStatus("");

  current = ITEMS[randInt(ITEMS.length)];
  opts = buildOptions(current.w);

  setText("def", current.d);

  var letters = ["A", "B", "C", "D"];
  var i, b;
  for (i = 0; i < 4; i++) {
    b = document.getElementById("b" + i);
    b.textContent = letters[i] + ". " + opts[i];
    b.setAttribute("data-word", opts[i]);
  }

  total = total + 1;
  setStats();
}

function markCorrect() {
  var i, b;
  for (i = 0; i < 4; i++) {
    b = document.getElementById("b" + i);
    if (b.getAttribute("data-word") === current.w) b.className = "ok";
  }
}

function pick(i) {
  if (locked) return;
  locked = true;
  disableChoices(true);

  var b = document.getElementById("b" + i);
  var chosen = b.getAttribute("data-word");
  if (chosen === current.w) {
    b.className = "ok";
    correct = correct + 1;
    streak = streak + 1;
    setStatus("Correct");
  } else {
    b.className = "bad";
    wrong = wrong + 1;
    streak = 0;
    addWrongWord(current.w);
    markCorrect();
    setStatus("Wrong. Answer: " + current.w);
  }
  setStats();

  nextQuestionTimer = window.setTimeout(function() { nextQ(); }, 800);
}

function resetAll() {
  total = 0;
  correct = 0;
  wrong = 0;
  streak = 0;
  wrongWords = [];
  renderWrongWords();
  setStats();
  nextQ();
}

window.onload = function() {
  setStats();
  renderWrongWords();
  nextQ();
};
