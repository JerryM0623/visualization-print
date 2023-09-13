module.exports = {
    // 启用editorConfig
    editorconfig: true,
    // 每行代码的最长长度，超过长度会进行折叠
    printWidth: 120,
    // 缩进2格为主
    tabWidth: 2,
    // 不适用 tab 作为缩进方式
    useTabs: false,
    // 语句结束添加分号
    semi: true,
    // 使用单引号包裹字符串
    singleQuote: true,
    // object 的 key 值仅在有需要的时候才会加引号
    quoteProps: 'as-needed',
    // 在对象两侧添加空格，例如：{ foo:true }
    bracketSpacing: true,
    // 箭头函数的形参部分永远都会有括号包裹 const a = () => {}
    arrowParens: 'always',
    // 使用lf作为末尾换行符
    endOfLine: 'lf',
    overrides: [
      {
        // html json 使用双引号
        files: ['*.html', '*.json'],
        options: {
          singleQuote: false,
        },
      },
    ],
  };
  