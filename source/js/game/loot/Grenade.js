function Grenade(gameInfo, x, y) {
    this.w = this.h = 30;
    this.wide = 15;
    this.x = x;
    this.y = y;
    this.ttl = 10000;
    this.health = 1;
    this.damage = 1000;
    this.gameInfo = gameInfo;

    UTILS.setTimeout(function() {
            this.toRemove = true;
    }, this.ttl, this);

    this.gameInfo = gameInfo;

    this.collisionTargets[Player.name] = function(target) {
        this.health = 0;
        this.destroyEnemies();
        this.checkDead();
    };

    this.draw = function (ctx) {
        ctx.drawImage(RES.grenade.img, 0, 0,
            RES.grenade.spriteSize, RES.grenade.spriteSize, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    };

    this.destroyEnemies = function() {
        gameInfo.gameObjects.forEach(function(obj) {
            if (obj.fn === Enemy && obj.health > 0 && !obj.dead) {
                obj.health = 0;
                obj.checkDead();
            }
        });
    };

}
Grenade.prototype = new GameObject();
Grenade.prototype.fn = Grenade;
