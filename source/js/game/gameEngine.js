function GameEngine(settings) {
    var engine = this,
        fpsCounter = 0, fpsTime = 0,
        canvas = settings.canvas,
        ctx = canvas.getContext('2d'),
        gameInfo = {
            w: settings.width,
            h: settings.height,
            direction: '',
            mouseX: 0,
            mouseY: 0
        };

    canvas.width = gameInfo.w;
    canvas.height = gameInfo.h;
    ctx.font = 'italic 15pt Arial';

    this.lastTimestamp = null;
    this.dt = null;
    this.running = false;
    this.fps = 0;
    this.gameInfo = gameInfo;
    this.player = function addPlayer() {
        var p = new Player(gameInfo);
        p.x = gameInfo.w / 2;
        p.y = gameInfo.h / 2;
        return p;
    }();
    this.gameObjects = [this.player];

    this.shoot = function(isOn) {
        this.player.weapon.fire = !!isOn;

        if (this.running) {
            this.player.shoot(isOn);
        }
    };

    this.start = function() {
        if (this.running) return;

        this.running = true;
        engine.lastTimestamp = 0;
        this.render(0);
    };

    this.stop = function() {
        this.running = false;
        this.hideFPS();
    };

    this.render = function(timestamp) {
        if (!engine.lastTimestamp) engine.lastTimestamp = timestamp;
        engine.dt = timestamp - engine.lastTimestamp;
        engine.lastTimestamp = timestamp;

        ctx.clearRect(0, 0, gameInfo.w, gameInfo.h);
        engine.drawAll();

        if (engine.running) {
            engine.calculateNextStep();
            engine.showFPS();
            requestAnimationFrame(engine.render, canvas);
        }
    };

    this.showFPS = function countFPS() {
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

    this.drawAll = function() {
        this.gameObjects.forEach(function(object) {
            object.draw(ctx);
        });
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
