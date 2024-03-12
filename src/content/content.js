let game = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const isGameRunning = game && game.isRunning;

    switch (msg.key) {
        case 'state':
            sendResponse(isGameRunning);
            break;
        case 'init':
            try {
                if (!isGameRunning) {
                    // Initialize the game
                    game = new Game();
                    game.run();
                } else {
                    // Stop the game
                    game.killGame();
                    game = null;
                }
            } catch (error) {
                console.error('Error initializing game:', error.message);
            }
            break;
        default:
            console.error('Unknown message key:', msg.key);
    }
});
