app.service('Time', function() {
	return {
		formatTime: function(date) {
			var time = new Date(date);
			return time.getFullYear() + '-' +
				(parseInt(time.getMonth()) + 1) + '-' +
				time.getDate() + '  ' +
				time.getHours() + ':' +
				time.getMinutes() + ':' +
				time.getSeconds();
		}
	};
});