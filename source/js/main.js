window.addEventListener('load', function() {
    var canvas = document.getElementById('mainCanvas'),
        startButton = document.getElementById('startButton'),
        stopButton = document.getElementById('stopButton'),
        gameEngine = new GameEngine({
            canvas: canvas,
            width: 900,
            height: 500
        }),
        canvasOffset = UTILS.findOffset(canvas),
        canvasScale = 1;

    startButton.addEventListener('click', function() {
        gameEngine.start();
    });
    stopButton.addEventListener('click', function() {
        gameEngine.stop();
    });


    document.onmousedown = function(event) {
        gameEngine.shoot(event.pageX, event.pageY);
        return false;
    };
    document.onmouseup = function() {
        gameEngine.shoot();
    };
    document.onmousemove = function (event) {
        gameEngine.gameInfo.mouseX = (event.pageX - canvasOffset.left) / canvasScale;
        gameEngine.gameInfo.mouseY = (event.pageY - canvasOffset.top) / canvasScale;
    };
    window.onkeydown = function (event) {
        switch (event.keyCode) {
            case 38:
            case 87:
                if (gameEngine.gameInfo.direction.indexOf(CONSTANTS.up) >= 0) {
                    return;
                }
                gameEngine.gameInfo.direction += CONSTANTS.up;
                break;
            case 37:
            case 65:
                if (gameEngine.gameInfo.direction.indexOf(CONSTANTS.left) >= 0) {
                    return;
                }
                gameEngine.gameInfo.direction += CONSTANTS.left;
                break;
            case 39:
            case 68:
                if (gameEngine.gameInfo.direction.indexOf(CONSTANTS.right) >= 0) {
                    return;
                }
                gameEngine.gameInfo.direction += CONSTANTS.right;
                break;
            case 40:
            case 83:
                if (gameEngine.gameInfo.direction.indexOf(CONSTANTS.down) >= 0) {
                    return;
                }
                gameEngine.gameInfo.direction += CONSTANTS.down;
                break;
            case 32:
                if (gameEngine.running) {
                    gameEngine.stop();
                } else {
                    gameEngine.start();
                }
        }
    };
    window.onkeyup = function (event) {
        switch (event.keyCode) {
            case 38:
            case 87:
                gameEngine.gameInfo.direction = gameEngine.gameInfo.direction.replace(CONSTANTS.up, '');
                break;
            case 37:
            case 65:
                gameEngine.gameInfo.direction = gameEngine.gameInfo.direction.replace(CONSTANTS.left, '');
                break;
            case 39:
            case 68:
                gameEngine.gameInfo.direction = gameEngine.gameInfo.direction.replace(CONSTANTS.right, '');
                break;
            case 40:
            case 83:
                gameEngine.gameInfo.direction = gameEngine.gameInfo.direction.replace(CONSTANTS.down, '');
                break;
        }
    };

}, false);
