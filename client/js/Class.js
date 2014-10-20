var Class = function(parent){
	var klass = function(){
		this.init.apply(this, arguments);
	};
	
	//改变klass的原型,klass的原型指向传进来的parent的原型
	if(parent){
		var subclass = function(){ };
		subclass.prototype = parent.prototype;
		klass.prototype = new subclass;
	}
	
	klass.prototype.init = function(){ };
	
	//定义prototype的原型的别名
	klass.fn = klass.prototype;
	klass.fn.parent = klass;
//	klass.__super = klass.__proto__; 在chrome 和FF下OK

	//添加一个代理类
	klass.proxy = function(func){
		var self = this;
		return (function(){
			return func.apply(self, arguments);
		});
	};
	
	//类属性
	klass.extend = function(obj){
		var extended = obj.extended;
		for(var i in obj){
			klass[i] = obj[i];
		}
		if(extended) extended(klass);
	};
	
	//实例属性
	klass.include = function(obj){
		var included = obj.inclued;
		for(var i in obj){
			klass.fn[i] = obj[i];
		}
		if(included) included(klass);
	};
	
	return klass;
	
};



