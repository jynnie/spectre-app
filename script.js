// electron window
const win = require('electron').remote.getCurrentWindow()

// electron unique id, also socket room id
let uid = "";

// socket connections
const URL = "http://33fb9d1d.ngrok.io"; // server url
const socket = io.connect(URL);

const clickThru = document.getElementById('clickThroughElement')
const mainRect = document.getElementById('main');

/**
 * creates a new spotlight circle in the holes mask with the id
 * @param {string} id of related socket
 */
const createCircle = (id) => {
    const xmlns = "http://www.w3.org/2000/svg";
    const holes = document.getElementById("holes");
    const circle = document.createElementNS(xmlns, "circle");
    circle.setAttributeNS(null, 'id', id);
    // circle.setAttributeNS(null, 'cx', 0);
    // circle.setAttributeNS(null, 'cy', 0);
    circle.setAttributeNS(null, 'filter', 'url(#blur)');
    holes.appendChild(circle);
}

/**
 * turns circle for id on or off
 * @param {string} id of circle
 * @param {boolean} on 
 */
const setCircle = (id, on) => {
    let circle = document.getElementById(id);
    console.log(circle);
    if (on) {
        circle.setAttribute('fill', 'black');
    } else {
        circle.setAttribute('fill', 'white');
    }
}

/**
 * moves a users circle to the mouse location
 * @param {Object[x, y]} el
 * @param {string} id of circle
 */
const moveCircle = (el, id) => {
    let x = el.x.toString()
    let y = (el.y - 20).toString()
    let circle = document.getElementById(id)
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
}

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
}

// switches between coloration modes
const switchMode = (el) => {
    if (el.key == 1) { // necessary
    mainRect.className.baseVal = "necessary"
    } else if (el.key == 2) { // beneficial
    mainRect.className.baseVal = "beneficial"
    }
}

// sets up click through spaces
clickThru.addEventListener('mouseenter', () => {
    win.setIgnoreMouseEvents(true, { forward: true })
})
clickThru.addEventListener('mouseleave', () => {
    win.setIgnoreMouseEvents(false)
})

// initial testing of circle following mouse
// document.addEventListener("mousemove", el => {moveCircle(el, 'user0001')})

// switching between modes by keypress
document.addEventListener("keypress", switchMode)

// get request to tell server that you exist and get unique id
get(URL + '/screen', {}).then(id => {
    uid = id.screenid;
    document.getElementById("roomCode").innerText = uid;

    // send to server socket info
    socket.emit("screen register", uid);
})

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
    console.log(`New point for ${id}`);
    setCircle(id, true);
    moveCircle(getAbsPos(relPos), id);
});

// turns circle off on pointer up
socket.on("point off", (id) => {
    setCircle(id, false);
})
