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
    // 计算各维度主导倾向
    const dimScores = {
        S: scores.S >= scores.O ? 'S' : 'O',  // 社交维度
        G: scores.G >= scores.C ? 'G' : 'C',  // 态度维度
        A: scores.A >= scores.I ? 'A' : 'I',  // 表现维度
        E: scores.E >= scores.W ? 'E' : 'W'   // 知识维度
    };
    
    // 检查NPCS条件：三项及以上维度差距<=1，且不包括高训练水平人格
    const highTrainTypes = ['WORR', 'OLDD', 'PAPA', 'JOCK'];
    const isNPCS = checkNPCSCondition(dimScores, highTrainTypes);
    
    if (isNPCS) return 'NPCS';
    
    // 特定组合判定（优先级从高到低）
    
    // VANI 消失者：训练频率极低（S维度但得分都很低）
    if (scores.S < 5 && scores.O < 5 && scores.G < 5 && scores.C > 8) {
        return 'VANI';
    }
    
    // DICK 凯格尔爱好者：特定答案触发（第10题选B且W维度极高）
    if (scores.W > 12 && answers[9] === 1) {
        return 'DICK';
    }
    
    // ACTO 影帝：表现型极高且拍照相关答案
    if (scores.A > 10 && (answers[2] === 1 || answers[13] === 3)) {
        return 'ACTO';
    }
    
    // WORR 焦虑者：高G但低自我认同（通过特定答案模式判断）
    if (scores.G > 10 && answers[3] === 0 && scores.C < 5) {
        return 'WORR';
    }
    
    // LOVE 恋爱脑：社交型且特定答案
    if (dimScores.S === 'O' && scores.A > 8 && answers[10] === 0) {
        return 'LOVE';
    }
    
    // AUDI 审计师：低G且特定生活方式答案
    if (scores.G < 6 && scores.C < 6 && answers[11] === 1) {
        return 'AUDI';
    }
    
    // HOME 宅健：内向型且家庭训练答案
    if (dimScores.S === 'S' && answers[14] === 0 && scores.O < 5) {
        return 'HOME';
    }
    
    // EATS/EATA 饮食型：通过饮食答案区分
    if (answers[5] === 0 && scores.G > 8) {
        return 'EATS';
    }
    if (answers[5] === 2 && scores.C > 6) {
        return 'EATA';
    }
    
    // FART 蛋白质享受者：特定饮食答案
    if (answers[5] === 1 && scores.W > 6) {
        return 'FART';
    }
    
    // NAXI 动作发明家：野路子且批判性
    if (scores.W > 10 && answers[12] === 2) {
        return 'NAXI';
    }
    
    // OLDD 老登：高G高E且内向
    if (scores.G > 12 && scores.E > 8 && dimScores.S === 'S' && dimScores.A === 'I') {
        return 'OLDD';
    }
    
    // PAPA 教皇：理论派且社交指导型
    if (dimScores.E === 'E' && dimScores.S === 'O' && answers[4] === 0) {
        return 'PAPA';
    }
    
    // JOCK 暗自较劲：高G且比较行为
    if (scores.G > 8 && answers[6] === 2 && dimScores.A === 'I') {
        return 'JOCK';
    }
    
    // SOLO 独行侠：默认高G内向型
    if (dimScores.S === 'S' && dimScores.G === 'G') {
        return 'SOLO';
    }
    
    // 默认 fallback
    return 'NPCS';
}

function checkNPCSCondition(dimScores, excludeTypes) {
    // 计算各维度得分差距
    const gaps = [
        Math.abs(scores.S - scores.O),
        Math.abs(scores.G - scores.C),
        Math.abs(scores.A - scores.I),
        Math.abs(scores.E - scores.W)
    ];
    
    // 统计差距<=1的维度数量
    const closeGaps = gaps.filter(gap => gap <= 1).length;
    
    // 三项及以上维度平衡
    if (closeGaps >= 3) {
        // 检查是否属于高训练水平类型
        const currentType = dimScores.S + dimScores.G + dimScores.A + dimScores.E;
        // 简化的类型代码检查（实际逻辑更复杂，这里简化处理）
        return true;
    }
    
    return false;
}

function getResult(type) {
    return quizConfig.results[type] || generateGenericResult(type);
}

function generateGenericResult(type) {
    return {
        title: `${type} 神秘人格`,
        icon: '❓',
        desc: '你的健身人格超越了现有分类，是一种独特的存在。你身上融合了多种特质，无法被简单定义。',
        tags: ['独特', '融合', '超越分类']
    };
}

function renderDimensionScores() {
    const pairs = [
        ['S', 'O', '社恐独狼', '社交蝴蝶'],
        ['G', 'C', '硬核狠人', '佛系养生'],
        ['A', 'I', '表现型', '内敛型'],
        ['E', 'W', '理论派', '野路子']
    ];
    
    let html = '';
    
    pairs.forEach(([a, b, aName, bName]) => {
        const total = scores[a] + scores[b];
        const aPercent = total > 0 ? Math.round((scores[a] / total) * 100) : 50;
        const dominant = scores[a] >= scores[b] ? a : b;
        const dim = quizConfig.dimensions[dominant];
        
        html += `
            <div class="dimension-item" style="border-left-color: ${dim.color}">
                <div class="dimension-name">${aName} vs ${bName}</div>
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
    
    const dims = ['S', 'G', 'A', 'E', 'O', 'C', 'I', 'W'];
    const angleStep = (Math.PI * 2) / 8;
    
    // 绘制网格
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
    
    // 绘制轴线和标签
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
        ctx.fillStyle = quizConfig.dimensions[dim]?.color || '#666';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dim, labelX, labelY);
    });
    
    // 计算数据点（归一化到0-1）
    const maxScore = 15; // 假设最大可能得分
    const dataPoints = dims.map(dim => Math.min(scores[dim] / maxScore, 1));
    
    // 绘制数据区域
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
    
    // 绘制数据点
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
    const text = `【${type} - ${title}】\n${desc}\n\n快来测试你的健身房人格！`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => alert('结果已复制！'));
    } else {
        alert('请手动复制');
    }
}
