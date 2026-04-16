function calculateAndShowResult() {
    const type = calculateResult();
    const result = getResult(type);
    
    document.getElementById('resultType').textContent = `${type} 人格类型`;
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultIcon').textContent = result.icon;
    document.getElementById('resultDesc').textContent = result.desc;
    
    renderDimensionScores();
    drawRadarChart();
    showPage('resultPage');
}

function calculateResult() {
    const hiddenCode = checkHiddenCondition();
    if (hiddenCode) return hiddenCode;
    
    return [
        scores.E >= scores.I ? 'E' : 'I',
        scores.S >= scores.N ? 'S' : 'N',
        scores.T >= scores.F ? 'T' : 'F',
        scores.J >= scores.P ? 'J' : 'P'
    ].join('');
}

function checkHiddenCondition() {
    const hidden = quizConfig.hiddenTypes;
    if (!hidden) return null;
    
    const sorted = Object.entries(hidden).sort((a, b) => 
        (b[1].priority || 0) - (a[1].priority || 0)
    );
    
    for (const [code, config] of sorted) {
        let triggered = false;
        
        if (config.condition === 'allEqual') {
            const pairs = [['E','I'], ['S','N'], ['T','F'], ['J','P']];
            triggered = pairs.every(([a,b]) => Math.abs(scores[a]-scores[b]) <= 1);
        } else if (config.condition === 'custom' && config.trigger) {
            triggered = config.trigger(scores, answers);
        }
        
        if (triggered) return code;
    }
    
    return null;
}

function getResult(type) {
    if (quizConfig.hiddenTypes && quizConfig.hiddenTypes[type]) {
        return quizConfig.hiddenTypes[type];
    }
    return quizConfig.results[type] || generateGenericResult(type);
}

function generateGenericResult(type) {
    return {
        title: `${type} 独特人格`,
        icon: '✨',
        desc: '你拥有独特的性格组合，兼具多种特质的优势。这种组合让你在不同情境下都能灵活应对。',
        tags: ['独特', '多元', '适应']
    };
}

function renderDimensionScores() {
    const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];
    let html = '';
    
    pairs.forEach(([a, b]) => {
        const total = scores[a] + scores[b];
        const aPercent = total > 0 ? Math.round((scores[a] / total) * 100) : 50;
        const dominant = scores[a] >= scores[b] ? a : b;
        const dim = quizConfig.dimensions[dominant];
        
        html += `
            <div class="dimension-item" style="border-left-color: ${dim.color}">
                <div class="dimension-name">${quizConfig.dimensions[a].name} vs ${quizConfig.dimensions[b].name}</div>
                <div class="dimension-value" style="color: ${dim.color}">
                    ${dim.name} ${scores[a] >= scores[b] ? aPercent : 100 - aPercent}%
                </div>
                <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 4px;">${dim.desc}</div>
            </div>
        `;
    });
    
    document.getElementById('dimensionScores').innerHTML = html;
}

function drawRadarChart() {
    const canvas = document.getElementById('radarCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const dims = ['E', 'S', 'T', 'J', 'I', 'N', 'F', 'P'];
    const angleStep = (Math.PI * 2) / 8;
    
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let j = 0; j < 8; j++) {
            const angle = j * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius * i / 3);
            const y = centerY + Math.sin(angle) * (radius * i / 3);
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    dims.forEach((dim, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.strokeStyle = '#e5e7eb';
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        const labelX = centerX + Math.cos(angle) * (radius + 20);
        const labelY = centerY + Math.sin(angle) * (radius + 20);
        ctx.fillStyle = quizConfig.dimensions[dim].color;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dim, labelX, labelY);
    });
    
    const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];
    const dataPoints = [];
    
    pairs.forEach(([a, b]) => {
        const total = scores[a] + scores[b];
        const val = total > 0 ? Math.max(scores[a], scores[b]) / total : 0.5;
        dataPoints.push(val, val);
    });
    
    ctx.beginPath();
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    
    dataPoints.forEach((val, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = val * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    dataPoints.forEach((val, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = val * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        ctx.beginPath();
        ctx.fillStyle = '#6366f1';
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function copyResult() {
    const type = document.getElementById('resultType').textContent;
    const title = document.getElementById('resultTitle').textContent;
    const desc = document.getElementById('resultDesc').textContent;
    const text = `【${type} - ${title}】\n${desc}\n\n快来测试你的人格类型吧！`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => alert('结果已复制！'));
    } else {
        alert('请手动复制');
    }
}
