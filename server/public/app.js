// 🔐 LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!data.token) return alert(data.message);

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  window.location.href =
    data.user.role === "teacher" ? "/teacher.html" : "/quiz.html";
}


// 🔐 SIGNUP
async function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();

  if (!data.token) return alert(data.message);

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  window.location.href = "/quiz.html";
}


// 🔒 PROTECT PAGE
function protectPage() {
  const token = localStorage.getItem("token");
  const current = window.location.pathname.split("/").pop();

  if ((current === "quiz.html" || current === "teacher.html") && !token) {
    window.location.href = "/login.html";
  }
}


// 🔓 LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
}


// 📊 QUIZ VARIABLES
let questions = [];
let currentQuestionIndex = 0;
let score = 0;


// 📥 LOAD QUIZ
async function loadQuiz() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/quiz/all-questions", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const data = await res.json();
  console.log("Questions:", data); // debug

  questions = data;
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  if (!q) return;

  document.getElementById("question").innerText = q.question;

  document.getElementById("a").innerText = q.options[0];
  document.getElementById("b").innerText = q.options[1];
  document.getElementById("d").innerText = q.options[3];

  // ❗ reset selection UI
  document.querySelectorAll(".choice").forEach(btn => {
    btn.classList.remove("selected");
  });
}


// ✅ SELECT ANSWER (TEXT MATCH)
function selectAnswer(selectedText) {
  selectedAnswer = selectedText; // ✅ store selection

  // 🎨 UI highlight (VERY IMPORTANT)
  const buttons = document.querySelectorAll(".choice");

  buttons.forEach(btn => {
    btn.classList.remove("selected");
    if (btn.innerText === selectedText) {
      btn.classList.add("selected");
    }
  });
}


function nextQuestion() {
  if (!selectedAnswer) {
    alert("Please select an option!");
    return;
  }

  const correct = questions[currentQuestionIndex].answer;

  if (selectedAnswer === correct) {
    score++;
  }

  selectedAnswer = null; // reset for next question

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById("score").innerText =
      "Your Score: " + score + "/" + questions.length;

    finishQuiz();
  }
}


// 🏁 FINISH QUIZ
function finishQuiz() {
  const token = localStorage.getItem("token");

  fetch("/api/quiz/submit-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      score,
      total: questions.length,
    }),
  });

  alert("Quiz Finished!");
  logout();
}


// ✅ SAFE EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  protectPage();

  const optionIds = ["a", "b", "c", "d"];

  optionIds.forEach((id) => {
    const btn = document.getElementById(id);

    if (btn) {
      btn.addEventListener("click", () => {
        selectAnswer(btn.innerText);
      });
    }
  });

  // only load quiz if on quiz page
  if (window.location.pathname.includes("quiz.html")) {
    loadQuiz();
  }
});