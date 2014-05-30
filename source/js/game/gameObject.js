function GameObject(gameInfo) {
    this.gameInfo = gameInfo;
    this.toRemove = false;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.collisionTargets = {};

    this.draw = function(ctx) {

    };

    this.calculateNextStep = function(dt) {

    };

    this.isOutOfCanvas = function(dx, dy) {
        return  (this.x + this.w / 2 + dx > this.gameInfo.w) || (this.x - this.w / 2 + dx < 0 )
            || (this.y + this.h / 2 + dy > this.gameInfo.h) || (this.y - this.h / 2 + dy < 0);
    };

    this.collide = function(target, collisionFn) {
        collisionFn.call(this, target);
    };

    this.collisionFn = function(target) {
        if (target.fn.name in this.collisionTargets) {
            return this.inCollisionRange(target) && this.collisionTargets[target.fn.name];
        } else {
            return null;
        }
    };

    this.inCollisionRange = function(target) {
        var distance = UTILS.hypot(this.x, this.y, target.x, target.y);
        return target.wide + this.wide >= distance;
    };

    this.checkDead = function() {
        if (this.health <= 0) {
            this.dead = 0;
            if (this.score > 0) {
                this.gameInfo.score += this.score;
                this.score = 0;
                this.dropLoot();
            }
            return this.toRemove = true;
        }
        return this.toRemove;
    };

    this.dropLoot = function() {

    };


}

GameObject.prototype.fn = GameObject;
