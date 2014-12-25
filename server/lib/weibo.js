var mongoskin = require('mongoskin'),
    xss = require('xss'),
    db = require('./../util/mongo'),
    header = require('./../util/header'),
    USER_TYPE = require('./user_type');

var weibo = 'weibo',
    user = 'user',
    str2ObjId = mongoskin.helper.toObjectID;

db.bind(weibo);
db.bind(user);
/*
 + 用途：用于用户发表微言管理
 + 作者：vczero
 + 版本：v2.0 
 + 更新：摒弃封装MongoSkin Util的作法
 + 部分接口无需鉴权，其他接口均需鉴权
 */
module.exports = {
   	//增加一条微博
    create: function(req, res) {
        header.set(req, res);
        var content = req.body,
            token = content.token;
        db[user].find({token: token}).toArray(function(err, items) {
            if (!err && 　items.length) {
                var wei = {
                    userid: items[0]['userid'],
                    content: xss(content.content),
                    nickname: items[0]['nickname'],
                    realname: items[0]['reaname'],
                    avatar: items[0]['avatar'],
                    email: items[0]['email'],
                    time: new Date(),
                    tag: xss(content.tags),
                    zans: [],
                    comments: []
                };

                db[weibo].save(wei, function(err, item) {
                    if (!err) {
                        item.status = 1;
                        res.send(item);
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
   	//获取前10条微博
    get: function(req, res) {
        header.set(req, res);
        var page = req.query.page || 0;
        var pageSize = 0;
        //这一块需要优化
        db[weibo].find({}).toArray(function(err, items){
            pageSize = Math.ceil(items.length / 10);
        });
        
        db[weibo].find({}).sort({time: -1}).skip(parseInt(page)).limit(10).toArray(function(err, items) {
            if (!err) {
                var data = {};
                data.status = 1;
                data.pageSize = pageSize;
                data.items = items;
                return res.send(data);
            } else {
                return res.send({
                    status: 0
                });
            }
        });
    },
    //点赞
    zan: function(req, res) {
        header.set(req, res);
        var query = req.query,
            id = query.id,
            token = query.token;

        db[user].find({token: token}).toArray(function(err, items) {
            if (!err && items.length) {
                var userid = items[0].userid;
                db[weibo].find({_id: str2ObjId(id)}).toArray(function(err, items) {
                    if (!err && items.length) {
                        var zans = items[0].zans,
                            query = {
                                _id: str2ObjId(id)
                            },
                            $set = {},
                            data = {};

                        for (var i = 0; i < zans.length; i++) {
                            if (zans[i] === userid) {
                                data.status = 1;
                                return res.send(data);
                            }
                        }
                        zans.push(userid);
                        $set = {
                            $set: {
                                zans: zans
                            }
                        };
                        db[weibo].update(query, $set, function(err) {
                            if (!err) {
                                data.status = 1;
                                data.zans = zans;
                                return res.send(data);
                            } else {
                                data.status = 0;
                                return res.send(data);
                            }
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
    //评论
    comment: function(req, res) {
        header.set(req, res);
        var query = req.query,
            id = query.id,
            comment = xss(query.comment),
            token = query.token;

        db[user].find({token: token}).toArray(function(err, items) {
            if (!err && items.length) {
                var userid = items[0].userid;
                    commentNickname = items[0].nickname,
                    commentEmail = items[0].email,
                    avatar = items[0].avatar;
                db[weibo].find({_id: str2ObjId(id)}).toArray(function(err, items) {
                    if (!err && items.length) {
                        var comments = items[0].comments,
                            query = {
                                _id: str2ObjId(id)
                            },
                            $set = {},
                            item = {
                                userid: userid,
                                email: commentEmail,
                                nickname: commentNickname,
                                comment: comment,
                                avatar: avatar,
                                time: new Date()
                            };
                        comments.push(item);
                        $set = {
                            $set: {
                                comments: comments
                            }
                        };
                        db[weibo].update(query, $set, function(err) {
                            if (!err) {
                                return res.send({
                                    status: 1,
                                    email: item.email,
                                    nickname: item.nickname,
                                    comment: item.comment,
                                    time: item.time,
                                    avatar: avatar
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
            } else {
                return res.send({
                    status: 0
                });
            }
        });
    },
    //删除微博
    deleteWeibo: function(req, res) {
        header.set(req, res);
        var body = req.body,
            token = body.token,//用户Token
            _id = body._id; //微博ID
        db[user].find({token: token}).toArray(function(err, items) {
            if (!err && items.length) {
                var query = {
                	userid: items[0].userid,
                	_id: str2ObjId(_id)
                };
                db[weibo].remove(query, function(err){
                	if(!err){
                		return res.send({status: 1});
                	}else{
                		return res.send({status: 0});
                	}
                });
            } else {
                return res.send({status: 0});
            }
        });
    },
    //根据 email, realname, nickname, keywords查询只一条件
    getWeiboByCondition: function(req, res){
    	header.set(req, res);
        var query = req.query,
            email = query.email,
            realname = query.realname,
            nickname = query.nickname,
            content = query.content,
        	condition = {test: 'test'};
        if(email){
        	condition = {email: email};
        }
        if(realname){
        	condition = {realname: realname};
        }
        if(nickname){
        	condition = {nickname: nickname};
        }
        if(content){
        	condition = {
        		content: new RegExp(content)
        	};
        }
        
        db[weibo].find(condition).toArray(function(err, items){
        	if(!err && items.length){
        		items[0].status = 1;
        		delete items[0].zans;
        		delete items[0].time;
        		delete items[0].userid;
        		return res.send(items[0]);
        	}else{
        		return res.send({status: 0});
        	}
        });           
    },
    //修改微博，管理员权限
    //功能是：内容置为： '含有敏感信息，已经除去' 并且所有评论置空
    updateWeibo2Null: function(req, res){
    	header.set(req, res);
    	var token = req.body.token;
    	var _id = req.body._id;
    	db[user].find({token: token}).toArray(function(err, items){
    		if(!err && items.length && items[0].tag === USER_TYPE.ADMIN){
    			var query = {_id: str2ObjId(_id)};
    			var $set = {
    				$set: {
    					content: '您的微博含有敏感信息，已被系统去除。请遵守网络文明公约。',
    					zans: [],
    					comments: []
    				}
    			};
    			db[weibo].update(query, $set, function(err){
    				if(!err)
    					return res.send({status: 1});
    				return res.send({status: 0});
    			});
    		}else{
    			res.send({status: 0});
    		}
    	});
    },
    //根据用户ID，查询微博，包含分页，每页10条记录
    getByToken: function(req, res){
    	header.set(req, res);
    	var token = req.query.token || '';
    	var page = (req.query.page || 0) * 10;
    	
    	//查询到用户，获取userid
    	db[user].find({token: token}).toArray(function(err, items){
    		if(!err && items.length){
    			var userid = items[0].userid;
    			var pageSize = 0;
    			db[weibo].find({userid: userid}).toArray(function(err, items){
            		pageSize = Math.ceil(items.length / 10);
        		});
    			
    			//查询该userid的微博
    			db[weibo].find({userid: userid}).sort({time: -1}).skip(parseInt(page)).limit(10).toArray(function(err, items){
    				if(!err){
    					var data = {};
    					data.status = 1;
    					data.pageSize = pageSize;
    					data.items = items;
    					res.send(data);
    				}else{
    					return res.send({status: 0});
    				}
    			});
    		}else{
    			return res.send({status: 0});
    		}
    	});
    }
    
 };
