var mongoskin = require('mongoskin'),
    xss = require('xss'),
    CRUD = require('./../util/crud'),
    verify = require('./verify'),
    status = require('./../util/status'),
    mcrypto = require('./../util/mcrypto'),
    jsonp = require('./../util/jsonp');
    crud = new CRUD('user');

module.exports = {
    /*
     * 注册一个用户
     *
     * */
    register: function(req, res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        var user = req.body;
        if(user.password && user.password !== user.repeatPassword)
            return res.send(status.repeatPassword);
        if (!verify.check(req, res, user.code))
            return res.send(status.verifyCode);
        if(!user.email)
           return res.send(status.emailLack);
        if(!user.username)
            return res.send(status.usernameLack);
        user = {
            username: xss(user.username),
            password: mcrypto.md5Password(user.password),
            time: new Date(),
            email: xss(user.email),
            description: '',
            avatar: '',
            sex: '',
            birthday: '',
            city: '',
            pic_url: '',
            count_priase: 0
        };

        return crud.create(user, function(data){

            //注册成功,登录新用户
            if (data.status) {
                req.session.user = data._id;
                return res.send(status.success);
            }
            return res.send(status.fail);
        });
    },

    /*
     * 获取用户信息
     *
     * */
    getUserInfo: function(req, res){
        var id = req.query.id,
            obId = mongoskin.helper.toObjectID(id);

        crud.read({_id: obId}, function(data){
            delete data['password'];
            if(req.query['callback']){
                data = jsonp.getJSONP(req.query['callback'], data);
            }else{
                res.setHeader('Access-Control-Allow-Origin', '*');
            }
            return res.send(data);
        });
    },

    /*
    * 用户登出
    *
    * */
    logout: function(req, res){
        req.session.user = null;
        return res.send(status.success);
    },

    /*
    * 用户登录
    *
    * */
    login: function(req, res){
        var user = req.body.user,
            username = user.username,
            password = mcrypto.md5Password(user.password),
            query = {
                username: username,
                password: password
            };
        crud.read(query, function(data){
            if(data.status){
                req.session.user = data.items[0]._id;
                return res.send(status.success);
            }
            return res.send(status.fail);
        });
    },

    /*
    * 更新用户信息
    *
    * */
    update: function(req, res){
        var userId = req.session.user || null,
            userInfo = req.body.user;
        if(userId){
            var set = {
                username: xss(userInfo['username'] || ''),
                email: xss(userInfo['email'] || ''),
                sex: xss(userInfo['sex'] || '男'),
                birthday: xss(userInfo['birthday'] || ''),
                city: xss(userInfo['city'] || ''),
                pic_url: xss(userInfo['pic_url'] || ''),
                avatar: xss(userInfo['avatar'] || '')
            };
            crud.update({_id: userId}, set, function(data){
                return res.send(data);
            });
        }
        return res.send(status.fail);
    }
};

