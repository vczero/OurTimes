/**
 * router模块提供路由转发。
 * @module router
 */
var user = require('./user'),
    weibo = require('./weibo'),
    upload = require('./upload'),
    email = require('./email'),
    article = require('./article');

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
    //获取单个普通用户信息
    app.get('/user/getCommon/name', user.getOtherInfoByNickname);
    //获取'BEN'类型的用户信息
    app.get('/user/getBen', user.getBenInfo);
    //获取单个'BEN'用户的信息 
    app.get('/user/singleBen', user.getSingleBen);
    //根据真实的用户名，获取单个BEN信息
    app.get('/user/singleBen/name', user.getSingleBenByRealname);
    //管理员获取所有用户信息
    app.get('/user/getAll', user.getAll);
    //根据查询条件查询
    app.get('/user/getByCondition', user.getUserByEmail_Nick_Real);
    //更新'BEN'用户的信息，包括修改自己的敏感信息
    app.post('/user/updateBen', user.updateBen);
    //更新一般用户信息，去除敏感信息并且不允许更新敏感信息
    app.post('/user/updateCommon', user.updateOtherInfo);
    //管理员删除用户
    app.post('/user/delete', user.deleteUser);
    //管理员更新用户的标签
    app.post('/user/updateTag', user.updateTag);
    //用户自己更新密码
    app.post('/user/updatePassword', user.updatePassword);

    //微言模块
    app.post('/wei/create', weibo.create);
    
    app.get('/wei/get', weibo.get);
    
    app.post('/wei/delete', weibo.deleteWeibo);
    
    app.get('/wei/zan', weibo.zan);
    
    app.get('/wei/comment', weibo.comment);
    //置空敏感微博
    app.post('/wei/set2null', weibo.updateWeibo2Null);
    //根据单一条件查询
    app.get('/wei/getByCondition', weibo.getWeiboByCondition);
    //获取某个用户的微博
    app.get('/wei/getByToken', weibo.getByToken);

    //上传图片
    app.post('/upload/img', upload.uploadImg);

    //文章模块，暂时只有管理员拥有权限，因为服务器资源有限
	app.post('/article/create', article.create);
	//获取前五篇文章的简介
	app.get('/article/get', article.get);
	//根据ID获取单篇文章
	app.get('/article/get/id', article.getById);

    //邮件模块，只有管理员使用
    app.post('/email/findPassword', email.findPassword);

};