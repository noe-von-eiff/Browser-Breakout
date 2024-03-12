function getAbsRect(el) {
    // Returns the BoundingClientRect of el, but with absolute coordinates
    // https://stackoverflow.com/a/46155596/11726100
    const rect = el.getBoundingClientRect();

    // Add window scroll position to get the offset position
    const left = rect.left + window.scrollX;
    const top = rect.top + window.scrollY;
    const right = rect.right + window.scrollX;
    const bottom = rect.bottom + window.scrollY;

    // Polyfill missing 'x' and 'y' rect properties not returned from getBoundingClientRect() by older browsers
    let x;
    if (rect.x === undefined) {
        x = left;
    }
    else {
        x = rect.x + window.scrollX;
    }
    let y;
    if (rect.y === undefined) {
        y = top;
    }
    else {
        y = rect.y + window.scrollY;
    }

    // Width and height are the same
    const width = rect.width;
    const height = rect.height;

    return { left, top, right, bottom, x, y, width, height };
};

function elementIsVisible(el) {
    // Checks if an element is visible on the screen
    // https://stackoverflow.com/a/41698614/11726100
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (
        style.display == 'none' ||
        style.visibility != 'visible' ||
        style.opacity < 0.1 ||
        el.offsetWidth + el.offsetHeight + rect.height + rect.width == 0
    ) {
        return false;
    }
    const elemCenter = {
        x: rect.left + el.offsetWidth / 2,
        y: rect.top + el.offsetHeight / 2
    };
    if (isNaN(elemCenter.x) || isNaN(elemCenter.y)) {
        return false;
    }
    if (elemCenter.x < 0 || elemCenter.y < 0) {
        return false;
    }
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) {
        return false;
    }
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) {
        return false;
    }

    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === el) {
            return true;
        }
    } while (pointContainer = pointContainer.parentNode);
    return false;
}

function randomColorPair() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function isCircleRectColliding(circle, rectangle) {
    // Checks if a circle is colliding with a rectangle and returns where the collision is happening
    // https://stackoverflow.com/a/21096179/11726100
    let distX = Math.abs(circle.x - rectangle.x - rectangle.width / 2);
    let distY = Math.abs(circle.y - rectangle.y - rectangle.height / 2);

    if (distX > (rectangle.width / 2 + circle.radius)) {
        return { colliding: false, status: 0 };
    }
    if (distY > (rectangle.height / 2 + circle.radius)) {
        return { colliding: false, status: 0 };
    }

    if (distX <= (rectangle.width / 2)) {
        return { colliding: true, status: 1 }; // Colliding on horizontal faces (status 1)
    }
    if (distY <= (rectangle.height / 2)) {
        return { colliding: true, status: 2 }; // Colliding on vertical faces (status 2)
    }

    let dx = distX - rectangle.width / 2;
    let dy = distY - rectangle.height / 2;
    if (dx * dx + dy * dy <= (circle.radius * circle.radius)) {
        return { colliding: true, status: 3 }; // Colliding on corner (status 3)
    }
    return { colliding: false, status: 0 };
}

function getAllStorageData() {
    // Returns all data stored in the browsers local storage
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}

function randomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function getDomElementDepth(element) {
    let depth = 0;
    while(element.parentNode) {
        element = element.parentNode;
        depth += 1;
    }
    return depth;
}

function rectangleOverlapsAnyOfRectangleList(rectangle, rectangleList) {
    // Returns true if given rectangle overlaps with any rectangle that's in the given list. False if does not.
    // https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
    for (const rectElement of rectangleList) {
        const rectangleX2 = rectangle.x + rectangle.width;
        const rectangleY2 = rectangle.y + rectangle.height;
        const rectElementX2 = rectElement.x + rectElement.width;
        const rectElementY2 = rectElement.y + rectElement.height;
        if (rectangle.x < rectElementX2 && rectangleX2 > rectElement.x && rectangle.y < rectElementY2 && rectangleY2 > rectElement.y) {
            return true;
        }
    }
    return false;
}
