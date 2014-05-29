function Enemy(gameInfo) {
    this.gameInfo = gameInfo;

    this.h = this.w = 7;
    this.wide = this.h;
    this.velocity = 90;
    this.health = 100;
    this.damage = 4;
    this.reloadTime = 1000;
    this.isReloading = false;
    this.score = 1;

    this.collisionTargets[Bullet.name] = function(target) {
        this.health -= target.damage;
        this.checkDead();
    };

    UTILS.randomBorderPosition(this, this.gameInfo);

    this.hit = function(player) {
        if (this.isReloading) return;

        this.isReloading = true;
        player.health -= this.damage;
        var that = this;
        UTILS.setTimeout(function() {
           that.isReloading = false;
        }, this.reloadTime);
    };

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
            angle = Math.atan2(this.gameInfo.player.y + this.gameInfo.player.h / 2 - this.y,
                                this.gameInfo.player.x + this.gameInfo.player.w / 2 - this.x),
            dx = Math.cos(angle) * distance,
            dy = Math.sin(angle) * distance;

        dx && (this.x += dx);
        dy && (this.y += dy);

        this.checkDead();
    };
}

Enemy.prototype = new GameObject();
Enemy.prototype.fn = Enemy;
