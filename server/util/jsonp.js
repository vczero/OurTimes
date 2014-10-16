

module.exports = {
    
    getJSONP: function(callbackStr, data){
        return callbackStr + '(' + JSON.stringify(data) + ')';
    }
};
