// Element
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const quizOptions = document.getElementById("quiz-options");
const questionText = document.getElementById("question-text");
const answerGrid = document.getElementById("answer-grid");
const resultText = document.getElementById("result-text");
const restartBtn = document.getElementById("restart-btn");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Starta Quiz - Anropet till Open Trivia Databas API (otd)
quizOptions.addEventListener("submit", async (event) => {
  event.preventDefault(); // Förhindra sidladdning vid formulärinskick

  // Hämta användarval från formuläret
  const numQuestions = document.getElementById("num-questions").value;
  const category = document.getElementById("category").value;
  const difficulty = document.getElementById("difficulty").value;

  
  const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;

  try {
    // Hämta frågor från API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Kontrollera API-respons och mappa frågedata till ett strukturerat format
    questions = data.results.map((q) => ({
      question: q.question, 
      correctAnswer: q.correct_answer, 
      answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5), // Blanda alternativen
    }));

    currentQuestionIndex = 0; // Återställ fråga-index
    score = 0; // Återställ poäng

    // Visa quiz-skärmen och dölja startskärmen
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    // Ladda första frågan
    loadQuestion();
  } catch (error) {
    console.error("Fel vid hämtning av frågor från API:", error);
    alert("Kunde inte ladda frågorna. Försök igen.");
  }
});

// Ladda fråga till UI
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.innerHTML = currentQuestion.question; 
  answerGrid.innerHTML = ""; // Rensa tidigare svarsalternativ

  // Skapa svarsknappar
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer; 
    button.classList.add("answer-btn");
    button.addEventListener("click", () => handleAnswer(button, answer, currentQuestion.correctAnswer));
    answerGrid.appendChild(button);
  });
}

// Hantera användarens svar
function handleAnswer(button, selected, correct) {
  const isCorrect = selected === correct;

  // visa feedbacken
  if (isCorrect) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
    // Visa rätt svar
    const correctButton = Array.from(answerGrid.children).find((btn) => btn.textContent === correct);
    correctButton.classList.add("correct");
  }

  // Inaktivera alla knappar
  Array.from(answerGrid.children).forEach((btn) => (btn.disabled = true));

  // Vänta och ladda nästa fråga eller visa resultatet
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 2000);
}

// Visa resultatet
function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  resultText.textContent = `You got ${score} out of ${questions.length} correct!`;
}

// Starta om quizet
restartBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
