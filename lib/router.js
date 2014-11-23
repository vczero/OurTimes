var user = require('./user'),
	weiyan = require('./weiyan')
	upload = require('./upload');

/*
+ 服务路由
+ 可供第三方访问，部分接口需使用鉴权
*/
module.exports = function(app) {
	//用户模块
	//用户注册
	app.post('/user/register', user.register);
	//用户登录后创建更新token
	app.post('/user/login', user.login);
	//获取common用户信息，已经不包含敏感信息
	app.get('/user/getCommon', user.getOtherInfo);
	//获取自己的基本信息，包含敏感信息
	app.get('/user/getSelf', user.getSelfInfo);
	//获取'BEN'类型的用户信息
	app.get('/user/getBen', user.getBenInfo);
	//获取单个'BEN'用户的信息 
	app.get('/user/singleBen', user.getSingleBen);
	//管理员获取所有用户信息
	app.get('/user/getAll', user.getAll);
	//更新'BEN'用户的信息，包括修改自己的敏感信息
	app.post('/user/updateBen', user.updateBen);
	//更新一般用户信息，去除敏感信息并且不允许更新敏感信息
	app.post('/user/updateCommon', user.updateOtherInfo);
	app.get('/user/delete', user.deleteUser);
	app.post('/user/update', user.updateTag);

	//微言模块
	app.post('/wei/create', weiyan.create);
	app.get('/wei/get', weiyan.get);
	app.get('/wei/zan', weiyan.zan);
	app.get('/wei/comment', weiyan.comment);

	//上传图片
	app.post('/upload/img', upload.uploadImg);
};