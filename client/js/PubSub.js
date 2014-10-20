/*
 * 
 * 跟dom无关的基于事件编程的订阅发布者模型 
 * 
 * 
 * */
var PubSub = {
	
	subscribe: function(ev, callback){
		//创建_callbacks对象，除非他已经存在
		var calls = this._callbacks || (this._callbacks = {});
		//针对事件的key创建一个数组，除非这个数组已经存在
		(this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
		return this;
	},
	
	publish: function(){
		//将arguments转化为真正的数组
		var args = Array.prototype.slice.call(arguments, 0);
		//拿出第一个参数，即事件名称
		var ev = args.shift();
		//如果不存在_callbacks对象，则返回
		//或者如果不包含给定事件对应的数组
		var list, calls, i, l;
		if(!(calls = this._callbacks)) return this;
		if(!(list = this._callbacks[ev])) return this;
		
		//触发回调
		for( i = 0, l = list.length; i < l; i++){
			list[i].apply(this, args);
		}
		return this;
	}
};


PubSub.subscribe('change:name', function(){
	console.log('change:name事件的处理程序');
});

PubSub.publish('change:name', function(){
	console.log('change:name');
});






