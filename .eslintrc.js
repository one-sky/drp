// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    'ecmaVersion': 7
  },
  env: {
    browser: true,
    'es6': true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // 非严格相等(===, !==)仅报警告
    "eqeqeq": 1,
    // 取消import有始终需要扩展名
    "import/extensions": 0,
    "import/no-extraneous-dependencies": 0,
    // 取消换行符限制, 允许(\n\r)
    "linebreak-style": 0,
    // 单行最大宽度140字符
    "max-len": [2, { "code": 140, "ignoreTrailingComments": true }],
    // 允许使用console
    "no-console": [1, { "allow": ["warn", "error"] }],
    // 仅允许数学运算, 逻辑运算可以混合
    "no-mixed-operators": [
      2,
      {
        "groups": [
          // ["+", "-", "*", "/", "%", "**"],
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          // ["&&", "||"],
          ["in", "instanceof"]
        ],
        "allowSamePrecedence": true
      }
    ],
    // 三元运算符嵌套仅报警告
    "no-nested-ternary": 1,
    // 对参数重新赋值仅报警告
    "no-param-reassign": 1,
    // 禁止使用(++, --)，仅允许循环语句中使用
    "no-plusplus": [2, { "allowForLoopAfterthoughts": true }],
    // 允许空行的空格
    "no-trailing-spaces": [2, { "skipBlankLines": true }],
    // 允许三元运算，允许a && a()
    "no-unused-expressions": [
      2,
      { "allowShortCircuit": true, "allowTernary": true }
    ],
    // 关闭class method必须使用this
    "class-methods-use-this": 0,
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ["error", "always"],
    'quotes': [ 'error', 'single' ],
    "arrow-parens": 0,
    "function-paren-newline": 0,
    "comma-dangle": [
      2,
      "only-multiline"
    ]
    
  }
}
