var mongoskin = require('mongoskin'),
    xss = require('xss'),
    db = require('./../util/mongo'),
    header = require('./../util/header');
    
var weibo = 'weibo',
    user = 'user',
    article = 'article',
    str2ObjId = mongoskin.helper.toObjectID;
db.bind(weibo);
db.bind(user);
db.bind(article);

module.exports = {
	//create
	create: function(req, res){
		header.set(req, res);
        var body = req.body,
            token = body.token,
            author = body.author || '',
            time = body.time || new Date(),
            title = body.title || '',
            content = body.content || [], //数组，每一段落一个元素
            link = body.link,
            pics = body.pics; //对应content数组
        db[user].find({token: token}).toArray(function(err, items) {
        	if(!err && items.length && items[0].tag === 'admin'){
        		var news = {
        			title: xss(title),
        			author: xss(author),
        			time: xss(time),
        			link: xss(link),
        			content: xss(content),
        			pics: xss(pics)
        		};
        		
        		db[article].save(news, function(err, item){
        			if(!err){
        				item.status = 1;
        				res.send(item);
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
	
	//get 
	// 返回前5条的_id,标题，作者，时间，pic
	get: function(req, res){
		header.set(req, res);
		db[article].find({}).sort({time: -1}).limit(5).toArray(function(err, items) {
            if (!err) {
            	var data = {};
            	data.status = 1;
            	//过滤不必要字段
            	for(var i in items){
            		delete items[i].content;
            		items[i].pic = items[i].pics.length ? items[i].pics[0]: '';
            	}
            	data.items = items;
                return res.send(data);
            } else {
                return res.send({
                    status: 0
                });
            }
        });
	},
	
	//detail
	getById: function(req, res){
		header.set(req, res);
		var id = req.query.id;
		db[article].find({_id: str2ObjId(id)}).toArray(function(err, items){
			if(!err && items.length){
				items[0].status = 1;
				return res.send(items[0]);
			}else{
				return res.send({
                    status: 0
                });
			}
		});
	}
};
