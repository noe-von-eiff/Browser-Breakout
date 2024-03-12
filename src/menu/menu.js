import { ball } from "./mini-breakout.js";

document.addEventListener('DOMContentLoaded', () => {
    // Get needed dom elements
    const playElement = document.getElementById('play');
    const livesRangeElement = document.getElementById('lives-range');
    const livesTextElement = document.getElementById('lives-value');

    // Check if game is running and change button text appropriately
    chrome.tabs.query(
        { currentWindow: true, active: true },
        (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { key: 'state' },
                (isRunning) => {
                    if (isRunning) {
                        playElement.innerHTML = "STOP";
                    } else {
                        playElement.innerHTML = "PLAY";
                    }
                });
        }
    );

    // Set stored or default values
    const defaultPicker = {
        theme: 'nano',
        lockOpacity: false,
        components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
                hex: false,
                rgba: false,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: false,
            },
        },
    };

    const ballColorPickr = Pickr.create({
        el: '#ball-color',
        ...defaultPicker
    });
    ballColorPickr.on("init", () => {
        chrome.storage.local.get(null, (data) => {
            ballColorPickr.setColor(data.ballColor || "#FF0000");
        });
    });

    const paddleColorPickr = Pickr.create({
        el: '#paddle-color',
        ...defaultPicker
    });
    paddleColorPickr.on("init", () => {
        chrome.storage.local.get(null, (data) => {
            paddleColorPickr.setColor(data.paddleColor || "#000000");
        });
    });

    chrome.storage.local.get(null, (data) => {
        livesRangeElement.value = data.livesAmount || 3;
        if (livesRangeElement.value == 21) {
            livesTextElement.innerHTML = "unlimited";
        } else {
            livesTextElement.innerHTML = livesRangeElement.value;
        }
    });

    // Init game
    playElement.addEventListener('click', () => {
        // Send start game msg and close popup
        chrome.tabs.query(
            { currentWindow: true, active: true },
            (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { key: 'init' });
            });
        window.close();
    });

    // Change lives amount
    livesRangeElement.addEventListener('input', () => {
        // Set new lives amount in the storage
        chrome.storage.local.set({ livesAmount: livesRangeElement.value });
        // Update the lives amount in display
        if (livesRangeElement.value == 21) {
            livesTextElement.innerHTML = "unlimited";
        } else {
            livesTextElement.innerHTML = livesRangeElement.value;
        }
    });

    // Change ball color
    ballColorPickr.on('change', (color) => {
        ballColorPickr.setColor(color.toHEXA().toString());
        chrome.storage.local.set({ ballColor: color.toHEXA().toString() });
    });

    // Change paddle color
    paddleColorPickr.on('change', (color) => {
        paddleColorPickr.setColor(color.toHEXA().toString());
        chrome.storage.local.set({ paddleColor: color.toHEXA().toString() });
    });

    // Navigation
    const settingsButton = document.getElementById("settings-button");
    const backButton = document.getElementById("back-button");
    const menu = document.getElementById("menu");
    const settings = document.getElementById("settings");
    settings.style.display = "none"; // Hide the settings screen at the start
    let oldBallDx; // Used to store the ball's dx when the game is paused
    let oldBallDy;

    function toggleMenuButton() {
        if (settings.style.display === "none") {
            oldBallDx = ball.dx;
            oldBallDy = ball.dy;
            ball.dx = 0;
            ball.dy = 0;
            menu.style.display = "none";
            settings.style.display = "flex";
        } else if (menu.style.display === "none") {
            settings.style.display = "none";
            menu.style.display = "grid";
            ball.dx = oldBallDx;
            ball.dy = oldBallDy;
        }
    }

    settingsButton.addEventListener("click", toggleMenuButton);
    backButton.addEventListener("click", toggleMenuButton);

    // Contribute link
    const contribute = document.getElementById("contribute");
    contribute.addEventListener("click", () => {
        chrome.tabs.create({ url: 'https://github.com/noe-von-eiff/Browser-Breakout' });
    });
});
