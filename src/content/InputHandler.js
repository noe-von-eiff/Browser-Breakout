class InputHandler {
    constructor() {
        this.pressingLeft = false;
        this.pressingRight = false;
        this.isEnabled = false;

        const handleKeyTemplate = (event, isPress) => {
            if (!this.isEnabled) {
                return;
            }
            if (event.key === "ArrowLeft" || event.key === "a") {
                this.pressingLeft = isPress;
                // Prevent potential key events from being sent to the website (eg: moving paddle on youtube could move the video forward)
                event.stopImmediatePropagation();
            }
            if (event.key === "ArrowRight" || event.key === "d") {
                this.pressingRight = isPress;
                event.stopImmediatePropagation();
            }
        }

        this.handleKeyDown = (event) => handleKeyTemplate(event, true);
        this.handleKeyUp = (event) => handleKeyTemplate(event, false);

        document.addEventListener("keydown", this.handleKeyDown, true);
        document.addEventListener("keyup", this.handleKeyUp, true);
    }

    enable(enabled) {
        this.isEnabled = enabled;
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

    kill() {
        document.removeEventListener("keydown", this.handleKeyDown, true);
        document.removeEventListener("keyup", this.handleKeyUp, true);
    }
}
