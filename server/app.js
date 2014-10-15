
var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoStore = require('connect-mongo')(express),
    router = require('./lib/router'),
    config = require('./config.json');
    app = express();

app.set('port', process.env.PORT || 8080);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('connect-multiparty')());


var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO}));

app.use(express.cookieParser());
app.use(express.session({
    secret: config.sessionKey,
    store: new mongoStore({
        db: config.dbname,
        collection: config.sessionCollection,
        username: config.username,
        password: config.password,
        host: config.host,
        port: config.port
    })
}));



app.use(app.router);
app.use(express.static(path.join(__dirname, 'resource')));

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}
//路由
router(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('REST服务启动' + app.get('port'));
});


