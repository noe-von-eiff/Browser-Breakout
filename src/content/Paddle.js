class Paddle {
    constructor() {
        this.color = defaultPaddleColor;
        this.initialX;
        this.initialY;
        this.width;
        this.height;
        this.x;
        this.y;
        this.speed = paddleIniSpeed; // Paddle speed in px per millisecond
    }

    init(screenWidth, screenHeight, RX, BY) {
        // Initialize paddle values using screen dimensions and coordinates
        this.width = screenWidth / 8;
        this.height = Math.min(screenHeight / 30, maxPaddleHeight);
        this.initialX = RX - screenWidth / 2 - this.width / 2;
        this.initialY = BY - this.height - 5;
        this.x = this.initialX;
        this.y = this.initialY;
    }

    reset() {
        // Reset the paddles position
        this.x = this.initialX;
        this.y = this.initialY;
    }
}
