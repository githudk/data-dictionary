

const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    //针对antd实现按需打包，根据import来自动打包（babel-plugin-import包的的作用）
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1296db' },
    }),
);