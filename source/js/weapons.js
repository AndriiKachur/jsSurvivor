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
    this.velocity = 400;

    this.w = 1;
    this.h = 1;

    this.draw = function(ctx, gameInfo) {
        if (this.isMoved()) {
            ctx.clearRect(this.oldX >> 0, this.oldY >> 0, this.w * 2, this.h * 2);
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 360, false);
        ctx.fill();
    };

    this.calculateNextStep = function(dt, gameInfo) {
        var dx = 0, dy = 0;

        //TODO: get new coordinates

        this.x += dx;
        this.y += dy;
    };

}
Bullet.prototype = new GameObject();
