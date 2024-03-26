class Ball {
    constructor() {
        this.color = defaultBallColor;
        this.initialX;
        this.initialY;
        this.radius;
        this.x;
        this.y;
        this.dx;
        this.dy;
    }

    init(paddleWidth, paddleX, paddleY) {
        // Initialize ball values using screen and paddle dimensions and coordinates
        this.radius = Math.min(paddleWidth / 10, maxBallRadius);
        this.initialX = paddleX + paddleWidth / 2;
        this.initialY = paddleY - this.radius - 3;
        this.x = this.initialX;
        this.y = this.initialY;
        this.dx = 0;
        this.dy = 0;
    }

    reset() {
        // Reset the balls position
        this.x = this.initialX;
        this.y = this.initialY;
    }

    changeBallAngle(degree) {
        //// Change ball direction to a given degree. Input will normaly be 30°, 45°, 135° or 150°
        this.dx = Math.cos(degree * Math.PI / 180) * Math.sqrt(this.dx ** 2 + this.dy ** 2);
        this.dy = Math.sin(degree * Math.PI / 180) * Math.sqrt(this.dx ** 2 + this.dy ** 2);
    }
}
