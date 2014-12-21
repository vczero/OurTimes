/**
 * mcrupto模块提供加密功能，主要用户密码加密。
 * @module mcrypto
 */
var crypto = require('crypto');
module.exports = {
    //创建随机密码
    createPassword: function() {
        var pswAdd = ['5M', 'xH', 'D5', 'sJ', 'oH', 'cM'];
        var n = Math.round(Math.random() * 6),
            newPsw = '';
        n = n > 5 ? 5 : n;
        newPsw = Math.round(Math.random() * 10) 
                + pswAdd[n] + Math.round(Math.random() * 10) 
                + pswAdd[n] + Math.round((Math.random() * 10) * (Math.random() * 10));
        return newPsw;
    },
    //md5加密密码
    md5Password: function(password) {
        var md5 = crypto.createHash('md5'),
            salt = '(!%$7gv*)#bggh9';
        return md5.update(password + salt).digest('hex');
    }

};