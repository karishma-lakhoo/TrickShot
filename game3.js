import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

import { playJumpSound,playTargetHitSound, playLevelCompleteSound,playBackgroundMusic,stopBackgroundMusic, playWind, stopWind} from './audio';
import { scene,camera,renderer,onWindowResize, minicamera, minimapRenderer } from './gamelogic';
import  {updateTimerDisplay } from './timer';
import { createSpheres,spheresCollisions } from './sphere';
import { loadMap } from './map';
import { createRedTarget ,changeGreenTarget} from './targets';
import {teleportPlayerIfOob,getForwardVector, getSideVector,playerSphereCollision} from './player';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OctreeHelper} from "three/addons/helpers/OctreeHelper";

const container = document.getElementById( 'game-container' );
const nextLevelButton = document.getElementById('next-level-btn');
const endScreenHeading = document.getElementById("endScreen-Heading");
const crosshair = document.getElementById('crosshair');
const innerCircle = document.getElementById('circle-inner');
const outerCircle = document.getElementById('circle-outer');
const levelFinishScreen = document.getElementById('level-finish');
const restartButton = document.getElementById('restart-btn');
const exitButton = document.getElementById('exit-btn');
const resumeButton = document.getElementById('resume-btn');
let pauseElement = document.getElementById('pause-box');
pauseElement.style.display = 'none';


playBackgroundMusic();
playWind();


const clock = new THREE.Clock();
let initialTime = 50; // Change the time here
let remainingTime = initialTime; // Remaining time is initially the same as the initial time
updateTimerDisplay(remainingTime); // Display the initial time

const timerInterval = setInterval(updateTimer, 1000); // Update every second

function updateTimer() {

    if (remainingTime === initialTime) {
        document.body.requestPointerLock();
        let overlay = document.getElementById('loadingOverlay'); // THE LOADING SCREEN IS REMOVED WHEN THE TIMER STARTS
        overlay.style.display = 'none'; // THE LOADING SCREEN IS REMOVED WHEN THE TIMER STARTS
    }
    if (!paused){
        remainingTime--;

        updateTimerDisplay(remainingTime);
    }
    // Display the updated time

    if (remainingTime <= 0) {
        showLevelFinishScreen();
    }

}

let glbMap = 'map2Finalglass.glb'; //Change Map here
const worldOctree = new Octree();
loadMap(glbMap,scene,worldOctree,animate);

let targetsLeft = 10; //Change number of targets here
let target1, target2, target3, target4, target5, target6, target7, target8, target9, target10; //Update based on targets

/**
 * Update here as well based on targets
 */
const targetOctree = new Octree();
const targetOctree1 = new Octree();
const targetOctree2 = new Octree();
const targetOctree3 = new Octree();
const targetOctree4 = new Octree();
const targetOctree5 = new Octree();
const targetOctree6 = new Octree();
const targetOctree7 = new Octree();
const targetOctree8 = new Octree();
const targetOctree9 = new Octree();
const targetOctree10 = new Octree();

/**
 * Update here as well based on targets
 */
createRedTarget(scene,-3.02, 4.65, 12.94, 0, Math.PI/2, 0, 1, 1, 1, targetOctree1)
    .then((loadedTarget) => {
        target1 = loadedTarget;
    })
    .catch((error) => {
    });

createRedTarget(scene,5.4, 4.65, 12.94, 0, Math.PI/2, 0, 1, 1, 1, targetOctree2)
    .then((loadedTarget) => {
        target2 = loadedTarget;
    })
    .catch((error) => {
    });
createRedTarget(scene,-17.18, -0.085, 8.22, 0, Math.PI/2, 0, 1, 1, 1, targetOctree3)
    .then((loadedTarget) => {
        target3 = loadedTarget;
    })
    .catch((error) => {
    });
createRedTarget(scene,0.1502, -0.55, 4.28, 0, Math.PI/2, 0, 1, 1, 1, targetOctree4)
    .then((loadedTarget) => {
        target4 = loadedTarget;
    })
    .catch((error) => {
    });

createRedTarget(scene,-8.55, -0.93, 12.69, 0, Math.PI/2, 0, 0.75, 0.75, 0.75, targetOctree5)
    .then((loadedTarget) => {
        target5 = loadedTarget;
    })
    .catch((error) => {
    });
createRedTarget(scene,-6, 2.8, -12.9, 0, 0, 0, 1, 1, 1, targetOctree6)
    .then((loadedTarget) => {
        target6 = loadedTarget;
    })
    .catch((error) => {
    });
createRedTarget(scene,2.1, -1.8, -29.68, 0, 0, Math.PI/2, 1, 1, 1, targetOctree7)
    .then((loadedTarget) => {
        target7 = loadedTarget;
    })
    .catch((error) => {
    });

createRedTarget(scene,2.1, 1.074,-18.76, 0, Math.PI/2, 0, 1.5, 1.5, 1.5, targetOctree8)
    .then((loadedTarget) => {
        target8 = loadedTarget;
    })
    .catch((error) => {
    });

createRedTarget(scene,-11.5, 3.1677, -12.38, 0, 0, 0, 1, 1, 1, targetOctree9)
    .then((loadedTarget) => {
        target9 = loadedTarget;
    })
    .catch((error) => {
    });

createRedTarget(scene,-14.931,  3.1677, -15.95, 0, Math.PI/2, 0, 1, 1, 1, targetOctree10)
    .then((loadedTarget) => {
        target10 = loadedTarget;
    })
    .catch((error) => {
    });


const NUM_SPHERES = 25; //Change number of spheres here
let ballsLeft = 25; //Update based on number of spheres
const spheres = [];
let sphereIdx = 0;
createSpheres(scene, NUM_SPHERES, spheres );


const playerCollider = new Capsule( new THREE.Vector3( -16, 3, -40 ), new THREE.Vector3( -16, 4, -40 ), 0.35 );
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
let playerOnFloor = false;
let allowPlayerMovement = true;
let paused = false;
let levelCompleted = false;
const keyStates = {};
let storedMouseSpeed = localStorage.getItem('MouseSpeed');
let mouseTime = 0;
let count = 0

document.addEventListener( 'keydown', ( event ) => {

    keyStates[ event.code ] = true;

} );

document.addEventListener( 'keyup', ( event ) => {

    keyStates[ event.code ] = false;

} );

container.addEventListener( 'mousedown', () => {
    if (!allowPlayerMovement) {
        return; // If player movement is not allowed, exit the function
    }

    document.body.requestPointerLock();

    mouseTime = performance.now();

} );

document.addEventListener( 'mouseup', () => {
    if (!allowPlayerMovement) {
        return;
    }

    if ( document.pointerLockElement !== null ) throwBall();

} );

document.body.addEventListener( 'mousemove', ( event ) => {

    if (!allowPlayerMovement) {
        return;
    }

    if (document.pointerLockElement === document.body) {
        // Limit how far down the camera can look (adjust the values as needed)
        camera.rotation.x -= event.movementY / storedMouseSpeed; //mouse speed default is 500
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
        camera.rotation.y -= event.movementX / storedMouseSpeed; //mouse speed default is 500

        // Minimap camera rotation
        minicamera.rotation.z -= event.movementX / storedMouseSpeed;
    }

} );

function controls( deltaTime ) {

    if (!allowPlayerMovement) {
        return;
    }

    const speedDelta = deltaTime * ( playerOnFloor ? 25 : 4 );

    if ( keyStates[ 'KeyW' ] ) {

        playerVelocity.add( getForwardVector(camera,playerDirection).multiplyScalar( speedDelta ) );

    }

    if ( keyStates[ 'KeyS' ] ) {

        playerVelocity.add( getForwardVector(camera,playerDirection).multiplyScalar( - speedDelta ) );

    }

    if ( keyStates[ 'KeyA' ] ) {

        playerVelocity.add( getSideVector(camera,playerDirection).multiplyScalar( - speedDelta ) );

    }

    if ( keyStates[ 'KeyD' ] ) {

        playerVelocity.add( getSideVector(camera,playerDirection).multiplyScalar( speedDelta ) );

    }
    if ( keyStates[ 'KeyP' ] ) {
        showPauseScreen();
    }

    if ( playerOnFloor ) {

        if ( keyStates[ 'Space' ] ) {
            playJumpSound();
            playerVelocity.y = 5;
        }

    }

}

function showLevelFinishScreen() {

    let hudContainer = document.getElementById('hud-container');
    hudContainer.style.width = '20px'; // Adjust the width as needed

    let hudElements = document.querySelectorAll('#balls-left, #targets-left');
    hudElements.forEach(element => {
        element.style.opacity = '0'; // Adjust the opacity as needed
    });

    const expandingCircle = document.getElementById("expanding-circle");
    setTimeout(() => {
        expandingCircle.classList.add("expand");
    }, 1000);

    if (levelCompleted){
        playLevelCompleteSound();
    }
    stopBackgroundMusic();
    stopWind();
    levelFinishScreen.style.display = 'block';
    setTimeout(() => {
        levelFinishScreen.style.opacity = '1';
    }, 1000);
    allowPlayerMovement = false;
    document.exitPointerLock();

    clearInterval(timerInterval);

    if (remainingTime <= 0 || ballsLeft ===0) {
        nextLevelButton.style.display = 'none';
        resumeButton.style.display = 'none';
        endScreenHeading.textContent = 'You Lost';
        crosshair.style.display = 'none';
        innerCircle.style.display = 'none';
        outerCircle.style.display = 'none';

    }
    else {
        endScreenHeading.textContent = 'Level 3 Complete';
        nextLevelButton.style.display = 'none';
        resumeButton.style.display = 'none';
        crosshair.style.display = 'none';
        innerCircle.style.display = 'none';
        outerCircle.style.display = 'none';
    }
}

function showPauseScreen() {
    stopBackgroundMusic();
    stopWind();
    levelFinishScreen.style.display = 'block';
    levelFinishScreen.style.opacity = '1';
    pauseElement.style.display = 'block';
    allowPlayerMovement = false;
    document.exitPointerLock();
    paused = true;

    nextLevelButton.style.display = 'none';
    endScreenHeading.textContent = 'Game Paused';
    crosshair.style.display = 'none';
    innerCircle.style.display = 'none';
    outerCircle.style.display = 'none';
}


function hideLevelFinishScreen() {
    pauseElement.style.display = 'none';
    levelFinishScreen.style.opacity = '0';
    crosshair.style.display = 'block';
    innerCircle.style.display = 'block';
    outerCircle.style.display = 'block';
    levelFinishScreen.style.display = 'none';
    allowPlayerMovement = true;
    document.body.requestPointerLock();
    playBackgroundMusic();
    playWind();
    paused = false;

}



document.addEventListener('DOMContentLoaded', () => {

    restartButton.addEventListener('click', () => {
        window.location.href = 'game3.html';
    });

    nextLevelButton.addEventListener('click', () => {
        window.location.href = 'game3.html';
    });

    exitButton.addEventListener('click', () => {
        window.location.href = 'menu.html';
    });

    resumeButton.addEventListener('click', () => {
        hideLevelFinishScreen();
    });

});

function throwBall() {

    if (ballsLeft > 0) {
        const sphere = spheres[sphereIdx];

        camera.getWorldDirection(playerDirection);


        sphere.collider.center.copy(playerCollider.end).addScaledVector(playerDirection, playerCollider.radius * 1.5);

        // throw the ball with more force if we hold the button longer, and if we move forward
        const impulse = 15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.001));

        sphere.velocity.copy(playerDirection).multiplyScalar(impulse);
        sphere.velocity.addScaledVector(playerVelocity, 2);

        sphereIdx = (sphereIdx + 1) % spheres.length;

        ballsLeft--;
        document.getElementById('balls-left').innerText = `Balls: ${ballsLeft}`;
    }
    if (ballsLeft === 0) {
        showLevelFinishScreen();
    }

}

function playerCollisions() {

    const result = worldOctree.capsuleIntersect( playerCollider );
    const resultTarget = targetOctree.capsuleIntersect( playerCollider );

    playerOnFloor = false;

    if ( result ) {

        playerOnFloor = result.normal.y > 0;

        if ( ! playerOnFloor ) {

            playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );

        }

        playerCollider.translate( result.normal.multiplyScalar( result.depth ) );

    }

    if ( resultTarget ) {

        playerOnFloor = resultTarget.normal.y > 0;

        if ( ! playerOnFloor ) {

            playerVelocity.addScaledVector( resultTarget.normal, - resultTarget.normal.dot( playerVelocity ) );

        }

        playerCollider.translate( resultTarget.normal.multiplyScalar( resultTarget.depth ) );

    }

}

function updatePlayer( deltaTime ) {

    let damping = Math.exp( - 4 * deltaTime ) - 1;

    if ( ! playerOnFloor ) {

        playerVelocity.y -= 9.8 * deltaTime;

        damping *= 0.1;

    }

    playerVelocity.addScaledVector( playerVelocity, damping );

    const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
    playerCollider.translate( deltaPosition );

    playerCollisions();

    camera.position.copy( playerCollider.end );//MOVING CAMERA MAINSCREEN

    minicamera.position.copy( playerCollider.end );//MOVING PLAYER ON MINIMAP

}

/**
 * Update this function as well based on targets
 */
function updateSpheres( deltaTime ) {
    const windForce = new THREE.Vector3(0.05, 0, 0);
    spheres.forEach( sphere => {

        sphere.collider.center.addScaledVector( sphere.velocity, deltaTime );
        sphere.velocity.add(windForce);
        const result = worldOctree.sphereIntersect( sphere.collider );
        const resultTarget1 = targetOctree1.sphereIntersect( sphere.collider );
        const resultTarget2 = targetOctree2.sphereIntersect( sphere.collider );
        const resultTarget3 = targetOctree3.sphereIntersect( sphere.collider );
        const resultTarget4 = targetOctree4.sphereIntersect( sphere.collider );
        const resultTarget5 = targetOctree5.sphereIntersect( sphere.collider );
        const resultTarget6 = targetOctree6.sphereIntersect( sphere.collider );
        const resultTarget7 = targetOctree7.sphereIntersect( sphere.collider );
        const resultTarget8 = targetOctree8.sphereIntersect( sphere.collider );
        const resultTarget9 = targetOctree9.sphereIntersect( sphere.collider );
        const resultTarget10 = targetOctree10.sphereIntersect( sphere.collider );

        const resultTargets = [
            resultTarget1, resultTarget2, resultTarget3, resultTarget4, resultTarget5,
            resultTarget6, resultTarget7, resultTarget8, resultTarget9, resultTarget10
        ];

        const Targets = [
            target1, target2, target3, target4, target5,
            target6, target7, target8, target9, target10
        ];

        for (let i = 0; i < 10; i++) {
            const currentResult = resultTargets[i];
            const currentTarget = Targets[i];

            if (currentResult) {
                if (currentTarget.modelChanged === false) {
                    playTargetHitSound();
                    count++;
                    targetsLeft--;
                    document.getElementById('targets-left').innerText = `Targets: ${targetsLeft}`;
                    currentTarget.modelChanged = true;
                    if (!levelCompleted && targetsLeft === 0) {
                        levelCompleted = true;
                        showLevelFinishScreen();
                    }
                }

                changeGreenTarget(scene,targetOctree, currentTarget);
                sphere.velocity.addScaledVector(currentResult.normal, -currentResult.normal.dot(sphere.velocity) * 1.5);
                sphere.collider.center.add(currentResult.normal.multiplyScalar(currentResult.depth));
            }
        }

        if ( result ) {

            sphere.velocity.addScaledVector(result.normal, -result.normal.dot(sphere.velocity) * 1.5);
            sphere.collider.center.add(result.normal.multiplyScalar(result.depth));
        }

        else{
            sphere.velocity.y -= 9.8 * deltaTime;
        }

        const damping = Math.exp( - 1.5 * deltaTime ) - 1;
        sphere.velocity.addScaledVector( sphere.velocity, damping );

        playerSphereCollision( sphere,playerCollider,playerVelocity );

    } );

    spheresCollisions(spheres);
    for ( const sphere of spheres ) {

        sphere.mesh.position.copy( sphere.collider.center );

    }

}

const geometry = new THREE.BoxGeometry();
const video = document.getElementById('video');
video.pause();
const texture = new THREE.VideoTexture(video);
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.x = -7.3;
cube.position.z = -8;
cube.position.y = -0.5;
cube.scale.x = 20
cube.scale.y = 4

const playRadiusX = 10;  // X-axis extent of the rectangular region
const playRadiusY = 1;  // Y-axis extent of the rectangular region
const playRadiusZ = 8;  // Z-axis extent of the rectangular region


function animate() {

    const deltaTime = Math.min(0.05, clock.getDelta()) / 5;

    // Add a delay of 5 seconds (5000 milliseconds)
    setTimeout(function () {
        console.log("h");
        const distanceX = Math.abs(camera.position.x - cube.position.x);
        const distanceY = Math.abs(camera.position.y - cube.position.y);
        const distanceZ = Math.abs(camera.position.z - cube.position.z);

        if (distanceX < playRadiusX && distanceY < playRadiusY && distanceZ < playRadiusZ) {
            // Play the video
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                texture.needsUpdate = true;
                video.play();
            }
        } else {
            // Pause the video
            video.pause();
        }
    }, 3000); // 5000 milliseconds = 5 seconds

    if(!paused){
        for ( let i = 0; i < 5; i ++ ) {
            controls( deltaTime );
            updatePlayer( deltaTime );
            updateSpheres( deltaTime );
            teleportPlayerIfOob(camera,playerCollider,playerDirection);

        }
    }

    // if (document.getElementById('video').readyState === document.getElementById('video').HAVE_ENOUGH_DATA) {
    //     material.map.needsUpdate = true;
    // }

    renderer.render( scene, camera );
    minimapRenderer.render(scene, minicamera)
    onWindowResize();
    requestAnimationFrame( animate );
}