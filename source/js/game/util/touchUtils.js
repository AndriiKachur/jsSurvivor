var touch = {
    ctx: null,
    gameInfo: null,
    touches: [],
    gameInfo: null,
    fireControl: {
        x:  0,
        y: 0,
        r: 0
    },
    moveControl: {
        x:  0,
        y: 0,
        r: 0
    },

    ongoingTouchIndexById: function (idToFind) {
        for (var i = 0; i < this.touches.length; i++) {
            var id = this.touches[i].identifier;
            if (id == idToFind) {
                return i;
            }
        }
        return -1;
    },
    isTouchDevice: function() {
        return true; //TODO: remove after debug
        return 'ontouchstart' in window // works on most browsers
            || 'onmsgesturechange' in window; // works on ie10
    },

    drawControls: function(ctx, gameInfo) {
        if (ctx) this.ctx = ctx;
        if (gameInfo) this.gameInfo = gameInfo;

        ctx = ctx || this.ctx;

        this.fireControl = {
            x:  60,
            y: this.gameInfo.h - 60,
            r: 60
        };
        this.moveControl = {
            x:  this.gameInfo.w - 60,
            y: this.gameInfo.h - 60,
            r: 60
        };

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.fireControl.x, this.fireControl.y);
        ctx.arc(this.fireControl.x, this.fireControl.y, this.fireControl.r, 0, 360);
        ctx.fillStyle = 'rgba(55, 160, 23, 0.5)';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.moveControl.x, this.moveControl.y);
        ctx.arc(this.moveControl.x, this.moveControl.y, this.moveControl.r, 0, 360);
        ctx.fillStyle = 'rgba(160, 22, 22, 0.5)';
        ctx.fill();
        ctx.restore();
    },

    handleStart: function (evt) {
        evt.preventDefault();
        var el = evt.target;
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            touch.touches.push(touch.copyTouch(touches[i]));
        }
    },
    handleMove: function (evt) {
        evt.preventDefault();
        var el = evt.target;
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = touch.ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                touch.touches.splice(idx, 1, touch.copyTouch(touches[i]));
            } else {
                console.log("can't figure out which touch to continue");
            }
        }
    },
    handleEnd: function (evt) {
        evt.preventDefault();
        var el = evt.target;
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var idx = touch.ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                touch.touches.splice(idx, 1);
            } else {
                console.log("can't figure out which touch to end");
            }
        }
    },
    handleCancel: function (evt) {
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            touch.touches.splice(i, 1);
        }
    },
    copyTouch:function (touch) {
        return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    },
    getFireDirection: function () {
        var angle = this.getAngle(this.fireControl);
        if (angle) {
            return {
                rad: angle,
                deg: UTILS.radToDegrees(angle)
            };
        }
        return null;
    },
    getMoveDirection: function () {
        var angle = this.getAngle(this.moveControl);
        if (angle) {
            return {
                rad: angle,
                deg: UTILS.radToDegrees(angle)
            };
        }
        return null;
    },
    getAngle: function (control) {
        var angle = null;

        this.touches.some(function (touch) {
            var distance = UTILS.hypot(control.x, control.y, touch.pageX, touch.pageY);

            if (distance > control.r) return false;

            angle = Math.atan2(touch.pageY - control.y, touch.pageX - control.x);

            return true;
        });

        return angle;
    }
};
