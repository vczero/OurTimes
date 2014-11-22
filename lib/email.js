var email = require('./../util/email'),
    mcrypto = require('./../util/mcrypto'),
    status = require('./../util/status'),
    CRUD = require('./../util/crud'),
    crud = new CRUD('user'),
    verify = require('./verify');

module.exports = {
    /*
     * 发送邮件并更新密码
     *
     * */
    findPassword: function(req, res) {
        var user = req.body.user;
        //校验验证码
        if (verify.check(req, res, user.code)) {
            var email = user.email,
                username = user.username,
                title = '找回密码',
                newPassword = mcrypto.createPassword(),
                content = '您好！' + newPassword + ',系统邮件，请勿回复。谢谢！';

            var emailer = new email(email, title, content);
            emailer.send(function(data) {
                if (data.status) {
                    var query = {
                        user_name: username,
                        email: email
                    };
                    crud.update(query, {
                        password: newPassword
                    }, function(data) {
                        return res.send(data);
                    });
                }
                return res.send(data);
            });
        }
    }

};