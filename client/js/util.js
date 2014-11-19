/*
+ 工具类，用于时间格式化、组件格式化等
+ 作者：vczero
+ 全部以静态方法的形式提供
*/
(function(global) {
    var util = {
        timeFormat: function(date) {
            var time = new Date(date);
            return time.getFullYear() + '-' +
                (parseInt(time.getMonth()) + 1) + '-' +
                time.getDate() + ' ' +
                time.getHours() + ':' +
                time.getMinutes() + ':' +
                time.getSeconds();
        }
    };

    window.Util = util;
})(window);