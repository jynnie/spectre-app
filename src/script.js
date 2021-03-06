// electron window
const win = require('electron').remote.getCurrentWindow();

// electron unique id, also socket room id
let uid = "";

// socket connections
const socket = io.connect(SERVER_URL);

const html = document.getElementsByTagName('html')[0];
const clickThru = document.getElementById('clickThroughElement');
const mainRect = document.getElementById('main');

const settingsModal = document.getElementById('settings');
const darknessSlider = document.getElementById('darknessSlider');
const darknessNumber = document.getElementById('darknessNumber');
const circleSlider = document.getElementById('circleSlider');
const circleNumber = document.getElementById('circleNumber');
const lightSlider = document.getElementById('lightnessSlider');
const lightNumber = document.getElementById('lightnessNumber');
const roomCodeOption = document.getElementById('roomCodeOption');

let lastKeys = [];
let cheating = false;
 
/**
 * creates a new spotlight circle in the holes mask with the id
 * @param {string} id of related socket
 */
const createCircle = (id) => {
    const xmlns = "http://www.w3.org/2000/svg";
    const holes = document.getElementById("holes");
    const circle = document.createElementNS(xmlns, "circle");
    circle.setAttributeNS(null, 'id', id);
    circle.setAttributeNS(null, 'fill', 'none');
    circle.setAttributeNS(null, 'filter', 'url(#blur)');
    holes.appendChild(circle);
};

/**
 * turns circle for id on or off
 * @param {string} id of circle
 * @param {boolean} on 
 */
const setCircle = (id, on) => {
    let circle = document.getElementById(id);
    console.log(circle);
    if (on) {
        circle.setAttribute('fill', 'rgba(0,0,0,var(--calpha))');
    } else {
        circle.setAttribute('fill', 'none');
    }
};

/**
 * moves a users circle to the mouse location
 * @param {Object[x, y]} el
 * @param {string} id of circle
 */
const moveCircle = (el, id) => {
    let x = el.x.toString();
    let y = (el.y - 20).toString();
    let circle = document.getElementById(id);
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
};

/**
 * takes a relative position and converts to absolute position for screen
 * @param {Object[number, number]} relPos 
 * @return {Object[number, number]} of absolute position
 */
const getAbsPos = relPos => {
    let boundingRect = mainRect.getBoundingClientRect();
    let absY = relPos.y * boundingRect.height + boundingRect.top;
    let absX = relPos.x * boundingRect.width + boundingRect.left;
    console.log(absX, absY);
    return {x: absX, y: absY};
};

// open settings model on esc keydown
const switchMode = (el) => {
    if (el.keyCode == 27) {
        settingsModal.classList.toggle("open");
    }

    // turn on cheat mode when "666" is typed
    lastKeys.push(el.key);
    if (lastKeys.length > 3) {
        lastKeys.shift();
    }
    if (lastKeys.toString() == "6,6,6") {
        lastKeys = [];
        if (cheating) {
            cheating = false;
            document.querySelector("#user0001").setAttribute('fill', 'none');
        } else {
            cheating = true;
            document.querySelector("#user0001").setAttribute('fill', 'rgba(0,0,0,var(--calpha))');
        }
    }
};

// ensures darkness slider and text input are synced and adjusts setting
const syncDarknessSettings = (which) => {
    let x;
    if (which == "slider") {
        x = darknessSlider.value;
        darknessNumber.value = x;
    } else {
        x = darknessNumber.value;
        darknessSlider.value = x;
    }
    adjustDarkness(x);
};

const adjustDarkness = (x) => {
    html.style.setProperty("--alpha", `${x/100}`);
};

// ensures circle slider and text input are synced and adjusts setting
const syncCircleSettings = (which) => {
    let x;
    if (which == "slider") {
        x = circleSlider.value;
        circleNumber.value = x;
    } else {
        x = circleNumber.value;
        circleSlider.value = x;
    }
    adjustCircle(x);
};

const adjustCircle = (x) => {
    html.style.setProperty("--radius", x);
};

// ensures circle alpha slider and text input are synced and adjusts setting
const syncLightnessSettings = (which) => {
    let x;
    if (which == "slider") {
        x = lightSlider.value;
        lightNumber.value = x;
    } else {
        x = lightNumber.value;
        lightSlider.value = x;
    }
    adjustLightness(x);
};

const adjustLightness = (x) => {
    html.style.setProperty("--calpha", `${x/100}`);
};

// enters specific room based on code
const enterRoom = () => {
    if (roomCodeOption.value.length == 4) {
        uid = roomCodeOption.value;
        socket.emit("screen join", uid);
        document.getElementById("roomCode").innerText = uid;
    } else {
        roomCodeOption.value = "";
        roomCodeOption.placeholder = "code must be 4 characters";
    }
};

// sets up click through spaces
clickThru.addEventListener('mouseenter', () => {
    win.setIgnoreMouseEvents(true, { forward: true });
});
clickThru.addEventListener('mouseleave', () => {
    win.setIgnoreMouseEvents(false);
});

// initial testing of circle following mouse
document.addEventListener("mousemove", el => { 
    if (cheating) {moveCircle(el, 'user0001');}
});

// open settings
document.addEventListener("keydown", switchMode);

// get request to tell server that you exist and get unique id
get(SERVER_URL + '/screen', {}).then(id => {
    uid = id.screenid;
    document.getElementById("roomCode").innerText = uid;
    roomCodeOption.value = uid;

    // send to server socket info
    socket.emit("screen register", uid);
});

/**
 * on new user connection, we generate them a spotlight
 * in the SVG
 * @param {string} id of user socket
 */
socket.on("new user", id => {
    console.log(`New user has joined`);
    createCircle(id);
});

/**
 * update circle with id to new relative position
 * @param {string} id of user and circle
 * @param {Object[number, number]} relPos of point
 */
socket.on("point update", (id, relPos) => {
    console.log(`New point for ${id} at (${relPos.x}, ${relPos.y})`);
    setCircle(id, true);
    moveCircle(getAbsPos(relPos), id);
});

// turns circle off on pointer up
socket.on("point off", (id) => {
    setCircle(id, false);
});
