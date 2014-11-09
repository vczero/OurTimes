var mongoskin = require('mongoskin'),
    xss = require('xss'),
    CRUD = require('./../../util/crud'),
    status = require('./../../util/status'),
    mcrypto = require('./../../util/mcrypto'),
    USER_TYPE = require('./USER_TYPE'),
    GUID = require('../../util/guid');
    crud = new CRUD('user');

module.exports = {
    /*
     * 注册一个用户
     *
     * */
    register: function(req, res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", 'X-Requested-With,application/json');
		res.header('Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS');

        var userInfo = req.body;
        //密码不一致或缺失
        if(userInfo.password && userInfo.password !== userInfo.repeatPassword)
            return res.send(status.repeatPassword);
		//email缺失
        if(!userInfo.email)
           return res.send(status.emailLack);
        
        var user = {
        	//生成唯一的user id
        	userid: GUID.create() + '-' + mcrypto.md5Password(userInfo.email).toUpperCase(),
        	email: xss(userInfo.email),
        	password: mcrypto.md5Password(userInfo.password),
        	time: new Date(),
        	tag: USER_TYPE.GUEST, //默认为游客
        	nickname: ''
        };
		
        return crud.create(user, function(data){
            //注册成功,登录新用户
            if (data.status) {
                return res.send(status.success);
            }
            return res.send(status.fail);
        });
    },
    /*
    * 用户登录
    *
    * */
    login: function(req, res){
    	res.setHeader('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", 'X-Requested-With,application/json');
		res.header('Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS');

        var user = req.body,
            email = user.email,
            password = mcrypto.md5Password(user.password),
            query = {
                email: email,
                password: password
            };
        crud.read(query, function(data){
            if(data.status){
            	var accessToken = {
            		token: data.items[0]._id,
            		status: status.success.status
            	};
                return res.send(accessToken);
            }
            return res.send(status.fail);
        });
    },

    /*
     * 根据用户的ID,返回用户的信息
     *
     * */
    get: function(req, res){		
        var id = req.query.id;
        
        crud.read({userid: id}, function(data){
            if(req.query['callback']){
                data = jsonp.getJSONP(req.query['callback'], data);
            }else{
                res.setHeader('Access-Control-Allow-Origin', '*');
            }
            var obj = {};
            if(data.items.length){
            	obj = data.items[0];
            	obj.status = 1;
            	delete obj['_id'];
            	delete obj['password'];
            	delete obj['email'];
            }else{
            	obj.status = 0;
            }
           	
            return res.send(obj);
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

