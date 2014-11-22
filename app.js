var express = require('express'),
    http = require('http'),
    path = require('path'),
    log4js = require('log4js'),
    router = require('./lib/router'),
    config = require('./config.json');
app = express();

//设立服务端口
app.set('port', process.env.PORT || 3000);

app.use(express.favicon('./favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({uploadDir:'./upload'}));
app.use(require('connect-multiparty')());

//日志配置
log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: 'logs/access.log',
        maxLogSize: 1024,
        backups: 3,
        category: 'normal'
    }],
    replaceConsole: true
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {
    level: log4js.levels.INFO
}));


app.use(app.router);
app.use(express.static(path.join(__dirname, 'pc')));


if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}
//路由
router(app);


var fs = require('fs');
app.post('/upload/', function(req, res){
    var o_path = req.files.upload.ws.path;
    var d_path = './upload/' + req.files.upload.originalFilename;
    fs.rename(o_path, d_path, function(err){
        if(err){
            if (err) throw err;
        }else{
            fs.unlink(o_path, function() {
             if (err) throw err;
             fs.readFile(d_path, "binary", function(error, file) {
                if(error) {
                    res.writeHead(500, {"Content-Type": "text/plain"})
                    res.write(error + "\n")
                    res.end()
                } else {
                    res.writeHead(200, {"Content-Type": "image/png"})
                    res.write(file, "binary")
                    res.end()
                }
            });


          });
        }
    });
    
});


app.get('/upload/img', function(req, res){
    // show a file upload form
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(
        '<form action="/upload/" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
      );
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('API服务启动' + app.get('port'));
});