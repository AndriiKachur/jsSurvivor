var UTILS = {
    calculateArrayNextStep: function(array, dt, gameInfo) {
        if (!array) return;

        for (var i = array.length - 1; i >= 0; i--) {
            array[i].calculateNextStep(dt);
            if (array[i].toRemove) {
                array.splice(i, 1);
            }
        }
    },

    random: function(max) {
        !max && (max = 10);
        return Math.random() * max;
    },

    randomBorderPosition: function(object, gameInfo) {
        if (UTILS.random() & 1) {
            object.x = UTILS.random() & 1 ? 0 : gameInfo.w;
            object.y = UTILS.random(gameInfo.h);
        } else {
            object.y = UTILS.random() & 1 ? 0 : gameInfo.h;
            object.x = UTILS.random(gameInfo.w);
        }
    },

    setInterval: function(fn, delay, context) {
        var func = context ? function(){ fn.call(context);} : fn;
        var handler = setInterval(func, delay);
        return function() {
            clearInterval(handler);
        }
    }
};
