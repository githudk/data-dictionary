const proxy = require("http-proxy-middleware");
 
/**
 * 配置代理地址和路径映射，开发模式中用于将符合该路径前缀的请求，代理到后台服务所在的主机和端口上。
 */
module.exports = function(app) {
  app.use(
    proxy("/admin", {
      target: "http://127.0.0.1:8888/",
      changeOrigin: true
    })
  );
  app.use(
    proxy("/datasource", {
      target: "http://127.0.0.1:8888/",
      changeOrigin: true
    })
  );
  app.use(
    proxy("/dictionary", {
      target: "http://127.0.0.1:8888/",
      changeOrigin: true
    })
  );
};