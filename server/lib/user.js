var mongoskin = require('mongoskin'),
    xss = require('xss'),
    mcrypto = require('./../util/mcrypto'),
    guid = require('./../util/guid'),
    db = require('./../util/mongo'),
    header = require('./../util/header');


var SERVER_URL = 'http://127.0.0.1:3000/';
var collectionName = 'user',
    str2ObjId = mongoskin.helper.toObjectID,
    /*
     + 用户类型，需要根据用户类型，开放通讯录权限
     + 本班权限的同学，可以查询自己班级的通讯录
     */
    USER_TYPE = {
        'GUEST': '游客',
        'BEN': '本班',
        'TEST': '测试',
        'MIDDLE': '中间权限者',
        'ADMIN': 'admin'
    },
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
    /*
     + 用户注册
     + 需要这里进行参数的校验，包括邮箱、密码的个数
     + 后期添加验证码模块
     +
     */
    register: function(req, res) {
        header.set(req, res);
        var params = req.body;
        if (params.password && params.password !== params.repeatPassword)
            return res.send(status.repeatPassword);
        if (!params.email)
            return res.send(status.emailLack);
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
    /*
     + 用户登录
     + 获取userid、token等信息
     */
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
    /*
     +
     + 返回用户自己的信息
     */
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
    /*
     +
     + 获取其他用户(100个)的信息，删除敏感信息
     */
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
    /*
     +
     + 获取单个普通用户信息
     */
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

    /*
     + 获取tag === USER_TYPE.BEN用户的信息
     + BEN类用户的权限严格控制，由管理员管理
     */
    getBenInfo: function(req, res){
        header.set(req, res);
        var token = req.query.token; //登录用户的token
        if(token){
            db[collectionName].find({userid: id}).limit(1).toArray(function(err, items) {
                if(!err && items.length && items[0].tag === USER_TYPE.BEN){
                    db[collectionName].find({tag: USER_TYPE.BEN}).limit(1).toArray(function(err, items){
                        for(var i = 0, n = items.length; i < n; i++){
                            delete items[i]['token'];
                            delete items[i]['password'];
                            delete items[i]['_id'];
                        }
                        var obj = {
                            status: 1,
                            user: items
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
    /*
     + 获取单个USER_TYPE === BEN的用户信息
     + 
     */
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

    /*
     + 通过真实姓名获取单个USER_TYPE === BEN的用户信息
     +  
     */
    getSingleBenByRealname: function(req, res){
        header.set(req, res);
        var token = req.query.token; //登录用户的token(自己必须是BEN用户)
        var realname = req.query.realname; //需要查询人的ID
        if(token && realname){
            db[collectionName].find({token: token}).limit(1).toArray(function(err, items) {
                if(!err && items.length && items[0].tag === USER_TYPE.BEN){
                    db[collectionName].find({realname: realname}).limit(1).toArray(function(err, items) {
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
    /*
     + 获取所有的用户的信息
     + 后期采取分页策略
     */
    getAll: function(req, res) {
        header.set(req, res);
        var token = req.query.token;
        db[collectionName].find({token: token}).toArray(function(err, items) {
        	console.log(items);
            //管理员身份校验 USER_TYPE.ADMIN ---这块需要修改下
            if (!err && items.length && items[0].tag === USER_TYPE.GUEST) {
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
    /*
    + 更新BEN用户自己的信息
    + BEN用户支持修改自己的敏感信息
    */
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
    /*
     + 更新一般用户信息
     + 为保护用户敏感信息，去除tel & job & realname
     */
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
    /*
     + 删除某个用户
     + 管理员权限
     */
    deleteUser: function(req, res) {
        header.set(req, res);
        var query = req.query,
            userId = query.userid,
            token = query.token;
        db[collectionName].find({_id: str2ObjId(token)}).toArray(function(err, items) {
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
    /*
     +
     + 更新用户的类型标签
     +
     */
    updateTag: function(req, res) {
        header.set(req, res);
        var query = req.body,
            userId = query.userid,
            tag = query.tag,
            token = query.token;

        db[collectionName].find({ _id: str2ObjId(token)}).toArray(function(err, items) {
            if (!err && items.length && items[0].tag === USER_TYPE.ADMIN) {
                var query = {
                        userid: userId
                    },
                    $set = {
                        $set: {
                            tag: tag 
                        }
                    };
                //更新用户的标签，必须判断是否存在此标签
                //如果没有，修改为GUEST
                if(!this._checkUserType(tag)){
                    tag === USER_TYPE.GUEST;
                }
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
    /*
    +
    + 修改密码的功能
    +
    */
    updatePassword: function(req, res){
        var token = req.body.token,
            newPassword = req.body.newPassword,
            repeatPassword = req.body.repeatPassword;
        if(newPassword !== repeatPassword){
            return res.send({
                status: 0,
                info: '两次密码不一致'
            });
        }
        if(token){
            db[collectionName].find({token: token}).toArray(function(err, items){
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
                                info: '更新失败'
                            });
                        }
                    });
                }else{
                    return res.send({
                        status: 0,
                        info: '对不起，您没有注册'
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
    /*
    + 查询是否是USER_TYPE中的值
    +
    +
    */
    _checkUserType: function(tag){
        for(var i in USER_TYPE){
            if(USER_TYPE[i] === tag){
                return true;
            }
        }
        return false;
    }
};