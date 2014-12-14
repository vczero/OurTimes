/**
 * mongo模块提供mongodb数据库连接功能，返回的是数据库连接实例。
 * @module mongo
 */
var mongoskin = require('mongoskin'),
    config = require('./../config.json');

module.exports = (function() {

    var host = config.host,
        port = config.port,
        dbName = config.dbname,
        userName = config.username,
        password = config.password,
        str = 'mongodb://' + userName + ':' + password + '@' + host + ':' + port + '/' + dbName;

    var option = {
        native_parser: true
    };

    return mongoskin.db(str, option);
})();