var fs = require('fs'),
	mongoskin = require('mongoskin'),
	header = require('./../util/header'),
	db = require('./../util/mongo');

var BASE_URL = 'http://127.0.0.1:3000/';
db.bind('user');
module.exports = {
	uploadImg: function(req, res) {
		header.set(req, res);
		var srcPath = req.files.upload.ws.path,
			token = req.body.token,
			desPath = './upload/' + token + '.png';
		db.user.find({_id: mongoskin.helper.toObjectID(token)}).toArray(function(err, items) {
			if (!err && items.length) {
				var str = '<script type="text/javascript">location.href="' + 'http://127.0.0.1:3000/html/user/user.html' + '";' + '</script>';
				//重命名文件
				fs.rename(srcPath, desPath, function(err) {
					if (err) {
						return res.send(str);
					} else {
						//删除原有文件
						fs.unlink(srcPath, function() {
							if (err) {
								return res.send(str);
							}
							//显示文件
							fs.readFile(desPath, "binary", function(error, file) {
								if (error) {
									return res.send(str);
								} else {
									var query = {_id: mongoskin.helper.toObjectID(token)};
									var $set = {$set: {avatar: BASE_URL + token + '.png'}
									};
									db.user.update(query, $set, function(err) {
										return res.send(str);
									});
								}
							});

						});

					}
				});
			} else {
				return res.send(str);
			}
		});

	}
};