Touch.isTouchDevice = function() {
    return 'ontouchstart' in window // works on most browsers
        || 'onmsgesturechange' in window; // works on ie10
};

function Touch (drawCtx, gameInfo, shootFn) {
    var touch = this;

    this.ctx = drawCtx;
    this.gameInfo = gameInfo;
    this.touches = [];
    this.shootFn = shootFn;
    this.fireControl = {
        x:  0,
        y: 0,
        r: 0
    };
    this.moveControl = {
        x:  0,
        y: 0,
        r: 0
    };

    this.ongoingTouchIndexById = function (idToFind) {
        for (var i = 0; i < this.touches.length; i++) {
            var id = this.touches[i].identifier;
            if (id == idToFind) {
                return i;
            }
        }
        return -1;
    };


    this.drawControls = function() {
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

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.fireControl.x, this.fireControl.y, this.fireControl.r, 0, 360);
        this.ctx.fillStyle = 'rgba(160, 22, 22, 0.5)';
        this.ctx.fill();
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#222';
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.moveControl.x, this.moveControl.y, this.moveControl.r, 0, 360);
        this.ctx.fillStyle = 'rgba(160, 22, 22, 0.5)';
        this.ctx.fill();
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#222';
        this.ctx.stroke();
        this.ctx.restore();
    };

    this.handleStart = function (evt) {
        evt.preventDefault();
        var el = evt.target;
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            touch.touches.push(touch.copyTouch(touches[i]));
        }

        touch.calculateDirections();
    };
    this.handleMove = function (evt) {
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

        touch.calculateDirections();
    };
    this.handleEnd = function (evt) {
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

        touch.calculateDirections();
    };
    this.handleCancel = function (evt) {
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            touch.touches.splice(i, 1);
        }

        touch.calculateDirections();
    };
    this.copyTouch = function (touch) {
        return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    };
    this.getFireDirection = function () {
        var angle = this.getAngle(this.fireControl);
        if (angle) {
            return {
                rad: angle,
                deg: UTILS.radToDegrees(angle)
            };
        }
        return null;
    };
    this.getMoveDirection = function () {
        var angle = this.getAngle(this.moveControl);
        if (angle) {
            return {
                rad: angle,
                deg: UTILS.radToDegrees(angle)
            };
        }
        return null;
    };
    this.getAngle = function (control) {
        var angle = null;

        this.touches.some(function (touch) {
            var distance = UTILS.hypot(control.x, control.y, touch.pageX, touch.pageY);

            if (distance > control.r) return false;

            angle = Math.atan2(touch.pageY - control.y, touch.pageX - control.x);

            return true;
        });

        return angle;
    };

    this.calculateDirections = function () {
        var moveAngle = touch.getMoveDirection(),
            shootAngle = touch.getFireDirection(),
            gi = this.gameInfo,
            dirs = CONSTANTS.direction;

        if (!moveAngle) {
            gi.direction = '';
        } if (moveAngle) {
            if (moveAngle.deg <= 45 && moveAngle.deg > -45) {
                gi.direction = '' + dirs.right;
            } else if (moveAngle.deg > 45 && moveAngle.deg < 135) {
                gi.direction = '' + dirs.down;
            } else if (moveAngle.deg >= 135 || moveAngle.deg <= -135) {
                gi.direction = '' + dirs.left;
            } else {
                gi.direction = '' + dirs.up;
            }
        }


        if (!shootAngle) {
            this.shootFn();
        } else {
            this.shootFn(true);
            gi.mouseX = Math.cos(shootAngle.rad) * 150 + gi.player.x;
            gi.mouseY = Math.sin(shootAngle.rad) * 150 + gi.player.y;
        }
    }
}
