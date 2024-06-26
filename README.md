# Browser-Breakout
A browser extension that transforms any website into a Breakout game!

Contributions are highly valued - whether it's a fix for a pesky bug, an innovative idea, or anything else you think could enhance this project. Don't hesitate to make a Pull Request!

## Acknowledgment
Browser Breakout incorporates the color picker from [Pickr Version 1.8.2](https://github.com/simonwep/pickr), utilized in the settings feature. The color picker is licensed under the MIT License. You can find the details of the MIT License for Pickr [here](https://github.com/simonwep/pickr/blob/master/LICENSE).

## Download Links
- [Chrome download](https://chromewebstore.google.com/detail/browser-breakout/oefbdmhkfnipjlgkemmcfhdijpdmjcmp)
- [Firefox download](https://addons.mozilla.org/addon/browser-breakout/)

## Build
To build the extension means to minify the available code and to put everything needed for the upload in a zip-file.

To build the extension, just run `npm run build`.

The finished Zips can then be found under the "build" directory.

## ToDos
- [X] I'd like to rework the way the initial ball and paddle speed are calculated, as I don't think that the current logic is fair to all users (different screen sizes etc.).
- [ ] [On this website](https://www.feed-the-beast.com/modpacks/99-ftb-inferno?tab=mods), scroll to the very bottom of the page and start the game. The game will be very laggy for some reason. Tested on Chrome. It would be interesting to know why this is happening.
- [ ] The extension doesn't work on a few websites. One example is the Chrome Web Store itself (only on Chrome - works on Firefox). When pressing "Play", simply nothing happens, which can be quite confusing for the user. I'd like to add a warning message or dialog or snackbar or whatever to inform the user that the extension doesn't work on the specific website they are on.
