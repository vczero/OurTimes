var user = require('./user/user');

/*
*
* 服务路由
*
*
* */
module.exports = function(app){
    app.post('/user/register', user.register);
    app.post('/user/login', user.login);
    app.get('/user/get', user.get);
	app.post('/user/update', user.update);
};
