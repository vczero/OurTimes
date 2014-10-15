var nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport(),
    status = require('./../util/status'),
    config = require('./../config.json');


var Email = function(email, title, content){
    this.title = title;
    this.content = content;
};

Email.prototype = {
    /*
    * 发送邮件
    *
    * */
    send: function(callback){
        transporter.sendMail({
            from: '测试邮箱<' + config.email + '>',
            to: this.email,
            subject: this.title || '',
            text: this.content || ''
        });

        //做安全认证
        callback(status.success);
    }
};


module.exports = Email;