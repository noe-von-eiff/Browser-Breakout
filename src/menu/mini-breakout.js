let ball; // Makes the ball variable global so it can be accessed in the pause function

document.addEventListener('DOMContentLoaded', () => {
    // Initial variables
    let isMouseOver = false; // Easter egg activator
    const canvas = document.getElementById("mini-breakout");
    const ctx = canvas.getContext("2d");
    const brickOptions = {
        width: 24,
        height: 8,
        col: 3,
        row: 4,
        verticalPadding: 4,
        horizontalPadding: 5,
    };
    const fullBreakoutWidth = brickOptions.width * brickOptions.row + brickOptions.horizontalPadding * (brickOptions.row - 1);
    const breakoutTopLeftX = (canvas.width - fullBreakoutWidth) / 2;
    const breakoutTopLeftY = 10;
    const initPaddleX = canvas.width / 2 - 20;
    const paddle = {
        width: 40,
        height: 4,
        x: initPaddleX,
        y: canvas.height - 5,
        speed: 0.6,
    };
    const initBallX = canvas.width / 2 - 2.5;
    const initBallY = canvas.height - 10;
    ball = {
        radius: 2.5,
        x: initBallX,
        y: initBallY,
        dx: 0.75,
        dy: -0.75,
    }
    if (Math.random() < 0.5) {
        ball.dx = -ball.dx;
    }
    let bricks = [...Array(brickOptions.col)].map(e => Array(brickOptions.row).fill(1));
    run();

    // Functions
    function run() {
        // Border bounce cases
        if (ball.y - ball.radius < 0) { // Bounce on top border
            ball.dy = -ball.dy;
        }
        if (ball.x + ball.radius > canvas.width) { // Bounce on right border
            ball.dx = -ball.dx;
        }
        if (ball.x - ball.radius < 0) { // Bounce on left border
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.radius > canvas.height) { // Lose
            reset();
        }

        // Paddle bounce case
        const paddleCollision = isCircleRectColliding(ball.x, ball.y, ball.radius, paddle.x, paddle.y, paddle.width, paddle.height);
        if (paddleCollision.colliding && ball.dy > 0) {
            if (paddleCollision.status === 1 || paddleCollision.status === 3) { // Colliding on top face or corners
                ball.dy = -ball.dy;
            } else if (paddleCollision.status === 2) { // Colliding on vertical faces
                ball.dx = -ball.dx;
            }
        }

        // Brick breaking cases
        for (let i = 0; i < brickOptions.row; i++) {
            for (let j = 0; j < brickOptions.col; j++) {
                if (bricks[j][i] == 1) {
                    const thisBrick = { // Brick that needs to be checked for collision
                        x: breakoutTopLeftX + (brickOptions.width + brickOptions.horizontalPadding) * i,
                        y: breakoutTopLeftY + (brickOptions.height + brickOptions.verticalPadding) * j,
                    };
                    const isColliding = isCircleRectColliding(ball.x, ball.y, ball.radius, thisBrick.x, thisBrick.y, brickOptions.width, brickOptions.height);
                    if (isColliding.colliding) {
                        bricks[j][i] = 0;
                        if (isColliding.status === 1 || isColliding.status === 3) { // Colliding on horizontal faces or corners
                            ball.dy = -ball.dy;
                        } else if (isColliding.status === 2) { // Colliding on vertical faces
                            ball.dx = -ball.dx;
                        }
                    }
                }
            }
        }

        // Check if won
        if (bricks.flat().reduce((a, b) => a + b) === 0) {
            reset();
        }

        // Move paddle
        if (!isMouseOver) { // Auto-follow the ball if the easter egg is not activated
            const paddleCenter = paddle.x + paddle.width / 2;
            if (paddleCenter <= ball.x) {
                paddle.x += paddle.speed;
            } else if (paddleCenter > ball.x) {
                paddle.x -= paddle.speed;
            }
        }
        if (paddle.x < 0) {
            paddle.x = 0;
        } else if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        // Redraw and request next frame
        draw();
        requestAnimationFrame(run);
    }

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
        // Draw paddle
        ctx.beginPath();
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
        // Draw bricks
        let currentX = breakoutTopLeftX;
        let currentY = breakoutTopLeftY;
        for (let i = 1; i <= brickOptions.row; i++) {
            for (let j = 1; j <= brickOptions.col; j++) {
                if (bricks[j - 1][i - 1] === 1) {
                    ctx.fillRect(currentX, currentY, brickOptions.width, brickOptions.height);
                }
                currentY = breakoutTopLeftY + (brickOptions.height + brickOptions.verticalPadding) * j; // Change y position by brick height and padding
            }
            currentY = breakoutTopLeftY;
            currentX = breakoutTopLeftX + (brickOptions.width + brickOptions.horizontalPadding) * i; // Change x position by brick width and padding
        }
    }

    function reset() {
        bricks = [...Array(brickOptions.col)].map(e => Array(brickOptions.row).fill(1));
        paddle.x = initPaddleX;
        ball.x = initBallX;
        ball.y = initBallY;
        ball.dx = 0.75;
        if (Math.random() < 0.5) {
            ball.dx = -ball.dx;
        }
        ball.dy = -0.75;
    }
});

function isCircleRectColliding(circleX, circleY, circleR, rectX, rectY, rectW, rectH) {
    // Checks if a circle is colliding with a rectangle and returns where the collision is happening
    // https://stackoverflow.com/a/21096179/11726100
    let distX = Math.abs(circleX - rectX - rectW / 2);
    let distY = Math.abs(circleY - rectY - rectH / 2);

    if (distX > (rectW / 2 + circleR)) {
        return { colliding: false, status: 0 };
    }
    if (distY > (rectH / 2 + circleR)) {
        return { colliding: false, status: 0 };
    }

    if (distX <= (rectW / 2)) {
        return { colliding: true, status: 1 }; // Colliding on horizontal faces (status 1)
    }
    if (distY <= (rectH / 2)) {
        return { colliding: true, status: 2 }; // Colliding on vertical faces (status 2)
    }

    let dx = distX - rectW / 2;
    let dy = distY - rectH / 2;
    if (dx * dx + dy * dy <= (circleR * circleR)) {
        return { colliding: true, status: 3 }; // Colliding on corner (status 3)
    }
    return { colliding: false, status: 0 };
}

export { ball };
