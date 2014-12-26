var mongoskin = require('mongoskin'),
    xss = require('xss'),
    mcrypto = require('./../util/mcrypto'),
    guid = require('./../util/guid'),
    db = require('./../util/mongo'),
    header = require('./../util/header'),
    config = require('./../config'),
    USER_TYPE = require('./user_type');


var SERVER_URL = config.BASE_URL;
var collectionName = 'user',
    str2ObjId = mongoskin.helper.toObjectID,
    /*
    + 基础的URL，例会头像的服务器URL,默认头像的URL等
    + 可能包括静态文件服务器，所以，数据资源必须独立URL
    */
    BASE_URL = {
        'AVATAR': '/',
        'AVATAR_DEFAULT': ''
    };
db.bind(collectionName);
/*
 + 用途：用户鉴权，包括注册、登录以及接口调用等
 + 作者：vczero
 + 版本：v2.1
 + 更新：摒弃封装MongoSkin Util的作法；合并USER_TYPE.js & user.js
 + 切记：摒弃希望一个服务承载多个功能的做法;每个服务负责一个功能
 +
 */
module.exports = {
    //用户注册
    register: function(req, res) {
        header.set(req, res);
        var params = req.body;
        if (params.password && params.password !== params.repeatPassword)
            return res.send({status: 0});
        if (!params.email)
            return res.send({status: 0});
        //构建用户模型；加密等关键信息上线后会有不同算法修改
        var user = {
            userid: guid.create() + '-' + mcrypto.md5Password(params.email).toUpperCase(),
            token: guid.create(),
            email: xss(params.email),
            password: mcrypto.md5Password(params.password),
            time: new Date(),
            tag: USER_TYPE.GUEST,
            nickname: '',
            realname: '',
            avatar: SERVER_URL + 'zhu.png',
            address: '',
            job: '',
            tel: '',
            hometown: '',
            sign: '',
            hometown_lnglat: '',
            address_lnglat: ''
        };

        db[collectionName].save(user, function(err, item) {
            if (!err) {
                item.status = 1;
                delete item['password'];
                delete item['_id'];
                return res.send(item);
            } else {
                return res.send({
                    status: 0
                });
            }
        });
    },
    //用户登录
    login: function(req, res) {
        header.set(req, res);
        var user = req.body,
            email = user.email,
            password = mcrypto.md5Password(user.password),
            query = {
                email: email,
                password: password
            };
        db[collectionName].find(query).limit(1).toArray(function(err, items) {
            if (!err && items.length) {
                //更新token，每次登录后自己更新
                var item = items[0];
                var token = item['_id'] + guid.create();
                db[collectionName].update(query, {$set:{token: token}}, function(err){
                    if(!err){
                        item.status = 1;
                        item.token = token;
                        delete item['password'];
                        delete item['_id'];
                        return res.send(item);
                    }else{
                        return res.send({
                            status: 0
                        });
                    }
                });
            } else {
                return res.send({
                    status: 0
                });
            }
        });
    },
    //获取自己的信息
    getSelfInfo: function(req, res){
        header.set(req, res);
        var token = req.query.token; //用户自己的token
        if(token){
            db[collectionName].find({token: token}).limit(1).toArray(function(err, items) {
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
    //获取100个用户地址信息
    getOtherInfo: function(req, res){
        header.set(req, res);
        db[collectionName].find({tag: USER_TYPE.GUEST}).limit(100).toArray(function(err, items) {
            if(!err && items.length){
                var obj = {};
                obj.status = 1;
                obj.user = [];
                for(var i = 0, n = items.length; i < n; i++){
                    if(items[i].address_lnglat){
                        delete items[i]['token'];
                        delete items[i]['password'];
                        delete items[i]['_id'];
                        delete items[i]['tel'];
                        // delete items[i]['address'];
                        delete items[i]['job'];
                        // delete items[i]['hometown'];考虑是否暴露此字段
                        // delete items[i]['hometown_lnglat'];
                        delete items[i]['realname'];
                        obj.user.push(items[i]);
                    }
                }
                return res.send(obj);
            }else{
                return res.send({
                    status: 0
                });
            }
        });
    },
    //根据昵称获取单个用户的基本信息
    getOtherInfoByNickname: function(req, res){
        header.set(req, res);
        var nickname = req.query.nickname || '';
        db[collectionName].find({nickname: nickname}).limit(1).toArray(function(err, items) {
            if(!err && items.length){
                delete items[0]['token'];
                delete items[0]['password'];
                delete items[0]['_id'];
                delete items[0]['tel'];
                // delete items[i]['address'];
                delete items[0]['job'];
                // delete items[i]['hometown'];考虑是否暴露此字段
                // delete items[i]['hometown_lnglat'];
                delete items[0]['realname'];
                items[0].status = 1;
                return res.send(items[0]);
            }else{
                return res.send({
                    status: 0
                });
            }
        });
    },

    //获取'ben'类用户信息
    getBenInfo: function(req, res){
        header.set(req, res);
        var token = req.query.token; //登录用户的token
        if(token){
            db[collectionName].find({token: token}).limit(1).toArray(function(err, items) {
                if(!err && items.length && items[0].tag === USER_TYPE.BEN){
                    db[collectionName].find({tag: USER_TYPE.BEN}).limit(300).toArray(function(err, items){
                        for(var i = 0, n = items.length; i < n; i++){
                            delete items[i]['token'];
                            delete items[i]['password'];
                            delete items[i]['_id'];
                        }
                        var obj = {
                            status: 1,
                            users: items
                        };
                        return res.send(obj);
                    });
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
    //获取单个ben用户信息
    getSingleBen: function(req, res){
        header.set(req, res);
        var token = req.query.token; //登录用户的token(自己必须是BEN用户)
        var id = req.query.userid; //需要查询人的ID
        if(token && id){
            db[collectionName].find({token: token}).limit(1).toArray(function(err, items) {
                if(!err && items.length && items[0].tag === USER_TYPE.BEN){
                    db[collectionName].find({userid: id}).limit(1).toArray(function(err, items) {
                        if(!err && items.length){
                            var item = items[0];
                            item.status = 1;
                            delete item[i]['token'];
                            delete item[i]['password'];
                            delete item[i]['_id'];
                            res.send(item);
                        }
                    });
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

    //根据真实姓名获取'ben'用户信息
    getSingleBenByRealname: function(req, res){
        header.set(req, res);
        var token = req.query.token; //登录用户的token(自己必须是BEN用户)
        var realname = req.query.realname || ''; //需要查询人的ID
        if(token && realname){
            db[collectionName].find({token: token}).limit(1).toArray(function(err, items) {
                if(!err && items.length && items[0].tag === USER_TYPE.BEN){
                    db[collectionName].find({realname: realname}).limit(1).toArray(function(err, items) {
                        if(!err && items.length){
                            var item = items[0];
                            item.status = 1;
                            delete item['token'];
                            delete item['password'];
                            delete item['_id'];
                            res.send(item);
                        }
                    });
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

    // 获取所有的用户的信息,后期采取分页策略
    getAll: function(req, res) {
        header.set(req, res);
        var token = req.query.token;
        db[collectionName].find({token: token}).toArray(function(err, items) {
            if (!err && items.length && items[0].tag === USER_TYPE.ADMIN) {
                //返回所有用户信息
                db[collectionName].find({}).toArray(function(err, data) {
                    if (!err) {
                        for (var i = 0; i < data.length; i++) {
                            delete data[i]['password'];
                            delete data[i]['token'];
                            delete data[i]['_id'];
                        }
                        return res.send({
                            status: 1,
                            items: data
                        });
                    } else {
                        return res.send({
                            status: 0
                        });
                    }
                });
            } else {
                return res.send({
                    status: 0
                });
            }
        });
    },
    //ben用户更新自己的信息
    updateBen: function(req, res){
        header.set(req, res);
        var user = req.body,
            token = user.token || '',
            nickname = user.nickname || '',
            realname = user.realname || '',
            tel = user.tel || '',
            address = user.address || '',
            job = user.job || '', 
            hometown = user.hometown || '',
            sign = user.sign || '',
            hometown_lnglat = user.hometown_lnglat || '',
            address_lnglat = user.address_lnglat || '',
            objectID = mongoskin.helper.toObjectID;

        if(hometown_lnglat && hometown_lnglat.lng){
            hometown_lnglat = hometown_lnglat.lng + ',' + hometown_lnglat.lat;
        }
        if(address_lnglat && address_lnglat.lng){
            address_lnglat = address_lnglat.lng + ',' + address_lnglat.lat;
        }
        if(token){
            db[collectionName].find({token: token}).toArray(function(err, items) {
                if(!err && items.length && items[0].tag === USER_TYPE.BEN){
                    var query = {token: token},
                        $set = {
                            $set: {
                                nickname: xss(nickname) || items[0].nickname,
                                realname: xss(realname) || items[0].realname,
                                tel: xss(tel) || items[0].tel,
                                address: xss(address) || items[0].address,
                                job: xss(job) || items[0].job,
                                hometown: xss(hometown) || items[0].hometown,
                                sign: xss(sign) || items[0].sign,
                                hometown_lnglat: xss(hometown_lnglat) || items[0].hometown_lnglat,
                                address_lnglat: xss(address_lnglat) || items[0].address_lnglat
                            }
                        };
                    db[collectionName].update(query, $set, function(err) {
                        if (!err) {
                            return res.send({
                                status: 1
                            });
                        } else {
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
        }else{
            return res.send({
                status: 0
            });
        }
    },
    //更新一般用户信息
    updateOtherInfo: function(req, res){
        header.set(req, res);
        var user = req.body,
            token = user.token || '',
            nickname = user.nickname || '',
            address = user.address || '',
            hometown = user.hometown || '',
            sign = user.sign || '', 
            hometown_lnglat = user.hometown_lnglat || '',
            address_lnglat = user.address_lnglat || '',
            objectID = mongoskin.helper.toObjectID;

        if(hometown_lnglat && hometown_lnglat.lng){
            hometown_lnglat = hometown_lnglat.lng + ',' + hometown_lnglat.lat;
        }
        if(address_lnglat && address_lnglat.lng){
            address_lnglat = address_lnglat.lng + ',' + address_lnglat.lat;
        }


        if(token){
            db[collectionName].find({token: token}).toArray(function(err, items) {
                if(!err && items.length){
                    var query = {token: token},
                        $set = {
                            $set: {
                                nickname: xss(nickname) || items[0].nickname,
                                address: xss(address) || items[0].address,
                                hometown: xss(hometown) || items[0].hometown,
                                sign: xss(sign) || items[0].sign,
                                hometown_lnglat: xss(hometown_lnglat.toString()) || items[0].hometown_lnglat,
                                address_lnglat: xss(address_lnglat.toString()) || items[0].address_lnglat
                            }
                        };
                    db[collectionName].update(query, $set, function(err) {
                        if (!err) {
                            return res.send({
                                status: 1
                            });
                        } else {
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
        }else{
            return res.send({
                status: 0
            });
        }
    },
    //删除某个用户
    deleteUser: function(req, res) {
        header.set(req, res);
        var body = req.body,
            userid = body.userid || '',
            token = body.token || '';
        db[collectionName].find({token: token}).toArray(function(err, items) {
            if (!err && items.length && items[0].tag === USER_TYPE.ADMIN) {
                db[collectionName].remove({userid: userid}, function(err) {
                    if (!err) {
                        return res.send({
                            status: 1
                        });
                    } else {
                        return res.send({
                            status: 0
                        });
                    }
                });
            } else {
                return res.send({
                    status: 0
                });
            }
        });
    },
    //更新用户的标签
    updateTag: function(req, res) {
        header.set(req, res);
        var query = req.body,
            userId = query.userid,
            tag = query.tag,
            token = query.token;

        db[collectionName].find({ token: token}).toArray(function(err, items) {
            if (!err && items.length && items[0].tag === USER_TYPE.ADMIN) {
                var query = {
                        userid: userId
                    },
                    $set = {
                        $set: {
                            tag: tag 
                        }
                    };
                db[collectionName].update(query, $set, function(err) {
                    if (!err) {
                        return res.send({
                            status: 1
                        });
                    } else {
                        return res.send({
                            status: 0
                        });
                    }
                })

            } else {
                return res.send({
                    status: 0
                });
            }
        });
    },
    //修改密码功能
    updatePassword: function(req, res){
    	header.set(req, res);
        var token = req.body.token,
        	oldPassword = req.body.oldPassword,
            newPassword = req.body.newPassword,
            rePassword = req.body.rePassword;
        if(newPassword !== rePassword){
            return res.send({
                status: 0,
                info: '两次密码不一致'
            });
        }
        if(token){
        	var filter = {
        		token: token,
        		password: mcrypto.md5Password(oldPassword)
        	};
        	console.log(filter);
            db[collectionName].find(filter).toArray(function(err, items){
                if(!err && items.length){
                    var query = {token: token},
                        $set = {$set: {password: mcrypto.md5Password(newPassword)}};
                    db[collectionName].update(query, $set, function(err){
                        if(!err){
                            return res.send({
                                status: 1
                            });
                        }else{
                            return res.send({
                                status: 0,
                                info: '更新密码失败...'
                            });
                        }
                    });
                }else{
                    return res.send({
                        status: 0,
                        info: '你原始密码错误...'
                    });
                }
            });
        }else{
            return res.send({
                status: 0,
                info: '请先登录'
            });
        }
    },
    //根据邮箱，查找用户
    //根据昵称
    //根据真实姓名
    getUserByEmail_Nick_Real: function(req, res){
    	header.set(req, res);
        var query = req.query,
            token = query.token,
            condition = {test: 'test'}; //default

        if(query.email){
        	condition = {email: query.email};
        }
        
        if(query.nickname){
        	condition = {nickname: query.nickname};
        }
        
        if(query.realname){
        	condition = {realname: query.realname};
        }
        
        db[collectionName].find({token: token}).toArray(function(err, items){
        	if(!err && items.length && items[0].tag === USER_TYPE.ADMIN){
        		console.log(condition);
        		db[collectionName].find(condition).toArray(function(err, items){
        			if(!err){
        				var data = {};
        				data.status = 1;
        				data.items = items;
        				return res.send(data);
        			}else{
        				return { status: 0 };
        			}
        		});
        	}else{
        		return { status: 0 };
        	}
        });
    }
};