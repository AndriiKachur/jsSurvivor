function BaseWeapon() {
    this.bullets = [];

    this.shoot = function(x, y, tox, toy) {
        this.bullets.push(new Bullet(x, y, tox, toy));
    };

    this.draw = function(ctx, gameInfo) {
        this.bullets.forEach(function(bullet) {
            bullet.draw(ctx, gameInfo);
        });
    };

    this.calculateNextStep = function(dt, gameInfo) {
        this.bullets.forEach(function(bullet) {
            bullet.calculateNextStep(dt, gameInfo);
        });
    };

}
BaseWeapon.prototype = new GameObject();

function Bullet(x, y, tox, toy) {
    this.x = x;
    this.y = y;
    this.toX = tox;
    this.toY = toy;
    this.velocity = 300;
    this.w = 1;
    this.h = 1;
    this.angle = Math.atan2(this.toY - this.y, this.toX - this.x);

    this.draw = function(ctx, gameInfo) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 360, false);
        ctx.fill();
    };

    this.calculateNextStep = function(dt, gameInfo) {
        var dx = 0, dy = 0;

        var distance = this.velocity * (dt / 1000);

        dx = Math.cos(this.angle) * distance;
        dy = Math.sin(this.angle) * distance;

        this.backupOld();
        dx && (this.x += dx);
        dy && (this.y += dy);

    };

}
Bullet.prototype = new GameObject();
