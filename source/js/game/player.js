function Player(gameInfo) {
    this.gameInfo = gameInfo;
    this.h = this.w = 30;
    this.wide = (this.w + this.h) / 4;
    this.y = gameInfo.h / 2;
    this.x = gameInfo.w / 2;
    this.velocity = UTILS.getSpeed(8.5);
    this.weapon = new BaseWeapon(this.gameInfo, this);
    this.health = 100;

    this.collisionTargets[Enemy.name] = function(target) {
        target.hit(this);
    };
    this.collisionTargets[Medkit.name] = function(target) {
        target.hit(this);
    };

    this.draw = function (ctx) {
        var degreesAngle = (Math.atan2(this.y - this.gameInfo.mouseY, this.gameInfo.mouseX - this.x) * 180 / Math.PI + 360) % 360,
            part = 360/12;

        ctx.drawImage(RES.player.img,
                ((degreesAngle/part) >> 0) * RES.player.spriteSize,
            this.weapon.fire ? RES.player.spriteSize : 0,
            RES.player.spriteSize, RES.player.spriteSize, this.x - this.w/2, this.y - this.h/2, this.w, this.h);

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

        dx && (this.gameInfo.player.x = this.x += dx);
        dy && (this.gameInfo.player.y = this.y += dy);

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

    this.getBullets = function() {
        return [].concat(this.weapon.bullets);
    };

}

Player.prototype = new GameObject();
Player.prototype.fn = Player;
