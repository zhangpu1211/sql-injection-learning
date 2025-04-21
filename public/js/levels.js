// 在浏览器环境中，我们直接定义全局变量
window.LEVELS = [
    {
        id: 1,
        title: 'SELECT基础',
        description: '在这一关，你将学习基本的SELECT语句。SELECT语句用于从数据库中检索数据，是SQL中最常用的命令之一。',
        difficulty: 1,
        task: '查询所有用户的用户名和邮箱地址。提示：使用SELECT语句。',
        hint: '使用SELECT username, email FROM users;',
        expectedPattern: /SELECT\s+(\w+\s*,\s*)*\w+\s+FROM\s+users/i,
        solution: 'SELECT username, email FROM users',
        explanation: '这个查询使用SELECT语句从users表中选择username和email列。这是最基本的SQL查询形式。'
    },
    {
        id: 2,
        title: '条件查询',
        description: '这一关将介绍WHERE子句，它用于过滤查询结果。在SQL注入中，理解WHERE子句的工作原理非常重要。',
        difficulty: 1,
        task: '查询管理员用户的所有信息。提示：使用WHERE子句和is_admin字段。',
        hint: '使用WHERE is_admin = 1来筛选管理员用户',
        expectedPattern: /SELECT\s+.*\s+FROM\s+users\s+WHERE\s+is_admin\s*=\s*1/i,
        solution: 'SELECT * FROM users WHERE is_admin = 1',
        explanation: 'WHERE子句用于筛选结果，这里我们使用is_admin = 1来找出管理员用户。'
    },
    {
        id: 3,
        title: '字符串操作',
        description: '在SQL中，字符串通常用单引号或双引号括起来。在SQL注入中，理解字符串的处理方式至关重要。',
        difficulty: 2,
        task: '查找用户名为"admin"的用户信息。注意观察单引号的使用。',
        hint: '使用WHERE username = \'admin\'',
        expectedPattern: /SELECT\s+.*\s+FROM\s+users\s+WHERE\s+username\s*=\s*'admin'/i,
        solution: "SELECT * FROM users WHERE username = 'admin'",
        explanation: '在SQL中，字符串值需要用引号括起来。这是SQL注入的一个重要切入点。'
    },
    {
        id: 4,
        title: '基础SQL注入',
        description: '这一关介绍最基本的SQL注入技术。我们将学习如何使用单引号闭合字符串条件。',
        difficulty: 2,
        task: '尝试使用SQL注入技术登录为管理员。原始查询是：SELECT * FROM users WHERE username = \'[输入]\'',
        hint: '考虑使用单引号和OR运算符',
        expectedPattern: /.*'.*OR.*'.*'.*'/i,
        solution: "' OR '1'='1",
        explanation: '通过闭合单引号并添加一个永真条件，我们可以绕过登录验证。'
    },
    {
        id: 5,
        title: 'UNION注入基础',
        description: 'UNION运算符用于组合两个或多个SELECT语句的结果。这是SQL注入中常用的技术。',
        difficulty: 3,
        task: '使用UNION SELECT语句来同时显示用户表和产品表的数据。',
        hint: '需要确保UNION两边的列数相同',
        expectedPattern: /SELECT.*FROM.*UNION\s+SELECT.*FROM.*/i,
        solution: "SELECT username, email FROM users UNION SELECT name, description FROM products",
        explanation: 'UNION注入允许我们获取其他表的数据。注意UNION要求两个查询返回相同数量的列。'
    },
    {
        id: 6,
        title: '注释符号的使用',
        description: '注释符号(--或#)在SQL注入中非常有用，可以用来忽略查询的其余部分。',
        difficulty: 3,
        task: '使用注释符号来移除查询中的密码检查部分。原始查询：SELECT * FROM users WHERE username = \'[输入]\' AND password = \'123456\'',
        hint: '使用--来注释掉AND之后的部分',
        expectedPattern: /.*'.*--/i,
        solution: "admin'--",
        explanation: '通过使用--注释符，我们可以使查询忽略密码检查部分。'
    },
    {
        id: 7,
        title: '高级UNION注入',
        description: '这一关将学习如何使用UNION注入来获取数据库的元数据信息。',
        difficulty: 4,
        task: '使用UNION注入来获取数据库中的表名。',
        hint: '查询sqlite_master系统表',
        expectedPattern: /UNION\s+SELECT\s+.*FROM\s+sqlite_master/i,
        solution: "SELECT name FROM users UNION SELECT name FROM sqlite_master WHERE type='table'",
        explanation: 'sqlite_master表存储了数据库的结构信息，通过查询它可以获取表名等元数据。'
    },
    {
        id: 8,
        title: '布尔盲注',
        description: '有时我们无法直接看到查询结果，但可以通过页面的不同响应来判断条件是否为真。',
        difficulty: 4,
        task: '使用布尔盲注技术判断管理员密码的第一个字符是否为"s"。',
        hint: '使用substr函数',
        expectedPattern: /.*substr.*password.*=.*/i,
        solution: "SELECT * FROM users WHERE username='admin' AND substr(password,1,1)='s'",
        explanation: '布尔盲注通过构造条件语句，一次获取一个字符的信息。'
    },
    {
        id: 9,
        title: '时间盲注',
        description: '当无法通过页面响应判断条件真假时，可以通过查询执行时间来获取信息。',
        difficulty: 5,
        task: '使用时间盲注技术判断管理员密码的长度是否大于10。',
        hint: '使用CASE WHEN和sqlite3的sleep函数',
        expectedPattern: /.*CASE\s+WHEN.*LENGTH.*THEN.*/i,
        solution: "SELECT CASE WHEN (SELECT length(password) > 10 FROM users WHERE username='admin') THEN sqlite3_sleep(1000) ELSE 0 END",
        explanation: '时间盲注通过延迟响应时间来传递信息，这在无法获得直接反馈时特别有用。'
    }
]; 