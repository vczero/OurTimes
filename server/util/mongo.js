var mongoskin = require('mongoskin'),
    config = require('./../config.json');

/*
 * @des：导出数据库连接模块
 * */
module.exports = (function(){
	
    var host = config.host,
        port = config.port,
        dbName = config.dbname,
        userName = config.username,
        password = config.password,
        str = 'mongodb://' + userName + ':' + password + '@' + host +':' + port+ '/' + dbName;

    var option = {
        native_parser: true
    };

    return mongoskin.db(str, option);
})();

