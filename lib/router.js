var user = require('./user'),
	weiyan = require('./weiyan');

/*
+ 服务路由
+ 可供第三方访问，部分接口需使用鉴权
*/
module.exports = function(app) {
	//用户鉴权
	app.post('/user/register', user.register);
	app.post('/user/login', user.login);
	app.get('/user/get', user.get);
	app.get('/user/delete', user.delete);
	app.post('/user/update', user.update);
	app.get('/user/getAll', user.getAll);
	app.post('/user/update', user.updateTag);

	//微言
	app.post('/wei/create', weiyan.create);
	app.get('/wei/get', weiyan.get);
	app.get('/wei/zan', weiyan.zan);
	//http://127.0.0.1:3000/wei/comment?id=54618233da29477c2a057c79&token=5460bd81250a3020243af1ab&comment=%E5%B0%B1%E6%98%AF%E6%83%B3%E8%AF%95%E8%AF%95%E7%9C%8B
	app.get('/wei/comment', weiyan.comment);
};