

module.exports = {
    /*
    *
    * 返回jsonp格式的数据服务
    *
    * */

    getJSONP: function(callbackStr, data){
        return callbackStr + '(' + JSON.stringify(data) + ')';
    }
};
