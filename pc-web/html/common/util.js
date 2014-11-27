(function(global){
	var Util = {
		/*时间格式化*/
		formatTime: function(date) {
		    var time = new Date(date);
		    return time.getFullYear() + '-' +
		        (parseInt(time.getMonth()) + 1) + '-' +
		        time.getDate() + '  ' +
		        time.getHours() + ':' +
		        time.getMinutes() + ':' +
		        time.getSeconds();
		},
		/*弹出窗体*/
		alertForm: function(value) {
		    var al = document.getElementById('alertInfo');
		    var text = document.getElementById('alertMSG');
		    al.style.visibility = 'visible';
		    text.innerHTML = value;
		    setTimeout(function() {
		        al.style.visibility = 'hidden';
		    }, 2300);
		}
	};

	global.Util = Util;
})(window);