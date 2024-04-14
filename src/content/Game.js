class Game {
    constructor() {
        this.isRunning = false;
        this.isBallAirborn = false;
        this.isGameKilled = false;

        this.RX = window.innerWidth + window.scrollX;  // Absolute right x coordinate of the window
        this.BY = window.innerHeight + window.scrollY; // Absolute bottom y coordinate of the window
        this.LX = window.scrollX;                      // Absolute left x coordinate of the window
        this.TY = window.scrollY;                      // Absolute top y coords of the window

        this.W = this.RX - this.LX; // True width of window
        this.H = this.BY - this.TY; // True height of window

        this.canvas = document.createElement("canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.RX;
        this.canvas.height = this.BY;
        this.canvas.style = "position:absolute;top:0;left:0;z-index:2147483647;";
        document.documentElement .style.cssText += "overflow:hidden !important;";
        document.documentElement .appendChild(this.canvas);

        this.paddle = new Paddle();
        this.paddle.init(this.W, this.H, this.RX, this.BY);
        this.ball = new Ball();
        this.ball.init(this.paddle.width, this.paddle.x, this.paddle.y);
        this.inputHandler = new InputHandler();
        this.explosionHandler = new ExplosionHandler(this.ctx);
        this.dialogHandler = new DialogHandler(
            () => { // If yes is pressed
                this.resetLevel();
                this.inputHandler.enable(true); // Re-enable key input after closing dialog
            },
            () => { // If no is pressed
                this.killGame();
            }
        );
        this.bricks = this.createBricks();
        this.lastTime = 0;

        // Load settings
        getAllStorageData().then((data) => {
            this.maxLives = data.livesAmount || defaultLivesAmount;  // Saved amount or default
            this.ball.color = data.ballColor || defaultBallColor;
            this.paddle.color = data.paddleColor || defaultPaddleColor;
            if (this.maxLives == 21) {
                this.hasInfiniteLives = true;
            }
            this.curLives = this.maxLives;
        });

        // Initialize input variables
        this.inputHandler.enable(true);

        // Resize handler
        window.addEventListener("resize", this.handleResize.bind(this));
    }

    run() {
        if (this.isGameKilled) {
            return;
        }
        if (this.isBallAirborn) {
            // Update frame
            this.update();
        } else {
            // Initial ball launch
            if (this.inputHandler.right()) {
                // Launch right
                this.ball.dx = ballIniDxDy;
                this.ball.dy = -ballIniDxDy;
                this.isBallAirborn = true;
            } else if (this.inputHandler.left()) {
                // Launch left
                this.ball.dx = -ballIniDxDy;
                this.ball.dy = -ballIniDxDy;
                this.isBallAirborn = true;
            }
            this.isRunning = true;
            this.lastTime = Date.now();
        }
        // Redraw and request next frame
        this.draw();
        requestAnimationFrame(this.run.bind(this));
    }

    killGame() {
        // Reset critical variables
        this.isGameKilled = true;
        this.isRunning = false;
        this.isBallAirborn = false;

        for (let brick of this.bricks) {
            brick.domElement.style.visibility = "visible";
        }

        document.body.style.cssText -= "overflow:hidden !important;";
        this.canvas.remove();

        // Remove dialog
        this.dialogHandler.remove();

        // Remove event listeners
        this.inputHandler.kill();
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        // Don't do anything if dialog is open
        if (this.dialogHandler.isOpen()) {
            return;
        }

        // Compute new coordinates and brick layout
        this.RX = window.innerWidth + window.scrollX;
        this.BY = window.innerHeight + window.scrollY;
        this.LX = window.scrollX;
        this.TY = window.scrollY;
        this.W = this.RX - this.LX;
        this.H = this.BY - this.TY;
        this.canvas.width = this.RX;
        this.canvas.height = this.BY;

        // Compute new sizes
        this.paddle.init(this.W, this.H, this.RX, this.BY);
        this.ball.init(this.paddle.width, this.paddle.x, this.paddle.y);
        this.resetLevel();
    }

    createBricks() {
        this.canvas.style.pointerEvents = 'none';

        // Get all elements that are viable candidates for bricks
        const bodyElements = Array.from(document.body.querySelectorAll('*')).filter(x => !ignoreDialogIds.includes(x.id));
        const brickCandidates = bodyElements
            .map(element => {
                const bcRect = getAbsRect(element);
                const isViableBrick =
                    bcRect.y + bcRect.height + this.paddle.height + this.ball.radius * 2 + minDistPaddleBrick < this.BY &&
                    bcRect.y > this.TY &&
                    bcRect.width > minBrickWidth && bcRect.height > minBrickHeight &&
                    elementIsVisible(element);

                return isViableBrick ? { ...bcRect, colors: randomColorPair(), domElement: element, elementDepth: getDomElementDepth(element), isDestroyed: false } : null;
            })
            .filter(Boolean); // Cool trick to get rid of nulls!

        // Get bricks where they are most on the same depth
        const candidatesByDepth = {};
        brickCandidates.forEach(candidate => {
            candidatesByDepth[candidate.elementDepth] = [...(candidatesByDepth[candidate.elementDepth] || []), candidate];
        });
        const longestArrayIndex = Object.keys(candidatesByDepth).reduce((a, b) => candidatesByDepth[a].length > candidatesByDepth[b].length ? a : b);
        const returnedBricks = candidatesByDepth[longestArrayIndex];

        // Find more bricks, but that don't overlap with any current brick
        const deepestCandidatesFirst = Object.values(candidatesByDepth).flat().reverse();
        deepestCandidatesFirst.forEach(brick => {
            if (!returnedBricks.includes(brick) && !rectangleOverlapsAnyOfRectangleList(brick, returnedBricks)) {
                returnedBricks.push(brick);
            }
        });

        if (!returnedBricks.length) {
            this.killGame();
            window.alert("Can't build a level from this POV!");
        }

        this.canvas.style.pointerEvents = 'auto'; // reset pointer-events afterwards
        return returnedBricks;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bricks
        for (let i = 0; i < this.bricks.length; i++) {
            const currentBrick = this.bricks[i];
            if (!currentBrick.isDestroyed) {
                this.ctx.strokeStyle = currentBrick.colors[0];
                this.ctx.fillStyle = currentBrick.colors[1];

                this.ctx.globalAlpha = 0.3;
                this.ctx.fillRect(currentBrick.x, currentBrick.y, currentBrick.width, currentBrick.height);
                this.ctx.globalAlpha = 1;

                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(currentBrick.x, currentBrick.y, currentBrick.width, currentBrick.height);
            }
        }

        // Draw brick explosion
        this.explosionHandler.draw();

        // Draw paddle
        this.ctx.beginPath();
        this.ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height, [10]);
        this.ctx.fillStyle = this.paddle.color;
        this.ctx.fill();
        this.ctx.closePath();

        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.ball.color;
        this.ctx.fill();
        this.ctx.closePath();

        // Lives counter
        if (!this.hasInfiniteLives) {
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = this.ball.color;
            this.ctx.fillText(`Lives: ${this.curLives}`, this.LX + 5, this.BY - 5);
        }
    }

    update() {
        //// Handle game time
        const now = Date.now();
        const dt = now - this.lastTime;
        this.lastTime = now;

        //// Ball states
        const ballMoveUp = this.ball.dy < 0; // Ball is moving up
        const ballMoveDown = this.ball.dy > 0; // Ball is moving down
        const ballMoveLeft = this.ball.dx < 0; // Ball is moving left
        const ballMoveRight = this.ball.dx > 0; // Ball is moving right

        //// Hit wall
        // Hit top wall
        if (this.ball.y - this.ball.radius < this.TY && ballMoveUp) {
            this.ball.dy = -this.ball.dy;
        }
        // Hit right wall
        if (this.ball.x + this.ball.radius > this.RX && ballMoveRight) {
            this.ball.dx = -this.ball.dx;
        }
        // Hit left wall
        if (this.ball.x - this.ball.radius < this.LX && ballMoveLeft) {
            this.ball.dx = -this.ball.dx;
        }

        //// Paddle movement
        const previousPaddleX = this.paddle.x;
        if (this.inputHandler.left() && !this.inputHandler.right()) {
            this.paddle.x -= this.paddle.speed * dt; // Multiply speed with dt, for paddle speed to be independant of fps
        } else if (this.inputHandler.right() && !this.inputHandler.left()) {
            this.paddle.x += this.paddle.speed * dt;
        }
        if (this.paddle.x < this.LX) {
            this.paddle.x = this.LX;
        } else if (this.paddle.x + this.paddle.width > this.RX) {
            this.paddle.x = this.RX - this.paddle.width;
        }

        //// Hit paddle
        const paddleCollision = isCircleRectColliding(this.ball, this.paddle);
        if (paddleCollision.colliding && ballMoveDown) {
            // Collision side
            const paddleSidePercent = 0.2; // 20% of paddle width counts as one side
            const hitLeft = this.ball.x <= (this.paddle.x + this.paddle.width * paddleSidePercent);
            const hitRight = this.ball.x >= (this.paddle.x + this.paddle.width * (1 - paddleSidePercent));
            const hitCenter = !hitLeft && !hitRight;

            // Paddle movement
            const paddleMoveRight = this.paddle.x > previousPaddleX;
            const paddleMoveLeft = this.paddle.x < previousPaddleX;

            if (hitCenter) {
                this.ball.changeBallAngle(ballMoveRight ? 45 : 135);
            } else {
                this.ball.changeBallAngle(ballMoveRight ? 30 : 150);
            }

            this.ball.dy = -this.ball.dy;
            // Allow the player to send the ball back
            if ((paddleMoveRight && hitRight && ballMoveLeft) || (paddleMoveLeft && hitLeft && ballMoveRight)) {
                this.ball.dx = -this.ball.dx;
            }

            // Add speed multiplier to dx and dy on each paddle collision
            this.ball.dx *= speedMultiplier;
            this.ball.dy *= speedMultiplier;
        }

        //// Hit brick
        for (let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i];
            if (brick.isDestroyed) {
                continue;
            }
            const brickCollision = isCircleRectColliding(this.ball, brick);

            if (brickCollision.colliding) {
                if (brickCollision.status === 1) { // Colliding on horizontal faces
                    this.ball.dy = -this.ball.dy;
                } else if (brickCollision.status === 2) { // Colliding on vertical faces
                    this.ball.dx = -this.ball.dx;
                } else if (brickCollision.status === 3) { // Colliding on corners
                    // These checks make sure the ball behaves as expected when hitting a birck corner
                    const hitTopCorners = this.ball.y < brick.y + brick.height / 2;
                    const hitBottomCorners = this.ball.y > brick.y + brick.height / 2;
                    const hitRightCorners = this.ball.x > brick.x + brick.width / 2;
                    const hitLeftCorners = this.ball.x < brick.x + brick.width / 2;

                    if (hitBottomCorners && hitRightCorners) {
                        // Bottom-right corner was hit, ball should go down and right
                        this.ball.dy = Math.abs(this.ball.dy);
                        this.ball.dx = Math.abs(this.ball.dx);
                    } else if (hitBottomCorners && hitLeftCorners) {
                        // Bottom-left corner was hit, ball should go down and left
                        this.ball.dy = Math.abs(this.ball.dy);
                        this.ball.dx = -Math.abs(this.ball.dx);
                    } else if (hitTopCorners && hitRightCorners) {
                        // Top-right corner was hit, ball should go up and right
                        this.ball.dy = -Math.abs(this.ball.dy);
                        this.ball.dx = Math.abs(this.ball.dx);
                    } else if (hitTopCorners && hitLeftCorners) {
                        // Top-left corner was hit, ball should go up and left
                        this.ball.dy = -Math.abs(this.ball.dy);
                        this.ball.dx = -Math.abs(this.ball.dx);
                    }
                }

                // Remove brick from array and create explosion particles
                brick.domElement.style.visibility = "hidden";
                brick.isDestroyed = true;
                this.explosionHandler.explode(100, brick);
                break;
            }
        }

        //// Check win
        if (this.bricks.every((brick) => brick.isDestroyed)) {
            this.inputHandler.enable(false); // Disable input while dialog is open
            this.dialogHandler.showWin();
            this.resetPlayer();
        }

        //// Check lose
        if (this.ball.y + this.ball.radius > this.BY) {
            this.curLives -= 1;
            if (this.curLives < 1 && !this.hasInfiniteLives) {
                this.inputHandler.enable(false);
                this.dialogHandler.showLose();
            }
            this.resetPlayer();
        } else {
            //// Ball movement
            this.ball.x += this.ball.dx * dt; // Multiply speed with dt, for balls speed to be independant of fps
            this.ball.y += this.ball.dy * dt;
        }
    }

    resetPlayer() {
        //// Resets the ball and paddle positions but not the level
        this.paddle.reset();
        this.ball.reset();
        this.inputHandler.reset();
        this.isBallAirborn = false;
    }

    resetLevel() {
        //// Resets the player, bricks and lives for a new level
        this.resetPlayer();

        for (let brick of this.bricks) {
            brick.domElement.style.visibility = "visible";
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bricks = this.createBricks();

        this.curLives = this.maxLives;
    }
}