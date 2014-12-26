var fs = require('fs'),
    mongoskin = require('mongoskin'),
    header = require('./../util/header'),
    db = require('./../util/mongo')
    config = require('./../config'),
    BASE_URL = require('./../config').BASE_URL;

db.bind('user');
module.exports = {
    uploadImg: function(req, res) {
        header.set(req, res);
        var srcPath = req.files.upload.ws.path,
            token = req.body.token;
        db.user.find({token: mongoskin.helper.toObjectID(token)}).toArray(function(err, items) {
            var str = '<script type="text/javascript">location.href="' + config.uploadRedirectUrl + '";' + '</script>';
            if (!err && items.length) {
                var desPath = './upload/' + items[0]['userid'] + '.png';
                //重命名文件
                fs.rename(srcPath, desPath, function(err) {
                    if (err) {
                        return res.send(str);
                    } else {
                        //删除原有文件
                        fs.unlink(srcPath, function() {
                            if (err) {
                                return res.send(str);
                            }
                            //显示文件
                            fs.readFile(desPath, "binary", function(error, file) {
                                if (error) {
                                    return res.send(str);
                                } else {
                                    var query = {token: mongoskin.helper.toObjectID(token)};
                                    var $set = {$set: {avatar: BASE_URL + items[0]['userid'] + '.png'}
                                    };
                                    db.user.update(query, $set, function(err) {
                                          return res.send(str);
                                    });
                                }
                            });

                        });

                    }
                });
            } else {
                return res.send(str);
            }
        });

    }
};