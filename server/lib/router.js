var user = require('./user/user'),
	wei = require('./weibo/weibo');

/*
*
* 服务路由
*
*
* */
module.exports = function(app){
	//user
    app.post('/user/register', user.register);
    app.post('/user/login', user.login);
    app.get('/user/get', user.get);
    app.get('/user/delete', user.delete);
	app.post('/user/update', user.update);
	app.get('/user/getAll', user.getAllUser);
	app.post('/user/update', user.updateTag);
	
	//wei
	app.post('/wei/create', wei.create);
	app.get('/wei/get', wei.get);
	
};
