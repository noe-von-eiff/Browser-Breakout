// Colors for bricks
const colors = [
    ['#1abc9c', '#16a085'],
    ['#2ecc71', '#27ae60'],
    ['#3498db', '#2980b9'],
    ['#9b59b6', '#8e44ad'],
    ['#f1c40f', '#f39c12'],
    ['#e67e22', '#d35400'],
    ['#e74c3c', '#c0392b'],
];

// Default values
const defaultBallColor = '#FF0000';
const defaultPaddleColor = '#000000';
const defaultLivesAmount = 3;

// Game constants
const maxPaddleHeight = 30;
const paddleIniSpeed = 0.5;
const maxBallRadius = 16;
const ballIniDxDy = 0.2;

const speedMultiplier = 1.05;

const minDistPaddleBrick = 100;
const minBrickWidth = 12;
const minBrickHeight = 12;

// Dialog
const ignoreDialogIds = [
    "browser-breakout-dialog",
    "browser-breakout-dialog-text",
    "browser-breakout-button-wrapper",
    "browser-breakout-dialog-no-btn",
    "browser-breakout-dialog-yes-btn"
];

const dialogHTML = `
<dialog id="browser-breakout-dialog">
    <p id="browser-breakout-dialog-text"></p>
    <div id="browser-breakout-button-wrapper">
        <button id="browser-breakout-dialog-no-btn">
            No
        </button>
        <button id="browser-breakout-dialog-yes-btn">
            Yes
        </button>
    </div>
</dialog>
`;

const dialogStyle = `
#browser-breakout-dialog {
    background-color: #fffbfb;
    border: 1px solid #000;
    justify-items: center;
    color: black;
    font: 16px sans-serif;
    padding: 16px;
}

#browser-breakout-dialog-text {
    margin: 16px 0;
}

#browser-breakout-dialog-no-btn, #browser-breakout-dialog-yes-btn {
    width: 100px;
    height: 30px;
    border: 1px solid #000;
    background-color: #fff;
    cursor: pointer;
    color: black;
}

#browser-breakout-dialog-no-btn:hover, #browser-breakout-dialog-yes-btn:hover {
    background-color: #eee;
}
`;
