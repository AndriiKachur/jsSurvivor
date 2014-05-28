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

}, false);
