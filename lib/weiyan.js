var mongoskin = require('mongoskin'),
    xss = require('xss'),
    db = require('./../util/mongo'),
    header = require('./../util/header');

var weiyan = 'weibo',
    user = 'user',
    str2ObjId = mongoskin.helper.toObjectID;
db.bind(weiyan);
db.bind(user);

/*
 + 用途：用于用户发表微言管理
 + 作者：vczero
 + 版本：v2.0 
 + 更新：摒弃封装MongoSkin Util的作法
 + 部分接口无需鉴权，其他接口均需鉴权
 */
module.exports = {
    /*
     + 增加一条微言
     + 前提：鉴权通过
     */
    create: function(req, res) {
        header.set(req, res);
        var content = req.body,
            token = content.token;
        db[user].find({_id: str2ObjId(token)}).toArray(function(err, items) {
            if (!err && 　items.length) {
                var wei = {
                    userid: items[0]['userid'],
                    content: xss(content.content),
                    author: items[0]['nickname'],
                    avatar: items[0]['avatar'],
                    email: items[0]['email'],
                    time: new Date(),
                    tag: xss(content.tags),
                    zans: [],
                    comments: []
                };

                db[weiyan].save(wei, function(err, item) {
                    console.log(item);
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
    /*
     + 获取前10条微言
     + 前提：无需条件
     */
    get: function(req, res) {
        header.set(req, res);
        var page = req.query.page || 0;
        var pageSize = 0;
        //这一块需要优化
        db[weiyan].find({}).toArray(function(err, items){
            pageSize = Math.ceil(items.length / 10);
        });
        
        db[weiyan].find({}).sort({time: -1}).skip(parseInt(page)).limit(10).toArray(function(err, items) {
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
    /*
     + 点赞
     + 前提：鉴权通过
     */
    zan: function(req, res) {
        header.set(req, res);
        var query = req.query,
            id = query.id,
            token = query.token;

        db[user].find({_id: str2ObjId(token)}).toArray(function(err, items) {
            if (!err && items.length) {
                var userid = items[0].userid;
                db[weiyan].find({
                    _id: str2ObjId(id)
                }).toArray(function(err, items) {
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
                        db[weiyan].update(query, $set, function(err) {
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
    /*
    + 评论
    + 前提：鉴权通过
    */
    comment: function(req, res) {
        header.set(req, res);
        var query = req.query,
            id = query.id,
            comment = xss(query.comment),
            token = query.token;

        db[user].find({_id: str2ObjId(token)}).toArray(function(err, items) {
            if (!err && items.length) {
                var userid = items[0].userid;
                    commentNickname = items[0].nickname,
                    commentEmail = items[0].email,
                    avatar = items[0].avatar;
                db[weiyan].find({_id: str2ObjId(id)}).toArray(function(err, items) {
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
                        db[weiyan].update(query, $set, function(err) {
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
    /*
    + 删除微言
    + 前提：用户自我鉴权 或者 管理员鉴权
    */
    delete: function(req, res) {
        header.set(req, res);
        var query = req.query,
            token = query.token,
            id = query.id;
        db[user].find({_id: str2ObjId(token)}).toArray(function(err, items) {
            if (!err && items.length) {
                //管理员，直接删除该条记录
                if (items[0].tag === USER_TYPE.ADMIN || '用户自己') {

                }
            } else {
                res.send({
                    status: 0
                });
            }
        });
    }
};