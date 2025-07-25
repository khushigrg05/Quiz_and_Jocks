let questions = [];

    async function fetchQuizQuestions() {
      const res = await fetch('https://opentdb.com/api.php?amount=3&type=multiple');
      const data = await res.json();
      questions = data.results;
      renderAllQuestions();
    }

    function decodeHTML(html) {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }

    function renderAllQuestions() {
      const container = document.getElementById("allQuestions");
      container.innerHTML = "";
      document.getElementById("quizResult").textContent = "";
      questions.forEach((q, index) => {
        const correct = decodeHTML(q.correct_answer);
        const options = [...q.incorrect_answers.map(decodeHTML), correct].sort(() => Math.random() - 0.5);
        const box = document.createElement("div");
        box.className = "quiz-box";
        box.innerHTML = `<p class="quiz-q">Q${index + 1}: ${decodeHTML(q.question)}</p><div class="quiz-options"></div>`;
        const optContainer = box.querySelector(".quiz-options");
        options.forEach(opt => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="radio" name="q${index}" value="${opt}"> ${opt}`;
          optContainer.appendChild(label);
        });
        container.appendChild(box);
      });
    }

    function checkAllAnswers() {
      let score = 0;
      questions.forEach((q, index) => {
        const correct = decodeHTML(q.correct_answer);
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const options = document.getElementsByName(`q${index}`);
        options.forEach(opt => {
          if (opt.value === correct) {
            opt.parentElement.style.background = '#d1fae5';
          } else if (opt.checked && opt.value !== correct) {
            opt.parentElement.style.background = '#fee2e2';
          }
        });
        if (selected && selected.value === correct) {
          score++;
        }
      });
      document.getElementById("quizResult").textContent = `You scored ${score} out of ${questions.length}`;
      document.querySelector(".submit-btn").style.display = 'none';
      document.querySelector(".retake-btn").style.display = 'inline-block';
    }

    function retakeQuiz() {
      document.querySelector(".submit-btn").style.display = 'inline-block';
      document.querySelector(".retake-btn").style.display = 'none';
      fetchQuizQuestions();
    }

    async function fetchJokes() {
      const jokeList = document.getElementById("jokeList");
      jokeList.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        const res = await fetch(`https://api.chucknorris.io/jokes/random?category=dev`);
        const data = await res.json();
        const li = document.createElement("li");
        li.textContent = data.value || "No joke available.";
        jokeList.appendChild(li);
      }
    }

    fetchQuizQuestions();
  