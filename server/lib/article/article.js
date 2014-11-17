var mongoskin = require('mongoskin'),
    CRUD = require('./../../util/crud'),
    header = require('../../util/header'),
    article = new CRUD('article');


module.exports = {
	//
	getById: function(req, res){
		var id = req.query.id;
		header.set(req, res);
		article.read({_id: mongoskin.helper.toObjectID(id)}, function(data){
			res.send(data);
		});
	}
	
};
