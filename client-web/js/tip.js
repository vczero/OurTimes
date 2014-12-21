
//author vczero
(function(global){
	function setTip(top, left, right, bottom, width, height, content, line){
		if(document.getElementById('__vczero_vczero_tip'))
			return;
    	var div = document.createElement('div');
	    div.style.position = 'fixed';
	    if(typeof top === 'number'){
	    	 div.style.top =  top  + 'px';
	    }
	    if(typeof left === 'number'){
	    	 div.style.left = left + 'px';
	    }
	    if(typeof right === 'number'){
	    	 div.style.right = right + 'px';
	    }
	    if(typeof bottom === 'number'){
	    	 div.style.bottom = bottom + 'px';
	    }
	    
	    
	    div.id = '__vczero_vczero_tip';
	    div.style.zIndex = '100';
	    div.style.height = height + 'px';
	    div.style.width = width + 'px';
	    div.style.backgroundColor ='#000';
	    div.style.opacity = '0.7';
	    div.style.color = '#FFF';
	    div.style.textAlign = 'center';
	    div.style.fontSize = '15px';
	    div.style.lineHeight = height/line + 'px';
	    div.style.borderRadius = '3px';
	    div.innerHTML = content;
	    document.getElementsByTagName('body')[0].appendChild(div);
    }
    
    function hideTip(){
    	var tip = document.getElementById('__vczero_vczero_tip');
    	if(!tip)
    		return;
    	document.querySelector('body').removeChild(tip);
    }
    var Tip = {
    	setTip: setTip,
    	hideTip: hideTip
    }
    
    global.Tip = Tip;
	
})(window);