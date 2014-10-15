
module.exports = {
    /*
    * 成功状态
    *
    * */
    success: {
        status: 1,
        message: 'OK'
    },

    /*
    * 失败状态
    *
    * */
    fail: {
        status: 0,
        message: 'FAIL'
    },

    /*
    * 两次输入的密码不一致
    * */
    repeatPassword: {
        status: 0,
        message: '两次输入的密码不一致'
    },
    /*
     * 验证码错误
     * */
    verifyCode: {
        status: 0,
        message: '验证码错误'
    },
    /*
    * 缺少email
    *
    * */
    emailLack:{
        status: 0,
        message: '缺少邮箱或者邮箱错误'
    },
    /*
     * 缺少用户名
     *
     * */
    usernameLack:{
        status: 0,
        message: '缺少用户名'
    }


 };