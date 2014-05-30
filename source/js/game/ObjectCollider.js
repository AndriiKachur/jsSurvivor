function ObjectCollider(gameInfo, gameObjects) {
    this.gameInfo = gameInfo;
    this.gameObjects = gameObjects;

    this.checkCollisions = function(bullets) {
        var objects = gameObjects.concat(bullets);
        for (var i = 0, length = objects.length; i < length; ++i) {
            for (var j = i; j < length; ++j) {
                this.collide(objects[i], objects[j]);
            }
        }
    };

    this.collide = function(obj1, obj2) {
        if (obj1.toRemove || obj1.dead || obj2.toRemove || obj2.dead) return;

        var colFn = null;
        colFn = obj1.collisionFn(obj2);
        colFn && obj1.collide(obj2, colFn);

        colFn = obj2.collisionFn(obj1);
        colFn && obj2.collide(obj1, colFn);
    };

}
