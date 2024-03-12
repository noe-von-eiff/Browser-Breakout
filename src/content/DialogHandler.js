class DialogHandler {
    constructor(yesCallback, noCallback) {
        // Initialize elements
        document.body.insertAdjacentHTML("beforeend", dialogHTML);

        const dialogStyleSheet = document.createElement("style");
        dialogStyleSheet.innerHTML = dialogStyle;
        document.head.appendChild(dialogStyleSheet);

        this.dialog = document.getElementById("browser-breakout-dialog");
        this.dialogText = this.dialog.querySelector("#browser-breakout-dialog-text");
        this.dialogNoBtn = this.dialog.querySelector("#browser-breakout-dialog-no-btn");
        this.dialogYesBtn = this.dialog.querySelector("#browser-breakout-dialog-yes-btn");

        this.dialogNoBtn.addEventListener("click", () => this.dialog.close("no")); // Kill game
        this.dialogYesBtn.addEventListener("click", () => this.dialog.close("yes")); // Do reset
        this.dialog.addEventListener("close", () => {
            if (this.dialog.returnValue === "yes") {
                yesCallback();
            } else {
                noCallback();
            }
        });
    }

    showWin() {
        this.dialogText.innerHTML = "You won! Play again?";
        this.dialog.showModal();
    }

    showLose() {
        this.dialogText.innerHTML = "You lost! Play again?";
        this.dialog.showModal();
    }

    remove() {
        this.dialog.remove();
    }

    isOpen() {
        return this.dialog.open;
    }
}