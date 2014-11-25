var nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport(),
    mcrypto = require('./../util/mcrypto'),
    db = require('./../util/mongo');



db.bind('user');
module.exports = {
    /*
    + 这个功能暂时只给管理员使用
    + 根据用户的反馈，给用户重置密码
    +
    */
    findPassword: function(req, res){
        var token = req.query.token,
            userid = req.query.userid;
        if(token){
            db.user.find({token: token}).toArray(function(err, items){
                if(!err && items.length && items[0].tag === 'admin'){

                    db.user.find({userid: userid}).toArray(function(err, items){
                        if(!err && items.length){
                            var email = items[0].email || '',
                                password = mcrypto.createPassword(),
                                str = '您好，感谢使用图班网！根据您的反馈，系统给您重置密码为：' + password 
                                      +'。请登录后立即修改密码，系统自动邮件，请勿回复————开发者：vczero',
                                opts = {
                                    from: '', //你的邮箱账号
                                    to: email, //到达的邮箱账号
                                    subject: '图班网',
                                    text: str
                                };
                            transporter.sendMail(opts, function(err, info){
                                if(!err){
                                    res.send({
                                        status: 1
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
    }
};


