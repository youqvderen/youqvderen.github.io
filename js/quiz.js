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

// ========== 测试模式：快速查看所有人格结果 ==========

function testAllResults() {
    const allTypes = Object.keys(quizConfig.results);
    let currentIndex = 0;
    
    function showNext() {
        if (currentIndex >= allTypes.length) {
            alert('测试完成！已查看全部 ' + allTypes.length + ' 种人格');
            return;
        }
        
        const type = allTypes[currentIndex];
        currentResultType = type;
        
        // 模拟该人格的得分
        const result = quizConfig.results[type];
        scores = generateFakeScores(type);
        
        // 显示结果
        calculateAndShowResult();
        
        // 显示导航提示
        setTimeout(() => {
            const confirmed = confirm(
                `【${currentIndex + 1}/${allTypes.length}】\n` +
                `人格: ${result.title} (${type})\n\n` +
                `图片显示正常吗？\n\n` +
                `点击"确定"查看下一个\n` +
                `点击"取消"停止测试`
            );
            if (confirmed) {
                currentIndex++;
                showNext();
            }
        }, 500);
    }
    
    showNext();
}

// 生成模拟得分
function generateFakeScores(type) {
    // 基础得分
    const base = {
        S: 8, O: 8, G: 8, C: 8,
        A: 8, I: 8, E: 8, W: 8
    };
    
    // 根据人格类型调整
    const adjustments = {
        'SOLO':  { S: 18, O: 2, G: 15, C: 5 },
        'ACTO':  { O: 16, A: 18, I: 2 },
        'WORR':  { G: 18, C: 3 },
        'OLDD':  { S: 15, G: 18, E: 16, A: 5 },
        'VANI':  { S: 3, O: 3, G: 3, C: 15 },
        'NPCS':  { S: 9, O: 9, G: 9, C: 9, A: 9, I: 9, E: 9, W: 9 },
        'JOCK':  { G: 16, A: 5, I: 15 },
        'PAPA':  { O: 16, E: 18, S: 5 },
        'DICK':  { W: 18, G: 3 },
        'NAXI':  { W: 18, A: 12 },
        'EATS':  { G: 16, E: 15 },
        'EATA':  { C: 16, W: 12 },
        'HOME':  { S: 16, I: 15, O: 3 },
        'AUDI':  { G: 5, C: 5 },
        'LOVE':  { O: 18, A: 16 },
        'FART':  { W: 16, C: 12 },
        'POWER': { G: 18, E: 16, S: 14 },
        'HUMOR': { C: 16, W: 14, G: 4 }
    };
    
    const adj = adjustments[type] || {};
    return { ...base, ...adj };
}

// 绑定到全局，方便控制台调用
window.testAllResults = testAllResults;
