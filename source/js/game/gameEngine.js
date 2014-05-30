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
