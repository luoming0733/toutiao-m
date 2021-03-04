module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // rootValue: 375,

      // 配置要转换的 CSS 属性
      // * 表示所有
      propList: ['*'],
      exclude: 'github-markdown'
    }
  }
}
