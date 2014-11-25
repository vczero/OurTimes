var user = require('./user'),
    weiyan = require('./weiyan'),
    upload = require('./upload'),
    email = require('./email');

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
    //管理员删除用户
    app.get('/user/delete', user.deleteUser);
    //管理员更新用户的标签
    app.post('/user/updateTag', user.updateTag);
    //用户自己更新密码
    app.post('/user/updatePassword', user.updatePassword);

    //微言模块
    app.post('/wei/create', weiyan.create);
    app.get('/wei/get', weiyan.get);
    app.get('/wei/zan', weiyan.zan);
    app.get('/wei/comment', weiyan.comment);

    //上传图片
    app.post('/upload/img', upload.uploadImg);

    //文章模块，暂时只有管理员拥有权限，因为服务器资源有限


    //邮件模块，只有管理员使用
    app.get('/email/findPassword', email.findPassword);

};