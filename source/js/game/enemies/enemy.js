function Enemy(gameInfo) {
    this.gameInfo = gameInfo;

    this.h = this.w = 7;
    this.velocity = 110;
    this.health = 100;
    this.score = 1;

    this.collisionTargets[Bullet.name] = function(target) {
        this.health -= target.damage;
    };

    UTILS.randomBorderPosition(this, this.gameInfo);

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(this.x, this.y, this.w, 0, 360, false);
        ctx.fill();
        ctx.fillStyle = 'black';
    };

    this.calculateNextStep = function(dt) {
        if (this.checkDead()) return;

        var distance = this.velocity * dt / 1000,
            angle = Math.atan2(this.gameInfo.playerY - this.y, this.gameInfo.playerX - this.x),
            dx = Math.cos(angle) * distance,
            dy = Math.sin(angle) * distance;

        dx && (this.x += dx);
        dy && (this.y += dy);
    };
}

Enemy.prototype = new GameObject();
Enemy.prototype.fn = Enemy;
