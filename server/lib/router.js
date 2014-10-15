var user = require('./user'),
    email = require('./email');
/*
*
* REST API的路由表
*
*
* */
module.exports = function(app){
    app.post('/user/register', user.register);
    app.get('/user/login', user.login);
    app.get('/user/get', user.getUserInfo);
    app.get('./user/logout', user.logout);
    app.post('/user/update', user.update);

    //发送邮件模块
    app.post('./email/findpasswod', email.findPassword);
};
