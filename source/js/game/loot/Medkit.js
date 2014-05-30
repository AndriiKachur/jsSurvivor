function Medkit(gameInfo, x, y) {
    this.w = this.h = 20;
    this.wide = 15;
    this.x = x;
    this.y = y;
    this.ttl = 10000;
    this.health = 17;

    UTILS.setTimeout(function() {
            this.toRemove = true;
    }, this.ttl, this);

    this.gameInfo = gameInfo;

    this.draw = function (ctx) {
        ctx.drawImage(RES.medkit.img, 0, 0,
            RES.medkit.spriteSize, RES.medkit.spriteSize, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    };

    this.hit = function(player) {
        player.health += this.health;
        this.health = 0;
        if (player.health > 100) player.health = 100;
        this.checkDead();
    };

}
Medkit.prototype = new GameObject();
Medkit.prototype.fn = Medkit;
