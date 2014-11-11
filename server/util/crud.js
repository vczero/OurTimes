var db = require('./mongo.js'),
    status = require('./status'),
    mongoskin = require('mongoskin');
	
var	CRUD = function(collection){
    	this.collection = collection;
    	db.bind(this.collection);
	};

CRUD.prototype = {
    /*
    * @des: 创建一条记录
    * @model: 插入的记录，JSON格式的model
    * @callback：回调，返回插入成功的记录或者失败信息
    *
    * */
    create: function(model, callback){
        db[this.collection].save(model, function(err, item){
            if(err) {
                return callback(status.fail);
            }
            item.status = status.success.status;
            item.message = status.success.message;
            return callback(item);
        });
    },

    /*
    * @des：读取一条记录
    * @query：查询条件，Mongo查询的JSON字面量
    * @callback：回调，返回符合要求的记录或者失败信息
    *
    * */
    read: function(query, callback){
        db[this.collection].find(query).toArray(function(err, items){
            if(err){
                return callback(status.fail);
            }
            var obj = {
                status: status.success.status,
                message: status.success.message,
                items: items
            };

            return callback(obj);
        });
    },
    /*
    * @des：更新一条记录
    * @query：查询条件，Mongo查询的JSON字面量，此处为_id
    * @updateModel：需要更新的JSON格式的模型
    * @callback：返回成功或者失败信息
    *
    * */
    update: function(query, updateModel, callback){
        var set = {$set: updateModel};
        db[this.collection].update(query, set, function(err){
            if(err){
                return callback(status.fail);
            }else{
                return callback(status.success);
            }
        });
    },

    /*
    * @des：删除一条记录
    * @query：查询条件，Mongo查询的JSON字面量
    * @callback：返回失败或者成功的信息
    *
    * */
    deleteData: function(query, callback){
        db[this.collection].remove(query, function(err){
            if(err){
                return callback(status.fail);
            }
            return callback(status.success);
        });
    }
};


module.exports = CRUD;