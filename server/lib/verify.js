var Canvas = require('canvas');


module.exports = {
    /*
     * 创建验证码
     *
     * */
    create: function(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var code = '',
            canvas = new Canvas(80, 30),
            ctx = canvas.getContext('2d');
        for (var i = 0; i < 4; i++) {
            code += Math.round((Math.random() * 9)).toString();
        }
        ctx.font = '20px Impact';
        ctx.fillStyle = '#2E87E6';
        ctx.rotate(.1);
        ctx.fillText(code, 10, 20);
        ctx.stroke();

//      req.session.verifyCode = code;
        return res.send(200, canvas.toBuffer());
    },

    /*
     *
     * 校验验证码
     *
     * */
    check: function(req, res, code) {
//      return req.session.verifyCode === code;
    }
};