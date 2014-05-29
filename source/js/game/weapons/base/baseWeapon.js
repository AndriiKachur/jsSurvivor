function BaseWeapon(gameInfo, player) {
    this.gameInfo = gameInfo;
    this.player = player;
    this.bullets = [];
    this.fire = false;
    this.fireDelay = 150;

    this.shoot = function() {
        if (this.fire) {
            this.bullets.push(new Bullet(this.gameInfo, this.player.x, this.player.y));
        }
    };

    this.draw = function (ctx) {
        this.bullets.forEach(function(bullet) {
            bullet.draw(ctx);
        });
    };

    this.calculateNextStep = function(dt) {
        UTILS.calculateArrayNextStep(this.bullets, dt, this.gameInfo);
    };

}

BaseWeapon.prototype = new GameObject();
BaseWeapon.prototype.fn = BaseWeapon;
