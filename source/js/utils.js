var UTILS = {
    findOffset: function(obj) {
        return {
            left: (window.innerWidth / 2) - (obj.width / 2),
            top: obj.offsetTop
        };
    }
}
