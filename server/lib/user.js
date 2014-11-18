var mongoskin = require('mongoskin'),
    xss = require('xss'),
    mcrypto = require('./../util/mcrypto'),
    guid = require('./../util/guid'),
    db = require('./../util/mongo'),
    header = require('./../util/header');
/*
 + 用途：用户鉴权，包括注册、登录以及接口调用等
 + 作者：vczero
 + 版本：v2.0 
 + 更新：摒弃封装MongoSkin Util的作法；合并USER_TYPE.js & user.js
 +
 */
var collectionName = 'user',
	user = db.bind(collectionName),
	str2ObjId = mongoskin.helper.toObjectID,
/*
 + 用户类型，需要根据用户类型，开放通讯录权限
 + 本班权限的同学，可以查询自己班级的通讯录
 */
    USER_TYPE = {
		'GUEST':'游客',
		'BEN': '本班',
		'TEST': '测试',
		'MIDDLE': '中间权限者',
		'ADMIN': 'admin'
	};
module.exports = {
	/*
	 + 用户注册
	 + 需要这里进行参数的校验，包括邮箱、密码的个数
	 + 后期添加验证码模块
	 +
	 */
	register: function(req, res){
		header.set(req, res);
		var params = req.body;
        if(params.password && params.password !== params.repeatPassword)
            return res.send(status.repeatPassword);
        if(!params.email)
           return res.send(status.emailLack);
        //构建用户模型；加密等关键信息上线后会有不同算法修改
        var user = {
        	userid: guid.create() + '-' + mcrypto.md5Password(params.email).toUpperCase(),
        	email: xss(params.email),
        	password: mcrypto.md5Password(params.password),
        	time: new Date(),
        	tag: USER_TYPE.GUEST,
        	nickname: ''
        };
        
        db[collectionName].save(user, function(err, item){
        	if(!err){
        		item.status = 1;
        		item.token = item['_id'];
            	delete item['password'];
            	delete item['_id'];
                return res.send(item);
        	}else{
        		return res.send({
        			status: 0
        		});
        	}
        });
	},
	/*
	 + 用户登录
	 + 获取userid、token等信息
	 */
	login: function(req, res){
		header.set(req, res);
		var user = req.body,
            email = user.email,
            password = mcrypto.md5Password(user.password),
            query = {
                email: email,
                password: password
            };
    	db[collectionName].find(query).limit(1).toArray(function(err, items){
    		if(!err && items.length){
    			var item = items[0];
            	item.status = 1;
            	item.token = item['_id'];
            	delete item['password'];
            	delete item['_id'];
            	return res.send(item);
    		}else{
    			return res.send({
    				status: 0
    			});
    		}
    	});
	},
	/*
	 +
	 + 根据userid返回当前用户信息
	 */
	get: function(req, res){
		header.set(req, res);
		var id = req.query.userid;
		if(id){
			db[collectionName].find({userid: id}).limit(1).toArray(function(err, items){
				if(!err && items.length){
					var item = items[0];
					item.status = 1;
	            	delete item['_id'];
	            	delete item['password'];
	            	return res.send(item);
				}else{
					return res.send({
						status: 0
					});
				}
			});
		}else{
			return res.send({
				status: 0
			});
		}
	},
	/*
	 + 获取所有的用户的信息
	 + 后期采取分页策略
	 */
	getAll: function(req, res){
		header.set(req, res);
		var token = req.query.token;
 		db[collectionName].find({_id: str2ObjId(token)}).toArray(function(err, items){
 			//管理员身份校验
 			if(!err && items.length && items[0].tag === USER_TYPE.ADMIN){
 				//返回所有用户信息
 				db[collectionName].find({}).toArray(function(err, data){
 					if(!err){
 						for(var i = 0; i < data.length; i++){
							delete data[i]['password'];
							delete data[i]['_id'];
						}
						return res.send(data);
 					}else{
 						return res.send({
							status: 0
						});
 					}
 				});
 			}else{
 				return res.send({
					status: 0
				});
 			}
 		});
	}
};


