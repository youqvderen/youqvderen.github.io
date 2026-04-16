let currentQuestion = 0;
let answers = [];
let scores = {};

function initScores() {
    // 8个维度：S/O, G/C, A/I, E/W
    scores = { 
        S: 0, O: 0, 
        G: 0, C: 0, 
        A: 0, I: 0, 
        E: 0, W: 0 
    };
}

function startQuiz() {
    currentQuestion = 0;
    answers = [];
    initScores();
    
    // 更新封面统计
    document.getElementById('qCount').textContent = quizConfig.questions.length;
    document.getElementById('typeCount').textContent = Object.keys(quizConfig.results).length;
    
    showPage('quizPage');
    renderQuestion();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function renderQuestion() {
    const q = quizConfig.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quizConfig.questions.length) * 100;
    
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('questionNumber').textContent = 
        `问题 ${currentQuestion + 1} / ${quizConfig.questions.length}`;
    document.getElementById('questionText').textContent = q.text;
    
    const optionsHtml = q.options.map((opt, idx) => `
        <div class="option" onclick="selectOption(${idx})" data-key="${String.fromCharCode(65 + idx)}">
            <div class="option-key">${String.fromCharCode(65 + idx)}</div>
            <div class="option-text">${opt.text}</div>
        </div>
    `).join('');
    
    document.getElementById('optionsContainer').innerHTML = optionsHtml;
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
}

function selectOption(idx) {
    const q = quizConfig.questions[currentQuestion];
    const optionScores = q.options[idx].scores;
    
    // 记录答案
    answers[currentQuestion] = idx;
    
    // 累加维度分数
    for (let dim in optionScores) {
        if (scores.hasOwnProperty(dim)) {
            scores[dim] += optionScores[dim];
        }
    }
    
    // 进入下一题或显示结果
    if (currentQuestion < quizConfig.questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        calculateAndShowResult();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        // 扣除当前题的分数
        const q = quizConfig.questions[currentQuestion];
        const prevAnswer = answers[currentQuestion];
        if (prevAnswer !== undefined) {
            const optionScores = q.options[prevAnswer].scores;
            for (let dim in optionScores) {
                if (scores.hasOwnProperty(dim)) {
                    scores[dim] -= optionScores[dim];
                }
            }
        }
        
        currentQuestion--;
        renderQuestion();
    }
}

function restartQuiz() {
    startQuiz();
}

// 键盘快捷键支持
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('quizPage').classList.contains('active')) return;
    
    const key = e.key.toUpperCase();
    if (['A', 'B', 'C', 'D'].includes(key)) {
        const idx = key.charCodeAt(0) - 65;
        const options = document.querySelectorAll('.option');
        if (options[idx]) {
            options[idx].click();
        }
    } else if (e.key === 'ArrowLeft' && currentQuestion > 0) {
        prevQuestion();
    }
});
