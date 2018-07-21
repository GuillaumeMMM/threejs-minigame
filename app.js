
const PRELOAD_COUNT = 7;
const REGULAR_GAP = 0.1;

const SQUARE_SIZE = 2;

var scene = new THREE.Scene();
scene.background = new THREE.Color('blue');

var camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry1 = new THREE.BoxGeometry(SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
var material = new THREE.MeshPhongMaterial({ color: 'red', transparent: true, opacity: 1 });

let loadedArrays = [];
let loadedArraysBlocksDetails = [];
let nextLab = 0;
let gameOn = false;

//  Add an array to the scene
addArrayToScene = function (index) {
    const labArray = getRandLabArray2(10, 10, 0.5);
    loadedArrays.push(-20 * index);
    loadedArraysBlocksDetails.push(labArray);
    labArray.forEach((block, ind) => {
        var cube = new THREE.Mesh(geometry1, material);
        cube.position.set((SQUARE_SIZE + REGULAR_GAP) * block.x, (SQUARE_SIZE + REGULAR_GAP) * block.y, -20 * index);
        cube.name = 'id-' + loadedArrays.length + '-' + ind;
        scene.add(cube);
    });
}

addLabAtPosition = function (position) {
    const labArray = getRandLabArray2(10, 10, 0.5);
    loadedArrays.push(-20 * position);
    loadedArraysBlocksDetails.push(labArray);
    labArray.forEach((block, ind) => {
        var cube = new THREE.Mesh(geometry1, material);
        cube.position.set((SQUARE_SIZE + REGULAR_GAP) * block.x, (SQUARE_SIZE + REGULAR_GAP) * block.y, -20 * position);
        cube.name = 'id-' + loadedArrays.length + '-' + ind;
        scene.add(cube);
    });
}

cameraOnASquare = function (index, cameraX, cameraY) {
    let onASquare = false;
    loadedArraysBlocksDetails[index].forEach((block) => {
        if (cameraX > (2 * block.x) && cameraX <= (2 * (block.x + 1)) && cameraY > (2 * block.y) && cameraY <= (2 * (block.y + 1))) {
            onASquare = true;
        }
    });
    return onASquare;
}

removeAllSquares = function (refArray) {
    for (let i = 0; i < refArray.length + 1; i++) {
        let j = 0;
        while (scene.getObjectByName('id-' + i + '-' + j) && j < 100) {
            const selectedObject = scene.getObjectByName('id-' + i + '-' + j);
            scene.remove(selectedObject);
            j++
        }
    }
}
let text;

gameOver = function () {
    var loader = new THREE.FontLoader();

    loader.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {

        var textGeometry = new THREE.TextGeometry('GAME OVER', {
            font: font,
            size: 10,
            height: 3,
            // curveSegments: 12,
            // bevelEnabled: true,
            // bevelThickness: 10,
            // bevelSize: 8,
            // bevelSegments: 5
        });
        var material3 = new THREE.MeshPhongMaterial({
            color: 'yellow'
        });
        text = new THREE.Mesh(textGeometry, material3);
        text.position.set(camera.position.x - 40, camera.position.y, camera.position.z - 30);
        text.name = 'gameover';
        // text.rotation.x = Math.PI/2;
        scene.add(text);
    });
}

//  Spot light
var light = new THREE.PointLight(0xffffff);
light.position.set(0, 12, 15);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff);
light.position.set(0, 12, -15);
scene.add(light2);

let goLeft = false;
let goRight = false;
let goTop = false;
let goDown = false;

document.onclick = function () {
    if (!gameOn) {
        gameInit();
        const selectedObject = scene.getObjectByName('gameover');
        scene.remove(selectedObject);
    }
}

document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            goLeft = true;
            break;
        case 39:
            goRight = true;
            break;
        case 38:
            goTop = true;
            break;
        case 40:
            goDown = true;
            break;
    }
}

document.onkeyup = function (e) {
    switch (e.keyCode) {
        case 37:
            goLeft = false;
            break;
        case 39:
            goRight = false;
            break;
        case 38:
            goTop = false;
            break;
        case 40:
            goDown = false;
            break;
    }
}

gameInit = function () {
    loadedArrays = [];
    loadedArraysBlocksDetails = [];
    nextLab = 0;

    for (let i = 1; i < PRELOAD_COUNT + 1; i++) {
        addArrayToScene(i);
    }

    camera.position.z = 10;
    camera.position.x = 10;
    camera.position.y = 10;

    goLeft = false;
    goRight = false;
    goTop = false;
    goDown = false;

    gameOn = true;
}
gameInit();

function animate() {
    requestAnimationFrame(animate);

    if (gameOn) {
        if (goLeft && camera.position.x > 0.1) {
            camera.position.x -= 0.1;
        }
        if (goRight && camera.position.x < 20 * (1 + REGULAR_GAP)) {
            camera.position.x += 0.1;
        }
        if (goTop && camera.position.y < 20 * (1 + REGULAR_GAP)) {
            camera.position.y += 0.1;
        }
        if (goDown && camera.position.y > 0.1) {
            camera.position.y -= 0.1;
        }

        camera.position.z -= 0.3;
        if (camera.position.z < loadedArrays[nextLab]) {
            if (cameraOnASquare(nextLab, camera.position.x, camera.position.y)) {
                console.log('GAME OVER');
                gameOn = false;
                removeAllSquares(loadedArrays);
                gameOver();
            } else {
                nextLab++;
                addLabAtPosition(nextLab + PRELOAD_COUNT);
            }
        }
    }else {
        text.rotation.x += 0.05;
    }
    renderer.render(scene, camera);
}
animate();