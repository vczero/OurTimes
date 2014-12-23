/**
 * email模块提供邮件相关服务。
 * @module email
 */
var nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport(),
    mcrypto = require('./../util/mcrypto'),
    header = require('./../util/header'),
    db = require('./../util/mongo'),
    USER_TYPE = require('./user_type'),
    config = require('./../config');

db.bind('user');
module.exports = {
    /*
    + 这个功能暂时只给管理员使用
    + 根据用户的反馈，给用户重置密码
    +
    */
    findPassword: function(req, res) {
        header.set(req, res);
        var token = req.body.token,
            email = req.body.email;
        if (token) {
            db.user.find({token: token}).toArray(function(err, items) {
                if (!err && items.length && items[0].tag === USER_TYPE.ADMIN) {
                    db.user.find({email: email}).toArray(function(err, items){
                        //说明存在该用户
                        if(!err && items.length){
                            var password = mcrypto.createPassword(),
                                str = '您好，感谢使用OurTimes！根据您的反馈，系统给您重置密码为：' + password + '。请登录后立即修改密码，系统自动邮件，请勿回复————开发者：vczero',
                                opts = {
                                    from: config.email_server, //你的邮箱账号
                                    to: email, //到达的邮箱账号
                                    subject: 'OurTimes--重置密码',
                                    text: str
                                };
                            //更新用户密码
                            var query = {email: email};
                            var $set = {
                            	$set: {
                            		password: mcrypto.md5Password(password)
                            	}
                            };

							db.user.update(query, $set, function(err){
								if(!err){
									transporter.sendMail(opts, function(err, info) {
										console.log(err);
		                                if (!err) {
		                                    console.log(res);
		                                    res.send({
		                                        status: 1
		                                    });
		                                } else {
		                                    res.send({
		                                        status: 0
		                                    });
		                                }
		                            });
								}else{
									res.send({
                                        status: 0
                                    });
								}
							});
                        }else{
                            res.send({
                                status: 0
                            });
                        }
                    });
                } else {
                    res.send({
                        status: 0
                    });
                }
            });


        } else {
            res.send({
                status: 0
            });
        }
    }
};