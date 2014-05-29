function Bullet(gameInfo, x, y) {
    this.gameInfo = gameInfo;
    this.x = x;
    this.y = y;
    this.toX = this.gameInfo.mouseX;
    this.toY = this.gameInfo.mouseY;
    this.velocity = 400;
    this.damage = 100;
    this.wide = this.h = this.w = 2;
    this.angle = Math.atan2(this.toY - this.y, this.toX - this.x);

    this.collisionTargets[Enemy.name] = function(target) {
        this.health = 0;
        this.checkDead();
    };

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 360, false);
        ctx.fill();
    };

    this.calculateNextStep = function(dt) {
        if (this.checkDead()) return;

        var distance = this.velocity * dt / 1000,
            dx = Math.cos(this.angle) * distance,
            dy = Math.sin(this.angle) * distance;

        dx && (this.x += dx);
        dy && (this.y += dy);

        if (this.isOutOfCanvas(dx, dy)) {
            this.toRemove = true;
        }
    };

}

Bullet.prototype = new GameObject();
Bullet.prototype.fn = Bullet;
