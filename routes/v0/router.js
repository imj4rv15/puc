let puc = require('./puc/index');

exports.mountAPI = function (mount, app) {
  app.use(mount , puc());
};
