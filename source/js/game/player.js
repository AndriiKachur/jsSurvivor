function Player(gameInfo) {
    this.gameInfo = gameInfo;
    this.h = this.w = 10;
    this.gameInfo.playerY = this.y = gameInfo.h / 2;
    this.gameInfo.playerX = this.x = gameInfo.w / 2;
    this.velocity = 100;
    this.weapon = new BaseWeapon(this.gameInfo, this);

    this.draw = function (ctx) {
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.weapon.draw(ctx);
    };

    this.calculateNextStep = function (dt) {
        var dx = 0, dy = 0;

        if (this.gameInfo.direction.indexOf(CONSTANTS.direction.up) >= 0) {
            dy = -1 * this.velocity * (dt / 1000);
        } else if (this.gameInfo.direction.indexOf(CONSTANTS.direction.down) >= 0) {
            dy = this.velocity * (dt / 1000);
        }

        if (this.gameInfo.direction.indexOf(CONSTANTS.direction.left) >= 0) {
            dx = -1 * this.velocity * (dt / 1000);
        } else  if (this.gameInfo.direction.indexOf(CONSTANTS.direction.right) >= 0) {
            dx = this.velocity * (dt / 1000);
        }

        if (this.isOutOfCanvas(dx, dy)) {
            dx = 0;
            dy = 0;
        }

        dx && (this.gameInfo.playerX = this.x += dx);
        dy && (this.gameInfo.playerY = this.y += dy);

        this.weapon.calculateNextStep(dt);
    };

    var shootInterval = null;
    this.shoot = function(isOn) {
        if (!isOn) {
            this.weapon.fire = false;
            shootInterval && shootInterval();
            shootInterval = null;
        } else if (!shootInterval) {
            this.weapon.fire = true;

            var player = this;
            player.weapon.shoot();
            shootInterval = UTILS.setInterval(player.weapon.shoot, this.weapon.fireDelay, player.weapon);
        }
    };

}

Player.prototype = new GameObject();
