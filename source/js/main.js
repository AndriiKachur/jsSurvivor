window.addEventListener('load', function() {
    var canvas = document.getElementById('mainCanvas'),
        startButton = document.getElementById('startButton'),
        stopButton = document.getElementById('stopButton'),
        gameEngine = new GameEngine({
            canvas: canvas,
            width: 900,
            height: 500
        });

    gameEngine.bindControls();

    startButton.addEventListener('click', function() {
        gameEngine.start();
    });
    stopButton.addEventListener('click', function() {
        gameEngine.stop();
    });

}, false);
