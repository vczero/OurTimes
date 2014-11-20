var mongoskin = require('mongoskin'),
    xss = require('xss'),
    guid = require('./../util/guid'),
    db = require('./../util/mongo'),
    header = require('./../util/header');

var contact = 'contact';
db.bind(contact);

/*
+ 联系方式 & 地址
+ 只限于本班同学使用，其他用户不可添加和浏览信息
*/

module.exports = {
	/*
	+ 添加附加信息
	+ 前提：本班同学
	*/
	addInfo: function(req, res){
		var info = req.body,
			contact = {
				address: xss(info.address) || '',
				job: xss(info.job) || '',
				tel: xss(info.tel) || '',
				hometown: xss(info.hometown) || '',
				QQ: xss(info.QQ) || ''
			};
		db[contact]
	}
};