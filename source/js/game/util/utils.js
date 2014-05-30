var UTILS = {
    calculateArrayNextStep: function(array, dt, gameInfo) {
        if (!array) return;

        for (var i = array.length - 1; i >= 0; i--) {
            array[i].calculateNextStep(dt);
            if (array[i].toRemove) array.splice(i, 1);
        }
    },

    hypot: function(x1, y1, x2, y2) {
        return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5)
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
    },

    setTimeout: function(fn, delay, context) {
        var func = context ? function(){ fn.call(context);} : fn;
        var handler = setTimeout(func, delay);
        return function() {
            clearTimeout(handler);
        }
    },

    showCollision: function(ctx, obj) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.arc(obj.x, obj.y, obj.wide, 0, 360, false);
        ctx.stroke();

        ctx.restore();
    },

    inverseArray: function(arr) {
        arr.push = function() {
            Array.prototype.unshift.apply(this, arguments);
        };
        arr.unshift = function() {
            Array.prototype.push.apply(this, arguments);
        };
    }
};
