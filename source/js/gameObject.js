function GameObject() {

    this.removed = false;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.oldW = 0;
    this.oldH = 0;
    this.oldX = 0;
    this.oldY = 0;

    this.draw = function(ctx, fieldInfo) {

    };

    this.calculateNextStep = function(dt, fieldInfo) {

    };

    this.isOutOfCanvas = function(gameInfo, dx, dy) {
        return  (this.x + this.w + dx > gameInfo.w) || (this.x + dx < 0 ) || (this.y + this.h + dy > gameInfo.h) || (this.y + dy < 0);
    };

    this.backupOld = function() {
        this.oldW = this.w;
        this.oldH = this.h;
        this.oldX = this.x;
        this.oldY = this.y;
    };

    this.isMoved = function() {
        return (this.oldX !== this.x) || (this.oldY !== this.y) || (this.oldW !== this.w) || (this.oldH !== this.h);
    };

}
