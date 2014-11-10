var mongoskin = require('mongoskin'),
    xss = require('xss'),
    CRUD = require('./../../util/crud'),
    mcrypto = require('./../../util/mcrypto'),
    USER_TYPE = require('./USER_TYPE'),
    GUID = require('../../util/guid'),
    header = require('../../util/header'),
    crud = new CRUD('user');

module.exports = {
    //用户注册
    //userid随机生成
    //返回Token
    register: function(req, res){
    	var userInfo = req.body;
        header.set(req, res);
        if(userInfo.password && userInfo.password !== userInfo.repeatPassword)
            return res.send(status.repeatPassword);
        if(!userInfo.email)
           return res.send(status.emailLack);
        
        var user = {
        	userid: GUID.create() + '-' + mcrypto.md5Password(userInfo.email).toUpperCase(),
        	email: xss(userInfo.email),
        	password: mcrypto.md5Password(userInfo.password),
        	time: new Date(),
        	tag: USER_TYPE.GUEST,
        	nickname: ''
        };
		
        return crud.create(user, function(data){
            if (data.status) {
            	data.token = data['_id'];
            	delete data['password'];
            	delete data['_id'];
                return res.send(data);
            }
            return res.send(data);
        });
    },
    //用户登录
    //返回token
    login: function(req, res){
    	var user = req.body,
            email = user.email,
            password = mcrypto.md5Password(user.password),
            query = {
                email: email,
                password: password
            };
    	header.set(req, res);
        crud.read(query, function(data){
            if(data.status && data.items.length){
            	var obj = data.items[0];
            	obj.token = obj['_id'];
            	delete obj['password'];
            	delete obj['_id'];
                return res.send(obj);
            }
            return res.send(data);
        });
    },

    //根据userid,返回用户信息
    get: function(req, res){
    	var id = req.query.id;
    	header.set(req, res);
        crud.read({userid: id}, function(data){
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
    //返回所有用户信息
    //管理员用户登陆后才能删除
    getAllUser: function(req, res){
    	var token = req.query.token;
    	header.set(req, res);
    	crud.read({_id: mongoskin.helper.toObjectID(token)}, function(data){
    		if(data.items.length){
    			var tag = data.items[0].tag;
    			if(tag === USER_TYPE.ADMIN){
    				crud.read({}, function(data){
    					for(var i = 0; i < data.items.length; i++){
    						delete data.items[i]['password'];
    						delete data.items[i]['_id'];
    					}
    					return res.send(data);
    				});
    			}else{
    				data.items = [];
    				return res.send(data);
    			}
    		}else{
    			return res.send(data);
    		}
    	});
    },

   	//更新用户信息
    update: function(req, res){
    	var user = req.body,
        	token = user.token,
        	nickname = user.nickname,
        	objectID = mongoskin.helper.toObjectID;
    	header.set(req, res);
       	//是否存在当前用户
        crud.read({_id: objectID(token)}, function(data){
        	//修改当前用户的昵称
        	if(data.items.length){
        		crud.update({_id: objectID(token)}, {nickname: nicknname}, function(data){
	                return res.send(data);
	            });
        	}else{
        		return res.send(data);
        	}
        });
    },
    //删除某个用户
    //管理员
    delete: function(req, res){
    	var query = req.query,
    	    userId = query.userid,
    	    token = query.token;
    	header.set(req, res);
    	crud.read({_id: mongoskin.helper.toObjectID(token)},function(data){
    		if(data.items.length && data.items[0].tag === USER_TYPE.ADMIN){
    			crud.deleteData({userid: userId}, function(data){
    				data.message = '删除成功';
    				res.send(data);
    			});
    		}else{
    			res.send(data);
    		}
    	});
    }
};

