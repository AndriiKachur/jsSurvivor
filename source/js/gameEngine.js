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
    canvas.style.border = '1px solid black';
    ctx.font = 'italic 15pt Arial';

    this.lastTimestamp = null;
    this.dt = null;
    this.running = false;
    this.fps = 0;
    this.gameInfo = gameInfo;
    this.player = function addPlayer() {
        var p = new Player();
        p.x = gameInfo.w / 2;
        p.y = gameInfo.h / 2;
        return p;
    }();
    this.gameObjects = [this.player];

    this.shoot = function(x, y) {
        if (!this.running) return;

        this.player.shoot(x, y);
    };

    this.start = function() {
        if (this.running) return;

        this.running = true;
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

        engine.animateObjects();
        engine.calculateNextStep();
        engine.showFPS();

        if (engine.running) {
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
        requestAnimationFrame(function() {
            ctx.clearRect(0, 0, 150, 150);
        }, canvas);
    };

    this.animateObjects = function() {
        this.gameObjects.forEach(function(object) {
            object.draw(ctx, gameInfo);
        });
    };

    this.calculateNextStep = function() {
        this.gameObjects.forEach(function(object) {
            object.calculateNextStep(engine.dt, gameInfo);
        });
    };
}
