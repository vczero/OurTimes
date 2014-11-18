var user = require('./user'),
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
	app.get('/user/getAll', user.getAll);
	app.post('/user/update', user.updateTag);
	
	//wei
	app.post('/wei/create', wei.create);
	app.get('/wei/get', wei.get);
	app.get('/wei/zan', wei.zan);
	//http://127.0.0.1:3000/wei/comment?id=54618233da29477c2a057c79&token=5460bd81250a3020243af1ab&comment=%E5%B0%B1%E6%98%AF%E6%83%B3%E8%AF%95%E8%AF%95%E7%9C%8B
	app.get('/wei/comment', wei.comment);
};
