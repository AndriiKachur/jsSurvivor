/*! jsSurvivor - v0.1.0 - 2014-07-06
* https://github.com/Nilanno/jsSurvivor
* Copyright (c) 2014 Nilanno;*/
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

function Enemy(gameInfo, x, y) {
    this.gameInfo = gameInfo;

    this.h = this.w = 30;
    this.x = x;
    this.y = y;
    this.wide = (this.h + this.w) / 4;
    this.velocity = 70;
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

function GameEngine(settings) {
    var engine = this,
        fpsCounter = 0, fpsTime = 0,
        canvas = settings.canvas,
        ctx = canvas.getContext('2d'),
        gameInfo = {
            w: settings.width,
            h: settings.height,
            score: 0,
            direction: '',
            mouseX: 0,
            mouseY: 0,
            player: null,
            gameObjects: null,
            showCollisions: false
        };

    window.ctx = ctx;

    this.reset = function() {
        gameInfo.w = settings.width;
        gameInfo.h = settings.height;
        gameInfo.score = 0;
        gameInfo.direction = '';
        gameInfo.mouseX = 0;
        gameInfo.mouseY = 0;

        canvas.width = gameInfo.w;
        canvas.height = gameInfo.h;
        ctx.font = 'italic 15pt Arial';

        this.lastTimestamp = null;
        this.dt = null;
        this.running = false;
        this.fps = 0;
        this.gameInfo = gameInfo;
        gameInfo.player = this.player = new Player(gameInfo);
        gameInfo.gameObjects = this.gameObjects = [this.player];

        UTILS.inverseArray(gameInfo.gameObjects); // for drawing order

        this.objectCollider = new ObjectCollider(this.gameInfo, this.gameObjects);
        this.end = '';
    };

    this.reset();

    this.shoot = function(isOn) {
        this.player.weapon.fire = !!isOn;

        if (this.running) {
            this.player.shoot(isOn);
        }
    };

    this.start = function() {
        if (this.running) return;
        if (this.end) this.reset();
        this.startGenerateEnemies();
        this.running = true;
        engine.lastTimestamp = 0;
        this.render(0);
    };

    this.stop = function() {
        this.running = false;
        this.stopGenerateEnemies();
        this.hideFPS();
    };

    var monstersGenerator = null;
    this.startGenerateEnemies = function() {
        monstersGenerator = UTILS.setInterval(function() {
            engine.gameObjects.push(new Enemy(gameInfo));
        }, 410);
    };
    this.stopGenerateEnemies = function() {
        monstersGenerator && monstersGenerator();
    };

    this.render = function(timestamp) {
        if (!engine.lastTimestamp) engine.lastTimestamp = timestamp;
        engine.dt = timestamp - engine.lastTimestamp;
        engine.lastTimestamp = timestamp;

        if (engine.end) {
            ctx.fillText(engine.end, engine.gameInfo.w / 2, engine.gameInfo.h / 2);
        } else {
            engine.drawAll();
        }

        if (engine.running) {
            engine.objectCollider.checkCollisions(engine.player.getBullets());
            engine.calculateNextStep();
            engine.showFPS();
            engine.showScore();
            engine.showHealth();
            requestAnimationFrame(engine.render, canvas);
        }
    };

    this.showFPS = function() {
        if (fpsTime > 1000) {
            this.fps = fpsCounter;
            fpsCounter = 0;
            fpsTime = 0;
        }
        ++fpsCounter;
        fpsTime += this.dt;
        ctx.fillText('FPS:' + this.fps, 10, 20);
    };

    this.hideFPS = function() {
        fpsTime = 0;
        fpsCounter = 0;
    };

    this.showScore = function () {
        ctx.fillText('Score:' + this.gameInfo.score, this.gameInfo.w - 150, 20);
    };
    this.showHealth = function () {
        var hp = this.player.health;
        if (hp <= 0) {
            hp = 0;
            this.end = 'DEFEAT';
            this.stop();
        }
        ctx.fillText('HP:' + hp, this.gameInfo.w - 150, 45);
    };

    this.drawAll = function() {
        ctx.clearRect(0, 0, gameInfo.w, gameInfo.h);
        ctx.drawImage(RES.background.img, 0, 0);

        this.gameObjects.forEach(function(object) {
            object.draw(ctx);
            gameInfo.showCollisions && UTILS.showCollision(ctx, object);
        });

        this.showMouse();
    };

    this.showMouse = function() {
        ctx.drawImage(RES.crosshair.img,
                this.player.weapon.crosshair * RES.crosshair.spriteSize, 0,
                RES.crosshair.spriteSize, RES.crosshair.spriteSize,
                gameInfo.mouseX - this.player.weapon.crosshairSize, gameInfo.mouseY - this.player.weapon.crosshairSize,
                this.player.weapon.crosshairSize, this.player.weapon.crosshairSize);
    };

    this.calculateNextStep = function() {
        UTILS.calculateArrayNextStep(this.gameObjects, engine.dt, engine.gameInfo);
    };

    this.bindControls = function() {
        canvas.onmousedown = function() {
            engine.shoot(true);
            return false;
        };
        canvas.onmouseup = function() {
            engine.shoot();
        };
        document.onmousemove = function (event) {
            gameInfo.mouseX = event.pageX;
            gameInfo.mouseY = event.pageY;
        };
        window.onkeydown = function (event) {
            var key = CONSTANTS.keys[event.keyCode];
            if (CONSTANTS.direction[key] && gameInfo.direction.indexOf(key) < 0) {
                gameInfo.direction += key;
            } else if (key === CONSTANTS.space) {
                event.preventDefault();
                if (engine.running) {
                    engine.stop();
                } else {
                    engine.start();
                }
                settings.toggleGameControls && settings.toggleGameControls(engine.running);
            }
        };
        window.onkeyup = function (event) {
            var key = CONSTANTS.keys[event.keyCode];
            if (CONSTANTS.direction[key] && gameInfo.direction.indexOf(key) >= 0) {
                gameInfo.direction = gameInfo.direction.replace(key, '');
            }
        };
    };

}

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

function Player(gameInfo) {
    this.gameInfo = gameInfo;
    this.h = this.w = 30;
    this.wide = (this.w + this.h) / 4;
    this.y = gameInfo.h / 2;
    this.x = gameInfo.w / 2;
    this.velocity = 100;
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

var RES = {
    player: {
        img: document.getElementById('playerSprites'),
        spriteSize: 30
    },
    medkit: {
        img: document.getElementById('medkitSprite'),
        spriteSize: 182
    },
    grenade: {
        img: document.getElementById('grenadeSprite'),
        spriteSize: 230
    },
    crosshair: {
        img: document.getElementById('crosshairSprites'),
        spriteSize: 81
    },
    enemy: {
        img: document.getElementById('enemySprite'),
        spriteSize: 190,
        dead: document.getElementById('deadEnemySprite')
    },
    background: {
        img: document.getElementById('backgroundSprite'),
        spriteSize: 0,
        w: 2048,
        h: 1536
    }
};

var CONSTANTS = {
    direction: {
        up: 'up',
        down: 'down',
        right: 'right',
        left: 'left'
    },
    space: 'space'
};

CONSTANTS.keys = {
    38: CONSTANTS.direction.up,
    87: CONSTANTS.direction.up,
    40: CONSTANTS.direction.down,
    83: CONSTANTS.direction.down,
    37: CONSTANTS.direction.left,
    65: CONSTANTS.direction.left,
    39: CONSTANTS.direction.right,
    68: CONSTANTS.direction.right,
    32: CONSTANTS.space
};

var UTILS = {
    calculateArrayNextStep: function(array, dt, gameInfo) {
        if (!array) return;

        for (var i = array.length - 1; i >= 0; i--) {
            array[i].calculateNextStep(dt);
            if (array[i].toRemove) array.splice(i, 1);
        }
    },

    hypot: function(x1, y1, x2, y2) {
        return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5)
    },

    random: function(max) {
        !max && (max = 10);
        return Math.random() * max;
    },

    randomBorderPosition: function(object, gameInfo) {
        if (UTILS.random() & 1) {
            object.x = UTILS.random() & 1 ? 0 : gameInfo.w;
            object.y = UTILS.random(gameInfo.h);
        } else {
            object.y = UTILS.random() & 1 ? 0 : gameInfo.h;
            object.x = UTILS.random(gameInfo.w);
        }
    },

    setInterval: function(fn, delay, context) {
        var func = context ? function(){ fn.call(context);} : fn;
        var handler = setInterval(func, delay);
        return function() {
            clearInterval(handler);
        }
    },

    setTimeout: function(fn, delay, context) {
        var func = context ? function(){ fn.call(context);} : fn;
        var handler = setTimeout(func, delay);
        return function() {
            clearTimeout(handler);
        }
    },

    showCollision: function(ctx, obj) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.arc(obj.x, obj.y, obj.wide, 0, 360, false);
        ctx.stroke();

        ctx.restore();
    },

    inverseArray: function(arr) {
        arr.push = function() {
            Array.prototype.unshift.apply(this, arguments);
        };
        arr.unshift = function() {
            Array.prototype.push.apply(this, arguments);
        };
    }
};

function BaseWeapon(gameInfo, player) {
    this.gameInfo = gameInfo;
    this.player = player;
    this.bullets = [];
    this.fire = false;
    this.fireDelay = 300;
    this.crosshair = 0;
    this.crosshairSize = 25;

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

function Bullet(gameInfo, x, y) {
    this.gameInfo = gameInfo;
    this.x = x;
    this.y = y;
    this.toX = this.gameInfo.mouseX;
    this.toY = this.gameInfo.mouseY;
    this.velocity = 400;
    this.damage = 100;
    this.wide = this.h = this.w = 2;
    this.angle = Math.atan2(this.toY - this.y, this.toX - this.x);

    this.collisionTargets[Enemy.name] = function(target) {
        this.health = 0;
        this.checkDead();
    };

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 360, false);
        ctx.fill();
    };

    this.calculateNextStep = function(dt) {
        if (this.checkDead()) return;

        var distance = this.velocity * dt / 1000,
            dx = Math.cos(this.angle) * distance,
            dy = Math.sin(this.angle) * distance;

        dx && (this.x += dx);
        dy && (this.y += dy);

        if (this.isOutOfCanvas(dx, dy)) {
            this.toRemove = true;
        }
    };

}

Bullet.prototype = new GameObject();
Bullet.prototype.fn = Bullet;

window.addEventListener('load', function() {
    var canvas = document.getElementById('mainCanvas'),
        startButton = document.getElementById('startButton'),
        stopButton = document.getElementById('stopButton'),
        gameEngine = new GameEngine({
            canvas: canvas,
            width: 900,
            height: 500,
            toggleGameControls: toggleButtons
        });

    function toggleButtons(isPlaying){
        startButton.disabled = isPlaying;
        stopButton.disabled = !isPlaying;
    }

    gameEngine.bindControls();

    startButton.addEventListener('click', function() {
        gameEngine.start();
        toggleButtons(true);
    });
    stopButton.addEventListener('click', function() {
        gameEngine.stop();
        toggleButtons(false);
    });

    window.scrollTo(0, 0);

}, false);
