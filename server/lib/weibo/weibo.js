var mongoskin = require('mongoskin'),
    xss = require('xss'),
    CRUD = require('./../../util/crud'),
    header = require('../../util/header'),
    USER_TYPE = require('./../user/USER_TYPE'),
    user = new CRUD('user'),
    wei = new CRUD('weibo');

module.exports = {
	//增加一条微内容
	create: function(req, res){
		var content = req.body,
			token = content.token;
		header.set(req, res);
		user.read({_id: mongoskin.helper.toObjectID(token)}, function(data){
			if(data.items.length){
				//构建wei内容model
				var weibo = {
					userid: data.items[0]['userid'],
					content: content.content,
					author: data.items[0]['nickname'],
					email: data.items[0]['email'],
					time: new Date(),
					tag: content.tags,
					zans: [],
					comments:[]					
				};
				wei.create(weibo, function(data){
					res.send(data);
				});
			}else{
				res.send({
					status: 0
				});
			}
		});
	},
	//查看所有的微内容
	get: function(req, res){
		header.set(req, res);
		wei.read({}, function(data){
			res.send(data);
		});
	},
	//点赞
	zan: function(req, res){
		var query = req.query,
			id  = query.id,
			token = query.token;
		header.set(req, res);
		//查询当前用户是否授权
		user.read({_id: mongoskin.helper.toObjectID(token)}, function(data){
			if(data.items.length){
				var userid = data.items[0].userid;
				//查询wei内容
				wei.read({_id: mongoskin.helper.toObjectID(id)}, function(data){
					if(data.items.length){
						var zans = data.items[0].zans;
						for(var i = 0; i < zans.length; i++){
							if(zans[i] === userid){
								return res.send(data);
							}
						}
						zans.push(userid);
						wei.update({_id: mongoskin.helper.toObjectID(id)}, {zans: zans}, function(data){
							data.zans = zans;
							return res.send(data);
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
		});
	},
	//评论
	comment: function(req, res){
		var query = req.query,
			id  = query.id,
			comment = query.comment,
			token = query.token;
		console.log(comment);
		header.set(req, res);
		//查询当前用户是否授权
		user.read({_id: mongoskin.helper.toObjectID(token)}, function(data){
			if(data.items.length){
				var userid = data.items[0].userid;
				var commentNickname = data.items[0].nickname;
				var commentEmail = data.items[0].email;
				//查询wei内容
				wei.read({_id: mongoskin.helper.toObjectID(id)}, function(data){
					if(data.items.length){
						var comments = data.items[0].comments;
						var item = {
							userid: data.items[0].userid,
							email: data.items[0].email,
							nickname: data.items[0].nickname,
							comment: comment,
							time: new Date()
						};
						comments.push(item);
						wei.update({_id: mongoskin.helper.toObjectID(id)}, {comments: comments}, function(data){
							data.email = commentEmail;
							data.nickname = commentNickname;
							data.comment = item.comment;
							data.time = item.time;
							return res.send(data);
						});
					}else{
						return res.send(data);
					}
				});
			}else{
				return res.send(data);
			}
		});
	},
	//删除本条微内容
	//管理员 & 用户自身
	delete: function(req, res){
		var query = req.query,
			token = query.token, //admin or 用户自己
			id = query.id; //需要删除的记录ID
		header.set(req, res);
		user.read({_id: mongoskin.helper.toObjectID(token)}, function(data){
			if(data.items.length){
				//管理员，直接删除该条记录
				if(data.items[0].tag === USER_TYPE.ADMIN){
					
				}
				
			}else{
				res.send({
					status: 0
				});
			}
		});
	}
};
