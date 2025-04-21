const express = require('express');
const path = require('path');
const { LEVELS } = require('./levels');
const { LEVEL_DETAILS } = require('./levelDetails');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// 获取所有关卡信息
app.get('/api/levels', (req, res) => {
    // 移除敏感信息（解决方案和预期模式）后返回关卡信息
    const safeLevels = LEVELS.map(({ id, title, description, difficulty, task, expectedPattern }) => ({
        id,
        title,
        description,
        difficulty,
        task,
        expectedPattern: expectedPattern ? expectedPattern.toString() : null
    }));
    
    res.json({ success: true, levels: safeLevels });
});

// 获取特定关卡的详细信息
app.get('/api/level/:id/details', (req, res) => {
    const levelId = parseInt(req.params.id);
    const levelDetails = LEVEL_DETAILS.find(l => l.id === levelId);
    
    if (!levelDetails) {
        return res.status(404).json({
            success: false,
            error: '关卡不存在'
        });
    }
    
    res.json({
        success: true,
        details: levelDetails
    });
});

// 检查解决方案
app.post('/api/check-solution', (req, res) => {
    const { level, solution } = req.body;
    const currentLevel = LEVELS.find(l => l.id === level);
    
    if (!currentLevel) {
        return res.status(404).json({
            success: false,
            error: '关卡不存在'
        });
    }
    
    // 检查解决方案是否匹配预期模式
    if (!currentLevel.expectedPattern.test(solution)) {
        return res.json({
            success: false,
            error: '解决方案不正确',
            hint: currentLevel.hint
        });
    }
    
    // 模拟查询结果
    const result = {
        message: '查询成功',
        data: [
            { id: 1, username: 'admin', email: 'admin@test.com' },
            { id: 2, username: 'user1', email: 'user1@test.com' }
        ]
    };
    
    res.json({
        success: true,
        message: '恭喜！通过本关！',
        result: result,
        explanation: currentLevel.explanation
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 