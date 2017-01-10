window.addEventListener('load', NewGame, false);
window.addEventListener('orientationchange', function () {
    location.reload();
});

function NewGame() {
    var infoDiv = document.querySelector('.infoDiv'),
        isPhablet = getComputedStyle(infoDiv).display === 'none',
        canvas = document.getElementById('mainCanvas'),
        startButton = document.getElementById('startButton'),
        stopButton = document.getElementById('stopButton'),
        gameEngine = new GameEngine({
            canvas: canvas,
            width: window.innerWidth - (isPhablet ? 0 : 150),
            height: window.innerHeight,
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

}
