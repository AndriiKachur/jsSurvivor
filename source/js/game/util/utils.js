var UTILS = {
    calculateArrayNextStep: function(array, dt, gameInfo) {
        if (!array) return;

        for (var i = array.length - 1; i >= 0; i--) {
            array[i].calculateNextStep(dt);
            if (array[i].toRemove) {
                array.splice(i, 1);
            }
        }
    }
};
