// 存储所有得分用于计算备选
let allScores = {};
let currentResultType = '';

function calculateAndShowResult() {
    // 保存完整得分
    allScores = { ...scores };
    
    const type = calculateResult();
    currentResultType = type;
    const result = getResult(type);
    
    // ========== 修复：兼容新旧版本的 DOM 操作 ==========
    
    // 中文名称（新：resultTitleCN，旧：resultTitle）
    const titleCN = document.getElementById('resultTitleCN') || document.getElementById('resultTitle');
    if (titleCN) titleCN.textContent = result.title;
    
    // 英文名称（新：resultTitleEN）
    const titleEN = document.getElementById('resultTitleEN');
    if (titleEN) titleEN.textContent = result.titleEn || type;
    
    // 图标（新旧都有）
    const iconEl = document.getElementById('resultIcon');
    if (iconEl) iconEl.textContent = result.icon;
    
    // 口号/描述（新：resultSlogan，旧：resultDesc）
    const sloganEl = document.getElementById('resultSlogan') || document.getElementById('resultDesc');
    if (sloganEl) sloganEl.textContent = result.slogan || result.desc.substring(0, 50) + '...';
    
    // 设置图片
    const imgContainer = document.getElementById('resultImage');
    if (imgContainer) {
        if (result.image) {
            imgContainer.innerHTML = `
                <img src="${result.image}" 
                     alt="${result.title}" 
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\'image-placeholder\'>${result.icon}</div>'"
                     style="width: 100%; height: 100%; object-fit: cover;"
                >
            `;
        } else {
            imgContainer.innerHTML = `<div class="image-placeholder">${result.icon}</div>`;
        }
    }
    
    // 隐藏人格徽章
    const hiddenBadge = document.getElementById('hiddenBadge');
    if (hiddenBadge) {
        if (type === 'NPCS' && checkExactEqualCondition()) {
            hiddenBadge.style.display = 'inline-flex';
            hiddenBadge.innerHTML = '<span class="badge-icon">🔓</span><span>稀有平衡人格已激活</span>';
        } else {
            hiddenBadge.style.display = 'none';
        }
    }
    
    // 渲染各模块（添加空值检查）
    if (document.getElementById('dimensionDetails')) {
        renderDimensionDetails();
    }
    if (document.getElementById('radarCanvas')) {
        drawRadarChart();
    }
    if (document.getElementById('gymRelations')) {
        renderGymRelations(result);
    }
    if (document.getElementById('alternativeTypes')) {
        renderAlternativeTypes(type);
    }
    
    showPage('resultPage');
}

function calculateResult() {
    // 计算各维度主导倾向
    const dimScores = {
        S: scores.S >= scores.O ? 'S' : 'O',
        G: scores.G >= scores.C ? 'G' : 'C',
        A: scores.A >= scores.I ? 'A' : 'I',
        E: scores.E >= scores.W ? 'E' : 'W'
    };
    
    // 检查NPCS条件（严格版：至少3个维度得分完全相等，且不含高训练水平人格）
    const isNPCS = checkStrictNPCSCondition(dimScores);
    if (isNPCS) return 'NPCS';
    
    // 计算训练水平分数（用于POWER判定）
    const trainingLevel = calculateTrainingLevel();
    
    // POWER 力量怪：高训练水平 + 高G + 高E
    if (trainingLevel >= 3 && scores.G > 12 && scores.E > 10 && scores.S > scores.O) {
        return 'POWER';
    }
    
    // HUMOR 胡练者：低训练水平 + 高C + 高W
    if (trainingLevel <= 2 && scores.C > 10 && scores.W > 8 && scores.G < 6) {
        return 'HUMOR';
    }
    
    // 其他原有判定...
    if (scores.S < 5 && scores.O < 5 && scores.G < 5 && scores.C > 8) return 'VANI';
    if (scores.W > 12 && answers[9] === 1) return 'DICK';
    if (scores.A > 10 && (answers[2] === 1 || answers[13] === 3)) return 'ACTO';
    if (scores.G > 10 && answers[3] === 0 && scores.C < 5) return 'WORR';
    if (dimScores.S === 'O' && scores.A > 8 && answers[10] === 0) return 'LOVE';
    if (scores.G < 6 && scores.C < 6 && answers[11] === 1) return 'AUDI';
    if (dimScores.S === 'S' && answers[14] === 0 && scores.O < 5) return 'HOME';
    if (answers[5] === 0 && scores.G > 8) return 'EATS';
    if (answers[5] === 2 && scores.C > 6) return 'EATA';
    if (answers[5] === 1 && scores.W > 6) return 'FART';
    if (scores.W > 10 && answers[12] === 2) return 'NAXI';
    if (scores.G > 12 && scores.E > 8 && dimScores.S === 'S' && dimScores.A === 'I') return 'OLDD';
    if (dimScores.E === 'E' && dimScores.S === 'O' && answers[4] === 0) return 'PAPA';
    if (scores.G > 8 && answers[6] === 2 && dimScores.A === 'I') return 'JOCK';
    if (dimScores.S === 'S' && dimScores.G === 'G') return 'SOLO';
    
    return 'NPCS';
}

function calculateTrainingLevel() {
    // 基于最后4道训练水平题计算
    let level = 0;
    for (let i = 16; i < 20; i++) {
        if (answers[i] !== undefined) {
            const q = quizConfig.questions[i];
            const selectedOption = q.options[answers[i]];
            if (selectedOption.trainingLevel) {
                level += selectedOption.trainingLevel;
            }
        }
    }
    return level;
}

function checkStrictNPCSCondition(dimScores) {
    // 严格条件：至少3个维度得分完全相等（差距为0）
    const pairs = [
        ['S', 'O'],
        ['G', 'C'],
        ['A', 'I'],
        ['E', 'W']
    ];
    
    let equalCount = 0;
    const equalDims = [];
    
    pairs.forEach(([a, b]) => {
        if (scores[a] === scores[b] && scores[a] > 0) {
            equalCount++;
            equalDims.push(a + '/' + b);
        }
    });
    
    // 至少3个维度完全相等
    if (equalCount < 3) return false;
    
    // 检查是否包含高训练水平人格特征
    const highTrainIndicators = scores.G > 10 || scores.E > 10 || scores.S > 10;
    if (highTrainIndicators) return false;
    
    return true;
}

function checkExactEqualCondition() {
    const pairs = [['S', 'O'], ['G', 'C'], ['A', 'I'], ['E', 'W']];
    let equalCount = 0;
    pairs.forEach(([a, b]) => {
        if (scores[a] === scores[b] && scores[a] > 0) equalCount++;
    });
    return equalCount >= 3;
}

function getResult(type) {
    return quizConfig.results[type] || generateGenericResult(type);
}

function generateGenericResult(type) {
    return {
        title: '神秘人格',
        titleEn: type,
        icon: '❓',
        desc: '你的健身人格超越了现有分类。',
        slogan: '独一无二的存在',
        tags: ['独特'],
        gymRelations: { partner: '-', enemy: '-', attract: '-' },
        alternatives: ['NPCS', 'HUMOR', 'SOLO']
    };
}

function renderDimensionDetails() {
    const pairs = [
        { dims: ['S', 'O'], names: ['社恐独狼', '社交蝴蝶'], desc: '社交倾向反映你在健身房的互动模式。高分表示你享受独处和专注训练，低分则表示你把健身房当成社交场所。' },
        { dims: ['G', 'C'], names: ['硬核狠人', '佛系养生'], desc: '训练态度体现你对健身目标的执着程度。高分代表你追求极限、数据驱动，低分代表你更注重享受过程、不焦虑结果。' },
        { dims: ['A', 'I'], names: ['表现型', '内敛型'], desc: '外在表现维度显示你对外展示的欲望。高分说明你爱拍照分享、注重形象，低分说明你默默训练、不事张扬。' },
        { dims: ['E', 'W'], names: ['理论派', '野路子'], desc: '知识维度反映你的训练方法论。高分代表你系统学习、动作标准，低分代表你凭感觉训练、实践优先。' }
    ];
    
    let html = '';
    
    pairs.forEach(({ dims: [a, b], names: [aName, bName], desc }) => {
        const total = scores[a] + scores[b];
        const aPercent = total > 0 ? Math.round((scores[a] / total) * 100) : 50;
        const bPercent = 100 - aPercent;
        const dominant = scores[a] >= scores[b] ? a : b;
        const dominantName = scores[a] >= scores[b] ? aName : bName;
        const dim = quizConfig.dimensions[dominant];
        
        html += `
            <div class="dimension-detail-item" style="border-left-color: ${dim.color}">
                <div class="dimension-detail-header">
                    <span class="dimension-name">${aName} vs ${bName}</span>
                    <span class="dimension-percent" style="color: ${dim.color}">${dominantName} ${scores[a] >= scores[b] ? aPercent : bPercent}%</span>
                </div>
                <div class="dimension-bar">
                    <div class="dimension-bar-fill" style="width: ${scores[a] >= scores[b] ? aPercent : bPercent}%; background: ${dim.color}"></div>
                </div>
                <div class="dimension-desc">${desc}</div>
            </div>
        `;
    });
    
    document.getElementById('dimensionDetails').innerHTML = html;
}

function drawRadarChart() {
    const canvas = document.getElementById('radarCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const dims = ['S', 'G', 'A', 'E', 'O', 'C', 'I', 'W'];
    const labels = ['社恐', '硬核', '表现', '理论', '社交', '佛系', '内敛', '野路'];
    const angleStep = (Math.PI * 2) / 8;
    
    // 绘制网格
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let j = 0; j < 8; j++) {
            const angle = j * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius * i / 4);
            const y = centerY + Math.sin(angle) * (radius * i / 4);
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
        ctx.strokeStyle = '#dfe6e9';
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 标签
        const labelX = centerX + Math.cos(angle) * (radius + 25);
        const labelY = centerY + Math.sin(angle) * (radius + 25);
        ctx.fillStyle = quizConfig.dimensions[dim]?.color || '#666';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i], labelX, labelY);
    });
    
    // 计算数据点（归一化）
    const maxScore = 20;
    const dataPoints = dims.map(dim => Math.min(scores[dim] / maxScore, 1));
    
    // 绘制数据区域
    ctx.beginPath();
    ctx.fillStyle = 'rgba(225, 112, 85, 0.2)';
    ctx.strokeStyle = '#e17055';
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
        ctx.fillStyle = '#e17055';
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 图例
    const legendHtml = dims.map((dim, i) => `
        <div class="legend-item">
            <div class="legend-color" style="background: ${quizConfig.dimensions[dim].color}"></div>
            <span>${labels[i]}</span>
        </div>
    `).join('');
    document.getElementById('radarLegend').innerHTML = legendHtml;
}

function renderGymRelations(result) {
    document.getElementById('bestPartner').textContent = result.gymRelations?.partner || '-';
    document.getElementById('worstEnemy').textContent = result.gymRelations?.enemy || '-';
    document.getElementById('attractTo').textContent = result.gymRelations?.attract || '-';
}

function renderAlternativeTypes(currentType) {
    const current = quizConfig.results[currentType];
    const alternatives = current.alternatives || [];
    
    let html = '';
    
    alternatives.forEach((altType, index) => {
        const alt = quizConfig.results[altType];
        if (!alt) return;
        
        // 计算相似度（基于维度得分差异）
        const similarity = calculateSimilarity(currentType, altType);
        
        html += `
            <div class="alt-type-item" onclick="showAlternativeDetail('${altType}')">
                <span class="alt-type-icon">${alt.icon}</span>
                <div class="alt-type-info">
                    <div class="alt-type-name">${alt.title} · ${alt.titleEn}</div>
                    <div class="alt-type-match">${alt.tags.slice(0, 2).join(' · ')}</div>
                </div>
                <span class="alt-type-similarity">${similarity}%</span>
            </div>
        `;
    });
    
    document.getElementById('alternativeTypes').innerHTML = html;
}

function calculateSimilarity(typeA, typeB) {
    // 简化的相似度计算
    return Math.floor(70 + Math.random() * 25); // 实际应该基于维度得分计算
}

function showAlternativeDetail(type) {
    // 可以扩展为显示备选人格的详细信息
    alert('查看 ' + quizConfig.results[type].title + ' 的详细信息');
}

function generateShareImage() {
    const preview = document.getElementById('sharePreview');
    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');
    const result = quizConfig.results[currentResultType];
    
    // 绘制分享图背景
    ctx.fillStyle = '#fff9f0';
    ctx.fillRect(0, 0, 600, 800);
    
    // 绘制顶部色块
    ctx.fillStyle = '#e17055';
    ctx.fillRect(0, 0, 600, 200);
    
    // 绘制标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('健身房人格测试', 300, 60);
    
    // 绘制人格类型
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(result.title, 300, 140);
    ctx.font = '24px sans-serif';
    ctx.fillText(result.titleEn, 300, 180);
    
    // 绘制图标区域
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(200, 220, 200, 200);
    ctx.font = '120px sans-serif';
    ctx.fillText(result.icon, 300, 360);
    
    // 绘制描述
    ctx.fillStyle = '#2d3436';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    const words = result.desc.substring(0, 60) + '...';
    ctx.fillText(words, 50, 480);
    
    // 绘制维度
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#636e72';
    ctx.fillText('维度特征：' + result.tags.join(' · '), 50, 540);
    
    // 绘制底部
    ctx.fillStyle = '#dfe6e9';
    ctx.fillRect(0, 750, 600, 50);
    ctx.fillStyle = '#636e72';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('扫码测试你的健身房人格 · youqvderen.github.io', 300, 780);
    
    // 显示预览
    preview.style.display = 'block';
    
    // 滚动到预览区域
    preview.scrollIntoView({ behavior: 'smooth' });
}

function copyResult() {
    const result = quizConfig.results[currentResultType];
    const text = `【${result.title} · ${result.titleEn}】\n${result.slogan}\n\n${result.desc}\n\n快来测试你的健身房人格！`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => alert('结果已复制！'));
    } else {
        alert('请手动复制');
    }
}
