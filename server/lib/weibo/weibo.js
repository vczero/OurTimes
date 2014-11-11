var mongoskin = require('mongoskin'),
    xss = require('xss'),
    CRUD = require('./../../util/crud'),
    header = require('../../util/header'),
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
					tag: content.tag,
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
	}
};
