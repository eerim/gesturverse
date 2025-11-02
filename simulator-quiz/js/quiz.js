const quizData = [
    {
        id: 1,
        countryName: 'Iran',
        correctAnswer: 'C',
        feedbackCorrect: "Gesture Guru! You correctly avoided insulting the driver in Iran.",
        feedbackIncorrect: "CULTURAL FOUL! The Thumbs-Up is a rude insult in Iran. You offended your kind driver!",
        animationText: "THUMBS-UP! = UP YOURS! (IRAN)",
        countryStamp: 'IRAN_THUMBS_UP'
    },
    {
        id: 2,
        countryName: 'Turkey',
        correctAnswer: 'C',
        feedbackCorrect: "Excellent! The 'OK' sign is aggressive and insulting in Turkey. You passed the test!",
        feedbackIncorrect: "CULTURAL FOUL! The 'OK' sign is highly offensive in Turkey. Watch the blunder!",
        animationText: "OK! (👌) = INSULT! (TURKEY)",
        countryStamp: 'TURKEY_OK_SIGN'
    },
    {
        id: 3,
        countryName: 'UK',
        correctAnswer: 'B',
        feedbackCorrect: "Perfect! The backward 'V' is a massive insult in the UK. You avoided a bar fight!",
        feedbackIncorrect: "CULTURAL FOUL! The backward 'V' is like giving the middle finger in the UK. Watch the blunder!",
        animationText: "V-SIGN (BACKWARDS) = INSULT! (UK)",
        countryStamp: 'UK_V_SIGN'
    },
    {
        id: 4,
        countryName: 'Bulgaria',
        correctAnswer: 'A',
        feedbackCorrect: "Smart Traveler! In Bulgaria, nodding up and down means NO. You correctly disagreed!",
        feedbackIncorrect: "CULTURAL FOUL! Your waiter thinks you hated the food, as up-and-down means 'No' in Bulgaria. Watch the blunder!",
        animationText: "UP/DOWN NOD = NO! (BULGARIA)",
        countryStamp: 'BULGARIA_NOD'
    },
    {
        id: 5,
        countryName: 'Philippines',
        correctAnswer: 'C',
        feedbackCorrect: "Master Communicator! The 'Come Here' finger is strictly for calling animals in the Philippines. You are safe!",
        feedbackIncorrect: "CULTURAL FOUL! That gesture is only used for calling dogs in the Philippines. Watch the blunder!",
        animationText: "COME HERE FINGER = DOG! (PHILIPPINES)",
        countryStamp: 'PHL_COME_HERE'
    }
];

let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = quizData.length;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Setup
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach((q, index) => {
        q.style.display = index === 0 ? 'block' : 'none';
    });
    updateProgressBar(1, totalQuestions, quizData[0].countryName);

    // 2. Add handlers for option selection
    questions.forEach(q => {
        const options = q.querySelectorAll('.option-item');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                const radio = option.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });
    });
});

// --- Progress and UI Updates ---

function updateProgressBar(current, total, country) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const percent = (current / total) * 100;
    
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${current} of ${total}: ${country}`;
}

function showMisunderstanding(text) {
    const animPlaceholder = document.getElementById('misunderstanding-animation');
    
    animPlaceholder.innerHTML = `<p style="font-family: var(--font-fancy); color: var(--color-incorrect);">❌ ${text}</p>`;
    animPlaceholder.style.display = 'flex';
    
    setTimeout(() => {
        animPlaceholder.style.display = 'none';
    }, 3000);
}

/**
 * Saves the unique country stamp to local storage if the answer is correct.
 * @param {string} stampId
 */
function unlockStamp(stampId) {
    let stamps = JSON.parse(localStorage.getItem('userStamps') || '[]');
    
    if (!stamps.includes(stampId)) {
        stamps.push(stampId);
        localStorage.setItem('userStamps', JSON.stringify(stamps));
        
        console.log(`Stamp "${stampId}" unlocked!`);
    }
}

window.checkAnswer = function(questionId) {
    const currentQuestionElement = document.getElementById(`question-${questionId}`);
    const selectedOption = currentQuestionElement.querySelector('.option-item.selected input');
    
    if (!selectedOption) {
        alert("Please select an option before proceeding!");
        return;
    }

    const currentQuestionData = quizData.find(q => q.id === questionId);
    const isCorrect = selectedOption.value === currentQuestionData.correctAnswer;
    
    if (isCorrect) {
        score++;
        unlockStamp(currentQuestionData.countryStamp);
        console.log("Correct! Score:", score);
    } else {
        showMisunderstanding(currentQuestionData.feedbackIncorrect);
        console.log("Incorrect! Score:", score);
    }

    currentQuestionElement.style.display = 'none';
    currentQuestionIndex++;
    
    if (currentQuestionIndex < totalQuestions) {
        const nextQuestionData = quizData[currentQuestionIndex];
        const nextQuestionElement = document.getElementById(`question-${nextQuestionData.id}`);
        if (nextQuestionElement) {
            nextQuestionElement.style.display = 'block';
            updateProgressBar(currentQuestionIndex + 1, totalQuestions, nextQuestionData.countryName);
        }
    } else {
        showResults();
        updateProgressBar(totalQuestions, totalQuestions, "Complete");
    }
}


function showResults() {
    document.getElementById('quiz-area').style.display = 'none';
    const resultSection = document.getElementById('quiz-result');
    resultSection.style.display = 'block';

    let unlockedStamps = JSON.parse(localStorage.getItem('userStamps') || '[]');
    
    const quizStampIds = quizData.map(q => q.countryStamp);
    const earnedQuizStamps = unlockedStamps.filter(stamp => quizStampIds.includes(stamp)).length;

    document.getElementById('result-score').innerHTML = `You answered <span style="color: var(--color-primary);">${score}</span> questions correctly, earning <span style="color: var(--color-secondary);" id="stamps-count">${earnedQuizStamps}</span> new cultural visas!`;

    const finalFeedbackBox = document.getElementById('final-feedback');
    const stampsDisplay = document.getElementById('stamps-display');
    
    // final Message
    if (score === totalQuestions) {
        finalFeedbackBox.textContent = "GESTURE MASTER! You have earned every visa in this challenge. Your cultural IQ is exceptional!";
        finalFeedbackBox.className = 'feedback-box correct';
    } else if (score >= totalQuestions * 0.6) {
        finalFeedbackBox.textContent = "CULTURAL NAVIGATOR! A strong performance. Review your mistakes to master the silent language.";
        finalFeedbackBox.className = 'feedback-box';
    } else {
        finalFeedbackBox.textContent = "NOVICE STATUS! Many cultural pitfalls remain. Review the Explorer section before booking your next flight.";
        finalFeedbackBox.className = 'feedback-box incorrect';
    }

    // display stamps
    stampsDisplay.innerHTML = `
        <p style="color: var(--color-secondary); font-weight: bold;">
            Earned Visas:
        </p>
        ${quizData.map(q => 
            `<span class="stamp-icon" style="color: ${unlockedStamps.includes(q.countryStamp) ? 'var(--color-secondary)' : '#ccc'};">
                ${unlockedStamps.includes(q.countryStamp) ? '✅' : '❌'} ${q.countryName}
            </span>`
        ).join('')}
    `;
}