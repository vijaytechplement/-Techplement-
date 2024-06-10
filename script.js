const container = document.querySelector('.container');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const scoreCard = document.querySelector('.scoreCard');
const alert = document.querySelector('.alert');
const startBtn = document.querySelector('.startBtn');
const createQuizBtn = document.querySelector('.createQuizBtn');
const createQuizContainer = document.querySelector('.createQuizContainer');
const quizForm = document.querySelector('#quizForm');
const finishBtn = document.querySelector('.finishBtn');
const timer = document.querySelector('.timer');
const feedbackBox = document.querySelector('.feedback');

// Initialize quiz array
let quiz = [];
let currentQuestionIndex = 0;
let score = 0;
let quizOver = false;
let timeLeft = 30;
let timerID = null;

// Function to show questions
const showQuestions = () => {
    const questionDetails = quiz[currentQuestionIndex];
    questionBox.textContent = questionDetails.question;

    choicesBox.textContent = "";
    for (let i = 0; i < questionDetails.choices.length; i++) {
        const currentChoice = questionDetails.choices[i];
        const choiceDiv = document.createElement('div');
        choiceDiv.textContent = currentChoice;
        choiceDiv.classList.add('choice');
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener('click', () => {
            document.querySelectorAll('.choice').forEach(choice => choice.classList.remove('selected'));
            choiceDiv.classList.add('selected');
        });
    }

    if (currentQuestionIndex < quiz.length) {
        startTimer();
    }
}

// Function to check answers
const checkAnswer = () => {
    const selectedChoice = document.querySelector('.choice.selected');
    if (selectedChoice.textContent === quiz[currentQuestionIndex].choices[quiz[currentQuestionIndex].answer]) {
        displayAlert("Correct Answer✔");
        score++;
    } else {
        displayAlert(`Wrong Answer❌ ${quiz[currentQuestionIndex].choices[quiz[currentQuestionIndex].answer]} is the Correct Answer`);
    }
    timeLeft = 30;
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.length) {
        showQuestions();
    } else {
        stopTimer();
        showScore();
    }
}

// Function to show score and feedback
const showScore = () => {
    questionBox.textContent = "";
    choicesBox.textContent = "";
    scoreCard.textContent = `You Scored ${score} out of ${quiz.length}!`;
    displayAlert("Quiz finished!");
    nextBtn.textContent = "Play Again";
    quizOver = true;
    timer.style.display = "none";
    if (score === quiz.length) {
        feedbackBox.textContent = "Congratulations! You got all the answers correct!";
    } else if (score >= Math.floor(quiz.length / 2)) {
        feedbackBox.textContent = "Well done! You did a good job!";
    } else {
        feedbackBox.textContent = "Keep practicing! You can do better!";
    }
}

// Function to show alert
const displayAlert = (msg) => {
    alert.style.display = "block";
    alert.textContent = msg;
    setTimeout(() => {
        alert.style.display = "none";
    }, 2000);
}

// Function to start timer
const startTimer = () => {
    clearInterval(timerID); // Check for any existing timers
    timer.textContent = timeLeft;

    const countDown = () => {
        timer.textContent = timeLeft; // Display the current time left
        timeLeft--;
        if (timeLeft === 0) {
            clearInterval(timerID); // Stop the timer when time runs out
            const confirmUser = confirm("Time Up!!! Do you want to play the quiz again");
            if (confirmUser) {
                timeLeft = 30; // Reset the timer
                startQuiz();
            } else {
                startBtn.style.display = "block";
                container.style.display = "none";
                return;
            }
        }
    }
    timerID = setInterval(countDown, 1000);
}

// Function to stop timer
const stopTimer = () => {
    clearInterval(timerID);
}

// Function to shuffle questions
const shuffleQuestions = () => {
    for (let i = quiz.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quiz[i], quiz[j]] = [quiz[j], quiz[i]];
    }
    currentQuestionIndex = 0;
    showQuestions();
}

// Function to start quiz
const startQuiz = () => {
    timeLeft = 30;
    timer.style.display = "flex";
    shuffleQuestions();
}

// Function to save quiz to local storage
const saveQuiz = () => {
    localStorage.setItem('quiz', JSON.stringify(quiz));
}

// Function to load quiz from local storage
const loadQuiz = () => {
    const storedQuiz = localStorage.getItem('quiz');
    if (storedQuiz) {
        quiz = JSON.parse(storedQuiz);
    }
}

// Event listener for start button
startBtn.addEventListener('click', () => {
    startBtn.style.display = "none";
    container.style.display = "block";
    startQuiz();
});

// Event listener for create quiz button
createQuizBtn.addEventListener('click', () => {
    startBtn.style.display = "none";
    createQuizBtn.style.display = "none";
    createQuizContainer.style.display = "block";
});

// Event listener for form submission to add questions
quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = document.querySelector('#question').value;
    const option1 = document.querySelector('#option1').value;
    const option2 = document.querySelector('#option2').value;
    const option3 = document.querySelector('#option3').value;
    const option4 = document.querySelector('#option4').value;
    const answer = document.querySelector('#answer').value;

    const newQuestion = {
        question: question,
        choices: [option1, option2, option3, option4],
        answer: ['option1', 'option2', 'option3', 'option4'].indexOf(answer)
    };
    quiz.push(newQuestion);
    quizForm.reset();
    displayAlert('Question added successfully!');
});

// Event listener for finish quiz button
finishBtn.addEventListener('click', () => {
    saveQuiz();
    createQuizContainer.style.display = "none";
    startBtn.style.display = "block";
    createQuizBtn.style.display = "block";
    displayAlert('Quiz saved successfully!');
});

// Event listener for next button
nextBtn.addEventListener('click', () => {
    const selectedChoice = document.querySelector('.choice.selected');
    if (!selectedChoice && nextBtn.textContent === "Next") {
        displayAlert("Select your answer");
        return;
    }
    if (quizOver) {
        nextBtn.textContent = "Next";
        scoreCard.textContent = "";
        feedbackBox.textContent = "";
        currentQuestionIndex = 0;
        quizOver = false;
        score = 0;
        startQuiz();
    } else {
        checkAnswer();
    }
});

// Load the quiz from local storage on page load
window.onload = loadQuiz;
