const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { LEVELS } = require('./server/levels.js');
const { LEVEL_DETAILS } = require('./server/levelDetails.js');

const app = express();
const port = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static('public'));
app.use(express.json());

// 数据库连接
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('成功连接到内存数据库');
    initializeDatabase();
  }
});

// 初始化数据库
function initializeDatabase() {
  // 创建示例表
  db.serialize(() => {
    // 用户表
    db.run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      password TEXT,
      email TEXT,
      is_admin INTEGER
    )`);

    // 插入示例数据
    db.run(`INSERT INTO users (username, password, email, is_admin) VALUES 
      ('admin', 'super_secret_password', 'admin@example.com', 1),
      ('user1', 'password123', 'user1@example.com', 0),
      ('user2', 'password456', 'user2@example.com', 0)`);

    // 产品表
    db.run(`CREATE TABLE products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price REAL,
      description TEXT
    )`);

    // 插入产品数据
    db.run(`INSERT INTO products (name, price, description) VALUES 
      ('Product A', 19.99, 'Description for Product A'),
      ('Product B', 29.99, 'Description for Product B'),
      ('Product C', 39.99, 'Description for Product C')`);
  });
}

// API路由
app.post('/api/check-solution', (req, res) => {
  const { level, solution } = req.body;
  
  // 获取当前关卡信息
  const currentLevel = LEVELS.find(l => l.id === level);
  if (!currentLevel) {
    return res.json({ 
      success: false, 
      error: '无效的关卡ID'
    });
  }
  
  // 特殊处理第4关的SQL注入
  if (level === 4) {
    // 构造完整的SQL查询
    const fullQuery = `SELECT * FROM users WHERE username = '${solution}'`;
    console.log(fullQuery);
    // 在安全的环境中执行用户的SQL查询
    db.all(fullQuery, [], (err, rows) => {
      if (err) {
        res.json({ 
          success: false, 
          error: err.message,
          hint: '检查SQL语法是否正确'
        });
      } else {
        // 检查是否成功获取管理员账户
        const success = rows.some(row => row.is_admin === 1);
        res.json({ 
          success,
          result: rows,
          message: success ? '成功登录！' : '未能登录',
          explanation: currentLevel.explanation
        });
      }
    });
    return;
  }

  // 特殊处理第6关的SQL注入
  if (level === 6) {
    // 构造完整的SQL查询
    const fullQuery = `SELECT * FROM users WHERE username = '${solution}' AND password = '123456'`;
    console.log(fullQuery);
    // 在安全的环境中执行用户的SQL查询
    db.all(fullQuery, [], (err, rows) => {
      if (err) {
        res.json({ 
          success: false, 
          error: err.message,
          hint: '检查SQL语法是否正确'
        });
      } else {
        // 检查是否成功获取管理员账户
        const success = rows.some(row => row.is_admin === 1);
        res.json({ 
          success,
          result: rows,
          message: success ? '成功绕过密码验证！' : '未能绕过密码验证',
          explanation: currentLevel.explanation
        });
      }
    });
    return;
  }
  
  // 特殊处理第9关的时间盲注
  if (level === 9) {
    const startTime = Date.now();
    db.all(solution, [], (err, rows) => {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      if (err) {
        res.json({ 
          success: false, 
          error: err.message,
          hint: '检查SQL语法是否正确'
        });
      } else {
        // 如果执行时间超过500ms，说明条件为真
        const success = executionTime > 500;
        res.json({ 
          success: true,
          result: [{
            execution_time: executionTime,
            is_password_long: success
          }],
          message: success ? '密码长度确实大于10！' : '密码长度不大于10',
          explanation: currentLevel.explanation
        });
      }
    });
    return;
  }
  
  // 其他关卡的处理逻辑
  // 检查解决方案是否符合预期模式
  if (!currentLevel.expectedPattern.test(solution)) {
    return res.json({
      success: false,
      error: '解决方案不符合要求',
      hint: currentLevel.hint
    });
  }
  
  // 执行查询
  db.all(solution, [], (err, rows) => {
    if (err) {
      res.json({ 
        success: false, 
        error: err.message,
        hint: '检查SQL语法是否正确'
      });
    } else {
      res.json({ 
        success: true,
        result: rows,
        message: '查询执行成功！',
        explanation: currentLevel.explanation
      });
    }
  });
});

// 获取关卡信息
app.get('/api/levels', (req, res) => {
  // 移除敏感信息（解决方案和预期模式）后返回关卡信息
  const safeLevels = LEVELS.map(({ id, title, description, difficulty, task }) => ({
    id,
    title,
    description,
    difficulty,
    task
  }));
  
  res.json({ levels: safeLevels });
});

// 获取关卡详细信息
app.get('/api/level/:id/details', (req, res) => {
  const levelId = parseInt(req.params.id);
  const details = LEVEL_DETAILS.find(level => level.id === levelId);
  
  if (!details) {
    return res.status(404).json({ error: '关卡不存在' });
  }
  
  res.json({ success: true, details });
});

// 获取表结构信息
app.get('/api/schema/:table', (req, res) => {
  const table = req.params.table;
  db.all(`PRAGMA table_info(${table})`, [], (err, rows) => {
    if (err) {
      res.json({ success: false, error: err.message });
    } else {
      res.json({ success: true, schema: rows });
    }
  });
});

// 获取表数据示例
app.get('/api/sample/:table', (req, res) => {
  const table = req.params.table;
  db.all(`SELECT * FROM ${table} LIMIT 3`, [], (err, rows) => {
    if (err) {
      res.json({ success: false, error: err.message });
    } else {
      res.json({ success: true, data: rows });
    }
  });
});

// 添加favicon处理
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 