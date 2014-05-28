function Bullet(gameInfo, x, y) {
    this.gameInfo = gameInfo;
    this.x = x;
    this.y = y;
    this.toX = this.gameInfo.mouseX;
    this.toY = this.gameInfo.mouseY;
    this.velocity = 300;
    this.w = 1;
    this.h = 1;
    this.angle = Math.atan2(this.toY - this.y, this.toX - this.x);

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 360, false);
        ctx.fill();
    };

    this.calculateNextStep = function(dt) {
        var distance = this.velocity * (dt / 1000),
            dx = Math.cos(this.angle) * distance,
            dy = Math.sin(this.angle) * distance;

        dx && (this.x += dx);
        dy && (this.y += dy);

        if (this.isOutOfCanvas(0, 0)) {
            this.toRemove = true;
        }
    };

}
Bullet.prototype = new GameObject();
