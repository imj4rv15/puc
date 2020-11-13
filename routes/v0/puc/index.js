var express = require('express');
const mongoPucModel = require('../../../dbModels/pucModel');
// don't remove this util
const util = require('../../../utils/pucRecorder');
module.exports = function (passport) {
  var Router = express.Router();

  Router.get('/puc', async function (req, res) {
    const pucData = await mongoPucModel.find();
    return res.json({
      status: 200,
      res: {
        data: pucData
      }
    });

  });

  Router.post('/puc', function (req, res) {
    mongoPucModel.create(req.body);
    return res.json({
      status: 200,
      message: 'Success'
    });
  });

  return Router;
};
