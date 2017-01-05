window.addEventListener('load', function() {
    var canvas = document.getElementById('mainCanvas'),
        startButton = document.getElementById('startButton'),
        stopButton = document.getElementById('stopButton'),
        gameEngine = new GameEngine({
            canvas: canvas,
            width: screen.availWidth - 220,//870,
            height: screen.availHeight - 100,//500,
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
