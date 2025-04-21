// 初始化CodeMirror编辑器
let editor = CodeMirror.fromTextArea(document.getElementById('sqlEditor'), {
    mode: 'text/x-sql',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: true,
    extraKeys: {
        'Ctrl-Enter': function(cm) {
            runQuery();
        }
    }
});

// 当前关卡信息
let currentLevel = 1;
let levels = [];

// 关卡分类
let currentCategory = 'all'; // 'all', 'basic', 'intermediate', 'advanced'

// 初始化页面
async function initializePage() {
    try {
        // 显示加载状态
        showLoading();
        
        // 获取关卡信息
        const response = await fetchWithRetry('/api/levels', 3);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data.levels || !Array.isArray(data.levels)) {
            throw new Error('Invalid levels data received');
        }
        
        levels = data.levels;
        
        // 设置关卡分类按钮事件
        document.getElementById('basicLevels').addEventListener('click', () => filterLevels('basic'));
        document.getElementById('intermediateLevels').addEventListener('click', () => filterLevels('intermediate'));
        document.getElementById('advancedLevels').addEventListener('click', () => filterLevels('advanced'));
        
        // 生成关卡选择器
        createLevelSelector();
        
        // 更新关卡进度显示
        updateLevelSelector();
        
        // 加载第一关
        await loadLevel(1);
        
        // 隐藏加载状态
        hideLoading();
    } catch (error) {
        console.error('初始化失败:', error);
        showError('加载关卡信息失败', '请检查网络连接并点击重试按钮');
        // 添加重试按钮
        addRetryButton();
    }
}

// 显示加载状态
function showLoading() {
    const container = document.getElementById('levelSelector');
    container.innerHTML = `
        <div class="col-span-full flex items-center justify-center p-8">
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p class="text-gray-400">正在加载关卡信息...</p>
            </div>
        </div>
    `;
}

// 隐藏加载状态
function hideLoading() {
    const container = document.getElementById('levelSelector');
    if (container.querySelector('.animate-spin')) {
        createLevelSelector(); // 重新创建关卡选择器
    }
}

// 添加重试按钮
function addRetryButton() {
    const container = document.getElementById('levelSelector');
    container.innerHTML = `
        <div class="col-span-full flex items-center justify-center p-8">
            <div class="text-center">
                <p class="text-red-400 mb-4">加载失败</p>
                <button onclick="retryInitialization()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    重试加载
                </button>
            </div>
        </div>
    `;
}

// 重试初始化
async function retryInitialization() {
    await initializePage();
}

// 带重试的fetch函数
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return response;
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error(`Failed after ${retries} retries`);
}

// 过滤关卡
function filterLevels(category) {
    currentCategory = category;
    createLevelSelector();
}

// 创建关卡选择器
function createLevelSelector() {
    const container = document.getElementById('levelSelector');
    container.innerHTML = '';
    
    // 根据分类过滤关卡
    let filteredLevels = levels;
    if (currentCategory === 'basic') {
        filteredLevels = levels.filter(level => level.id <= 4);
    } else if (currentCategory === 'intermediate') {
        filteredLevels = levels.filter(level => level.id > 4 && level.id <= 8);
    } else if (currentCategory === 'advanced') {
        filteredLevels = levels.filter(level => level.id > 8);
    }
    
    filteredLevels.forEach(level => {
        const button = document.createElement('div');
        button.classList.add('level-button', 'p-4', 'rounded-lg', 'text-left', 'cursor-pointer', 'transition-all', 'duration-300', 'hover:transform', 'hover:scale-105');
        
        if (level.id === currentLevel) {
            button.classList.add('current');
        }
        
        // 根据难度设置背景颜色
        if (level.difficulty <= 2) {
            button.classList.add('bg-green-900', 'hover:bg-green-800');
        } else if (level.difficulty <= 4) {
            button.classList.add('bg-yellow-900', 'hover:bg-yellow-800');
        } else {
            button.classList.add('bg-red-900', 'hover:bg-red-800');
        }
        
        // 添加新的关卡类型标签
        const levelType = level.id <= 4 ? '基础' : 
                         level.id <= 8 ? '中级' : '高级';
        const levelTypeClass = level.id <= 4 ? 'bg-green-700' : 
                             level.id <= 8 ? 'bg-yellow-700' : 'bg-red-700';
        
        button.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold">第${level.id}关: ${level.title}</h3>
                <span class="text-xs ${levelTypeClass} px-2 py-1 rounded">${levelType}</span>
            </div>
            <p class="text-sm text-gray-400 mt-1">${level.description.substring(0, 50)}${level.description.length > 50 ? '...' : ''}</p>
            <div class="mt-2 flex items-center justify-between">
                <span class="text-xs bg-gray-700 px-2 py-1 rounded">
                    难度: ${'⭐'.repeat(level.difficulty)}
                </span>
                ${level.id === currentLevel ? '<span class="text-xs bg-blue-600 px-2 py-1 rounded">当前关卡</span>' : ''}
            </div>
        `;
        
        button.onclick = () => loadLevel(level.id);
        container.appendChild(button);
    });
    
    // 更新分类按钮状态
    const buttons = {
        'basic': document.getElementById('basicLevels'),
        'intermediate': document.getElementById('intermediateLevels'),
        'advanced': document.getElementById('advancedLevels')
    };
    
    Object.entries(buttons).forEach(([category, button]) => {
        if (currentCategory === category) {
            button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            button.classList.add('bg-green-600', 'hover:bg-green-700');
        } else {
            button.classList.remove('bg-green-600', 'hover:bg-green-700');
            button.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }
    });
}

// 加载关卡
async function loadLevel(levelId) {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;
    
    currentLevel = levelId;
    
    // 更新关卡信息
    document.getElementById('levelTitleMain').textContent = `第${level.id}关: ${level.title}`;
    document.getElementById('levelDescription').textContent = level.description;
    document.getElementById('levelTask').textContent = level.task;
    document.getElementById('levelTaskDetail').textContent = level.task;
    
    // 更新关卡选择器的当前关卡状态
    document.querySelectorAll('.level-button').forEach(btn => {
        btn.classList.remove('current');
        if (btn.querySelector('h3').textContent.startsWith(`第${levelId}关`)) {
            btn.classList.add('current');
            // 更新当前关卡标签
            const statusSpan = btn.querySelector('.bg-blue-600');
            if (!statusSpan) {
                const statusDiv = btn.querySelector('.mt-2');
                statusDiv.innerHTML += '<span class="text-xs bg-blue-600 px-2 py-1 rounded">当前关卡</span>';
            }
        } else {
            // 移除其他关卡的当前标签
            const statusSpan = btn.querySelector('.bg-blue-600');
            if (statusSpan) {
                statusSpan.remove();
            }
        }
    });
    
    // 清空编辑器和结果
    editor.setValue('');
    document.getElementById('queryResult').innerHTML = '<pre class="bg-gray-700 p-4 rounded-lg overflow-x-auto">结果将在这里显示...</pre>';
    
    // 加载关卡详细信息
    await loadLevelDetails(levelId);
}

// 加载关卡详细信息
async function loadLevelDetails(levelId) {
    try {
        showDetailLoading();
        console.log('正在加载关卡详细信息:', levelId);
        
        const response = await fetchWithRetry(`/api/level/${levelId}/details`, 3);
        const data = await response.json();
        
        if (data.success && data.details) {
            console.log('成功获取关卡详细信息:', data.details);
            displayLevelDetails(data.details);
        } else {
            throw new Error(data.error || '加载失败');
        }
    } catch (error) {
        console.error('加载关卡详细信息失败:', error);
        const detailsContainer = document.getElementById('levelDetails');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="bg-red-800 p-4 rounded-lg">
                    <p class="text-white mb-4">加载关卡详细信息失败</p>
                    <button onclick="retryLoadDetails(${levelId})" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        重试加载
                    </button>
                </div>
            `;
        }
    } finally {
        hideDetailLoading();
    }
}

// 显示详细信息加载状态
function showDetailLoading() {
    const container = document.getElementById('levelDetails');
    if (container) {
        container.innerHTML = `
            <div class="bg-gray-800 p-4 rounded-lg">
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <span class="ml-3 text-gray-400">正在加载详细信息...</span>
                </div>
            </div>
        `;
    }
}

// 隐藏详细信息加载状态
function hideDetailLoading() {
    const container = document.getElementById('levelDetails');
    if (container && container.querySelector('.animate-spin')) {
        container.innerHTML = '';
    }
}

// 重试加载详细信息
async function retryLoadDetails(levelId) {
    await loadLevelDetails(levelId);
}

// 显示关卡详细信息
function displayLevelDetails(details) {
    const detailsContainer = document.getElementById('levelDetails');
    if (!detailsContainer) return;
    
    detailsContainer.innerHTML = ''; // 清空现有内容
    
    // 显示表结构和示例数据
    if (details.preCheck) {
        const preCheckHtml = `
            <div class="bg-gray-800 p-4 rounded-lg mb-4">
                <h3 class="text-xl font-bold text-white mb-2">数据库结构</h3>
                <pre class="bg-gray-900 p-3 rounded text-gray-300 overflow-x-auto">${details.preCheck.schema}</pre>
                
                <h3 class="text-xl font-bold text-white my-2">示例数据</h3>
                <pre class="bg-gray-900 p-3 rounded text-gray-300 overflow-x-auto">${details.preCheck.sampleData}</pre>
            </div>
        `;
        detailsContainer.innerHTML += preCheckHtml;
    }
    
    // 显示知识点
    if (details.knowledge) {
        const knowledgeHtml = `
            <div class="bg-gray-800 p-4 rounded-lg mb-4">
                <h3 class="text-xl font-bold text-white mb-2">知识点详解</h3>
                <div class="space-y-4">
                    ${details.knowledge.keyPoints.map(point => `
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <h4 class="font-bold text-blue-400 mb-2">${point.title}</h4>
                            <p class="text-gray-300">${point.description}</p>
                            ${point.examples ? `
                                <div class="mt-2">
                                    <h5 class="font-semibold text-green-400 mb-1">示例：</h5>
                                    <pre class="bg-gray-900 p-2 rounded text-gray-300">${point.examples}</pre>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <h3 class="text-xl font-bold text-white my-4">常见错误</h3>
                <div class="space-y-4">
                    ${details.knowledge.commonErrors.map(error => `
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <h4 class="font-bold text-red-400 mb-2">${error.title}</h4>
                            <p class="text-gray-300">${error.description}</p>
                            ${error.example ? `
                                <div class="mt-2">
                                    <h5 class="font-semibold text-yellow-400 mb-1">错误示例：</h5>
                                    <pre class="bg-gray-900 p-2 rounded text-gray-300">${error.example}</pre>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <h3 class="text-xl font-bold text-white my-4">防护措施</h3>
                <div class="space-y-4">
                    ${details.knowledge.prevention.map(tip => `
                        <div class="bg-gray-700 p-4 rounded-lg">
                            <h4 class="font-bold text-green-400 mb-2">${tip.title}</h4>
                            <p class="text-gray-300">${tip.description}</p>
                            ${tip.example ? `
                                <div class="mt-2">
                                    <h5 class="font-semibold text-blue-400 mb-1">示例代码：</h5>
                                    <pre class="bg-gray-900 p-2 rounded text-gray-300">${tip.example}</pre>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        detailsContainer.innerHTML += knowledgeHtml;
    }
    
    // 显示提示信息
    if (details.hint) {
        const hintHtml = `
            <div class="bg-gray-800 p-4 rounded-lg">
                <h3 class="text-xl font-bold text-white mb-2">提示信息</h3>
                <p class="text-gray-300">${details.hint}</p>
            </div>
        `;
        detailsContainer.innerHTML += hintHtml;
    }
}

// 运行查询
async function runQuery() {
    const solution = editor.getValue();
    if (!solution.trim()) {
        showError('请输入SQL查询语句');
        return;
    }
    
    try {
        const response = await fetch('/api/check-solution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                level: currentLevel,
                solution: solution
            })
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess(data.message, data.result, data.explanation);
        } else {
            const errorMessage = data.error || '查询失败';
            const hintMessage = data.hint ? `提示: ${data.hint}` : '尝试检查SQL语法是否正确';
            showError(errorMessage, hintMessage);
        }
    } catch (error) {
        console.error('查询执行失败:', error);
        showError('查询执行失败', '请检查网络连接并重试');
    }
}

// 保存关卡进度
function saveLevelProgress(levelId, completed) {
    try {
        const progress = JSON.parse(localStorage.getItem('sqlInjectionProgress') || '{}');
        progress[levelId] = completed;
        localStorage.setItem('sqlInjectionProgress', JSON.stringify(progress));
        updateLevelSelector();
    } catch (error) {
        console.error('保存进度失败:', error);
    }
}

// 获取关卡进度
function getLevelProgress(levelId) {
    try {
        const progress = JSON.parse(localStorage.getItem('sqlInjectionProgress') || '{}');
        return progress[levelId] || false;
    } catch (error) {
        console.error('获取进度失败:', error);
        return false;
    }
}

// 更新关卡选择器显示
function updateLevelSelector() {
    document.querySelectorAll('.level-button').forEach(btn => {
        const levelId = parseInt(btn.querySelector('h3').textContent.match(/第(\d+)关/)[1]);
        const completed = getLevelProgress(levelId);
        
        // 移除旧的完成标记
        const oldCompleteMark = btn.querySelector('.complete-mark');
        if (oldCompleteMark) {
            oldCompleteMark.remove();
        }
        
        // 添加新的完成标记
        if (completed) {
            const statusDiv = btn.querySelector('.mt-2');
            const completeMark = document.createElement('span');
            completeMark.className = 'text-xs bg-green-600 px-2 py-1 rounded complete-mark ml-2';
            completeMark.textContent = '已完成';
            statusDiv.appendChild(completeMark);
        }
    });
}

// 修改 showSuccess 函数，在成功时保存进度
function showSuccess(message, result, explanation) {
    const resultHtml = `
        <div class="success-box fade-in">
            <p class="font-bold text-green-400">${message}</p>
            ${explanation ? `<p class="mt-2 text-gray-400">${explanation}</p>` : ''}
        </div>
        <pre class="bg-gray-700 p-4 rounded-lg overflow-x-auto mt-4">
${JSON.stringify(result, null, 2)}
        </pre>
    `;
    document.getElementById('queryResult').innerHTML = resultHtml;
    
    // 保存当前关卡进度
    saveLevelProgress(currentLevel, true);
}

// 显示错误信息
function showError(error, hint = '') {
    const errorHtml = `
        <div class="error-box fade-in">
            <p class="font-bold text-red-400">${error}</p>
            ${hint ? `<p class="mt-2 text-gray-400">${hint}</p>` : ''}
        </div>
    `;
    document.getElementById('queryResult').innerHTML = errorHtml;
}

// 添加运行按钮事件监听
document.getElementById('runQuery').addEventListener('click', runQuery);

// 初始化页面
initializePage(); 