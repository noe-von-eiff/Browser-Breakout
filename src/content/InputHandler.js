class InputHandler {
    constructor() {
        this.pressingLeft = false;
        this.pressingRight = false;

        // Bind event handler functions to the current instance
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    enableKeyInput(enable) {
        if (enable) {
            document.addEventListener("keydown", this.handleKeyDown, true);
            document.addEventListener("keyup", this.handleKeyUp, true);
        } else {
            document.removeEventListener("keydown", this.handleKeyDown);
            document.removeEventListener("keyup", this.handleKeyUp);
        }
    }
    
    handleKeyDown(event) {
        if (event.key === "ArrowLeft" || event.key === "a") {
            this.pressingLeft = true;
            // Prevent potential key events from being sent to the website (eg: moving paddle on youtube could move the video forward)
            event.stopImmediatePropagation();
        }
        if (event.key === "ArrowRight" || event.key === "d") {
            this.pressingRight = true;
            event.stopImmediatePropagation();
        }
    }
    
    handleKeyUp(event) {
        if (event.key === "ArrowLeft" || event.key === "a") {
            this.pressingLeft = false;
            event.stopImmediatePropagation();
        }
        if (event.key === "ArrowRight" || event.key === "d") {
            this.pressingRight = false;
            event.stopImmediatePropagation();
        }
    }

    left() {
        return this.pressingLeft;
    }
    
    right() {
        return this.pressingRight;
    }

    reset() {
        this.pressingLeft = false;
        this.pressingRight = false;
    }
}
