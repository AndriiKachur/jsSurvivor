function Player() {

    this.w = 10;
    this.h = 10;
    this.x = 0;
    this.y = 0;
    this.oldW = 10;
    this.oldH = 10;
    this.oldX = 0;
    this.oldY = 0;
    this.velocity = 100;
    this.weapon = new BaseWeapon();

    this.draw = function(ctx, gameInfo) {
        if (this.isMoved()) {
            ctx.clearRect(this.oldX >> 0, this.oldY >> 0, this.oldW + 1, this.oldH + 1);
        }
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this.weapon.draw(ctx, gameInfo);
    };

    this.calculateNextStep = function(dt, gameInfo) {
        var dx = 0, dy = 0;

        if (gameInfo.direction.indexOf(CONSTANTS.up) >= 0) {
            dy = -1 * this.velocity / 1000 * dt;
        } else if (gameInfo.direction.indexOf(CONSTANTS.down) >= 0) {
            dy = this.velocity / 1000 * dt;
        }

        if (gameInfo.direction.indexOf(CONSTANTS.left) >= 0) {
            dx = -1 * this.velocity / 1000 * dt;
        } else  if (gameInfo.direction.indexOf(CONSTANTS.right) >= 0) {
            dx = this.velocity / 1000 * dt;
        }

        if (this.isOutOfCanvas(gameInfo, dx, dy)) {
            dx = 0, dy = 0;
        } else if (dx || dy) {
            this.backupOld();
            this.x += dx;
            this.y += dy;
        }
    };

    this.shoot = function(x, y) {
        this.weapon.shoot(this.x, this.y, x, y);
    };

    this.isOutOfCanvas = function(gameInfo, dx, dy) {
        return  (this.x + this.w + dx > gameInfo.w) || (this.x + dx < 0 ) || (this.y + this.h + dy > gameInfo.h) || (this.y + dy < 0);
    };

}

Player.prototype = new GameObject();
