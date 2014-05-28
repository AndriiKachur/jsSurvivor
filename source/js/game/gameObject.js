function GameObject(gameInfo) {
    this.gameInfo = gameInfo;
    this.toRemove = false;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    this.draw = function(ctx) {

    };

    this.calculateNextStep = function(dt) {

    };

    this.isOutOfCanvas = function(dx, dy) {
        return  (this.x + this.w + dx > this.gameInfo.w) || (this.x + dx < 0 )
            || (this.y + this.h + dy > this.gameInfo.h) || (this.y + dy < 0);
    };

}
