var user = require('./user/user');
//  verify = require('./verify'),
//  email = require('./email');
/*
*
* REST API的路由表
*
*
* */
module.exports = function(app){
    app.post('/user/register', user.register);
    app.post('/user/login', user.login);
    app.get('/user/get', user.get);
//  app.get('./user/logout', user.logout);
//  app.post('/user/update', user.update);
//  //验证码模块
//  app.get('/verify/get', verify.create);
//  //发送邮件模块
//  app.post('./email/findpasswod', email.findPassword);
};
