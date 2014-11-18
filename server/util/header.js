module.exports = {
	set: function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.header("Access-Control-Allow-Headers", 'X-Requested-With,application/json');
		res.header('Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS');
	}
};