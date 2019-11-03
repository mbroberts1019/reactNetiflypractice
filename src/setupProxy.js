const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    proxy('/.netlify/functions/', {
      target: 'https://boring-brattain-746f09.netlify.com/',
      pathRewrite: {
        '^/\\.netlify/functions': '',
      },
    }),
  );
};