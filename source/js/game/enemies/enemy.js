function Enemy(gameInfo, x, y) {
    this.gameInfo = gameInfo;

    this.h = this.w = 30;
    this.x = x;
    this.y = y;
    this.wide = (this.h + this.w) / 4;
    this.velocity = UTILS.getSpeed(10);
    this.health = 100;
    this.damage = 4;
    this.reloadTime = 1000;
    this.isReloading = false;
    this.score = 1;
    this.spriteSize = RES.enemy.spriteSize;
    this.img = RES.enemy.img;

    this.collisionTargets[Bullet.name] = function(target) {
        this.health -= target.damage;
        this.checkDead();
    };

    !x && !y && UTILS.randomBorderPosition(this, this.gameInfo);

    this.hit = function(player) {
        if (this.isReloading || this.dead) return;

        this.isReloading = true;
        player.health -= this.damage;
        UTILS.setTimeout(function() {
           this.isReloading = false;
        }, this.reloadTime, this);
    };

    this.draw = function(ctx) {
        ctx.drawImage(this.img, 0, 0, this.spriteSize, this.spriteSize,
            this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };

    this.calculateNextStep = function(dt) {
        if (this.checkDead() || this.dead) return;

        var distance = this.velocity * dt / 1000,
            angle = Math.atan2(this.gameInfo.player.y - this.y,
                                this.gameInfo.player.x - this.x),
            dx = Math.cos(angle) * distance,
            dy = Math.sin(angle) * distance;

        dx && (this.x += dx);
        dy && (this.y += dy);
    };

    var deathAnimated = null;
    this.dropLoot = function() {
        if (UTILS.random() <= 0.3) {
            var drop = new Medkit(this.gameInfo, this.x, this.y);
            this.gameInfo.gameObjects.push(drop);
        } else if (UTILS.random() <= 0.6) {
            var drop = new Grenade(this.gameInfo, this.x, this.y);
            this.gameInfo.gameObjects.push(drop);
        };

        var dead = this.getDead();
        gameInfo.gameObjects.push(dead);
        deathAnimated = UTILS.setTimeout(function () {
            dead.toRemove = true;
        }, 5000, this);
    };

    this.getDead = function() {
        var dead = new Enemy(gameInfo, this.x, this.y),
            imgX = UTILS.random() & 1 ? 0 : RES.enemy.spriteSize;
        dead.dead = true;
        dead.draw = function() {
            ctx.drawImage(RES.enemy.dead,
                imgX, 0,
                RES.enemy.spriteSize, RES.enemy.spriteSize,
                this.x - this.w/2, this.y - this.h/2, this.w, this.h);
        };
        return dead;
    };

}

Enemy.prototype = new GameObject();
Enemy.prototype.fn = Enemy;
