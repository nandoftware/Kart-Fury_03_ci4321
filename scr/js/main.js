import * as THREE from "three";

import { 
    carritoRosa,
    carroGenerico,
    carroGenerico2,
    UpdateCars
} from "./carritorosa";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { 
    UpdateCamra,
} from "./camaras";

import {
    updatePlayer,
    updateVehiclePosition,
    updateWheelRotation,
    CheckcollisionsLimits 
} from './mecánicas';

import { plane, BorderView, animateWater, B, B2 } from "./pista";

import { crearAmbiente, animarSol } from "./ambiente";

import { 
    Checkcollisions,
} from "./colisiones";

import { 
    AddAllBoxes,
    PowerUpAnimation,
} from "./powerUps";

import { UpdateItems } from "./Items";

import { AddAllStars, StarAnimation } from './powerUps.js';

import { createTentacle } from "./tenta(culos)";

import { crearMeteoritos, animarMeteoritos } from "./meteoritos.js";

import { agregarHumoAPista, animarHumo } from "./humo.js";

import {
    item1_UI, item2_UI, panel_UI,
    K, M, C5, C6, C7,
    P,T,S,SPACE,C1,C2,C3,C4,
    

} from "./UI.js"

export const scene = new THREE.Scene();


const cubeTextureLoader = new THREE.CubeTextureLoader();


const skyboxTexture = cubeTextureLoader.load([
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/MilkyWay/dark-s_nx.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/MilkyWay/dark-s_px.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/MilkyWay/dark-s_ny.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/MilkyWay/dark-s_py.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/MilkyWay/dark-s_nz.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/MilkyWay/dark-s_pz.jpg'
], function(texture) {
    texture.mapping = THREE.CubeReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
});



const mainCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const carritoCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const GlobalCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
export const camaras = [mainCamera, carritoCamera, GlobalCamera];


const tentacles = [];



const { sol, solVisual } = crearAmbiente(scene);
crearMeteoritos(scene); 
agregarHumoAPista(scene);


const galaxiaTexture = new THREE.TextureLoader().load('scr/assets/space_galaxy.png');
const galaxiaMaterial = new THREE.SpriteMaterial({
    map: galaxiaTexture,
    color: 0xffffff,
    depthWrite: false
});


const posicionesGalaxia = [
    new THREE.Vector3(-500, 70, -700),
    new THREE.Vector3(500, 100, -900),
    new THREE.Vector3(-450, 200, 1000),
    new THREE.Vector3(480, 90, 1050),
    
];


for (let i = 0; i < posicionesGalaxia.length; i++) {
    const sprite = new THREE.Sprite(galaxiaMaterial.clone());
    sprite.position.copy(posicionesGalaxia[i]);
    sprite.scale.set(100, 100, 1);
    scene.add(sprite);
}

const helixTexture = new THREE.TextureLoader().load('scr/assets/space_helix.png');
const helixMaterial = new THREE.SpriteMaterial({
    map: helixTexture,
    color: 0xffffff,
    depthWrite: false
});

const posicionesHelix = [
    new THREE.Vector3(-1000, 80, 700),
    new THREE.Vector3(150, 300, -600),
    new THREE.Vector3(400, 400, 700),
    

];

for (let i = 0; i < posicionesHelix.length; i++) {
    const sprite = new THREE.Sprite(helixMaterial.clone());
    sprite.position.copy(posicionesHelix[i]);
    sprite.scale.set(120, 120, 1);
    scene.add(sprite);
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbit = new OrbitControls(GlobalCamera, renderer.domElement);
orbit.enableZoom = true;
orbit.enablePan = true;
orbit.enableRotate = true;  


camaras[0].add(item1_UI.item)   
camaras[0].add(item2_UI.item)
camaras[0].add(panel_UI.item)

camaras[0].add(K.item)
camaras[0].add(M.item)
camaras[0].add(C5.item)
camaras[0].add(C6.item)
camaras[0].add(C7.item)


camaras[0].add(P.item)
camaras[0].add(T.item)
camaras[0].add(S.item)
camaras[0].add(SPACE.item)
camaras[0].add(C1.item)
camaras[0].add(C2.item)
camaras[0].add(C3.item)
camaras[0].add(C4.item)



mainCamera.position.set(0,10,10);
carritoCamera.position.set(0,2.5,1.5);
GlobalCamera.position.set(0,10,0);
orbit.update();



AddAllBoxes(scene);
AddAllStars(scene);



scene.add(plane);
BorderView(scene, false, false);


carritoRosa._optra.position.set(0, 0, -75);
carroGenerico._optra.position.set(0, 0, -65);
carroGenerico2._optra.position.set(0, 0, -85);



carritoRosa._optra.rotation.y = Math.PI / 2;
carroGenerico._optra.rotation.y = Math.PI / 2;
carroGenerico2._optra.rotation.y = Math.PI / 2;



scene.add(carritoRosa._optra);
scene.add(carroGenerico._optra);
scene.add(carroGenerico2._optra);





const front = new THREE.Vector3(0,0,-10);
mainCamera.lookAt(front);



carritoRosa._optra.add(mainCamera);
carritoRosa._optra.add(carritoCamera);



const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.35);
directionalLight.position.set(-30,50,0);
scene.add(directionalLight);


const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);



let lastFrameTime = 0;



const tentaclePositions = [
    { base: new THREE.Vector3(-120, 0, -60), tip: new THREE.Vector3(-110, 7, -55), thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(-120, 0, 0),   tip: new THREE.Vector3(-110, 7, 5),   thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(-120, 0, 60),  tip: new THREE.Vector3(-110, 7, 65),  thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(-120, 0, -30), tip: new THREE.Vector3(-112, 5, -28), thickness: 1.8, isMini: true },
    { base: new THREE.Vector3(-120, 0, 30),  tip: new THREE.Vector3(-112, 5, 32),  thickness: 1.8, isMini: true },
    { base: new THREE.Vector3(120, 0, -60), tip: new THREE.Vector3(110, 7, -55), thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(120, 0, 0),   tip: new THREE.Vector3(110, 7, 5),   thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(120, 0, 60),  tip: new THREE.Vector3(110, 7, 65),  thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(120, 0, -30), tip: new THREE.Vector3(112, 5, -28), thickness: 1.8, isMini: true },
    { base: new THREE.Vector3(120, 0, 30),  tip: new THREE.Vector3(112, 5, 32),  thickness: 1.8, isMini: true },
    { base: new THREE.Vector3(-60, 0, 95), tip: new THREE.Vector3(-55, 7, 85), thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(0, 0, 95),   tip: new THREE.Vector3(5, 7, 85),   thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(60, 0, 95),  tip: new THREE.Vector3(65, 7, 85),  thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(-30, 0, 95), tip: new THREE.Vector3(-28, 5, 87), thickness: 1.8, isMini: true },
    { base: new THREE.Vector3(30, 0, 95),  tip: new THREE.Vector3(32, 5, 87),  thickness: 1.8, isMini: true },
    { base: new THREE.Vector3(-60, 0, -95), tip: new THREE.Vector3(-55, 7, -85), thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(0, 0, -95),   tip: new THREE.Vector3(5, 7, -85),   thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(60, 0, -95),  tip: new THREE.Vector3(65, 7, -85),  thickness: 1.8, isMini: false },
    { base: new THREE.Vector3(-30, 0, -95), tip: new THREE.Vector3(-28, 5, -87), thickness: 1.8, isMini: true },
    { base: new THREE.Vector3(30, 0, -95),  tip: new THREE.Vector3(32, 5, -87),  thickness: 1.8, isMini: true },
];



tentaclePositions.forEach(pos => {
    const tentacle = createTentacle(pos.base, pos.tip, pos.thickness);
    scene.add(tentacle);
    tentacles.push(tentacle); 
});

// ----- UI ----

const screen2Worldw = window.innerWidth / 202.1 // (1920/9.5) n  son la unidades en el mundo asumiendo -6 en z
const screen2Worldh = window.innerHeight / 191.45 // (919/4.5)
const w = screen2Worldw * .95
const h = screen2Worldh * .85


item1_UI.SetPositionCamera0(w,h-0.1,-6)
item2_UI.SetPositionCamera0(w,h-0.1,-6)
panel_UI.SetPositionCamera0(w,h-0.1,-6.01)

K.SetPositionCamera0(-w, -h, -6)
M.SetPositionCamera0(-w+.5, -h, -6)
C5.SetPositionCamera0(-w+1, -h, -6)
C6.SetPositionCamera0(-w+1.5, -h, -6)
C7.SetPositionCamera0(-w+2, -h, -6)

P.SetPositionCamera0(w-4,-h,-6)
T.SetPositionCamera0(w-3.5,-h,-6)
S.SetPositionCamera0(w-3,-h,-6)
SPACE.SetPositionCamera0(w-2.5,-h,-6)
C1.SetPositionCamera0(w-2,-h,-6)
C2.SetPositionCamera0(w-1.5,-h,-6)
C3.SetPositionCamera0(w-1,-h,-6)
C4.SetPositionCamera0(w-0.5,-h,-6)

// ---- puntos -----

scene.add(B)
scene.add(B2)

const clock = new THREE.Clock();

const audioListener = new THREE.AudioListener();
const audio = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();
let audioInitialized = false;

function initAudio() {
    if (audioInitialized) return;
    audioInitialized = true;
    audioLoader.load('scr/assets/musica.mp3', function(buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(0);
        audio.play();
    });
    mainCamera.add(audioListener);
}

window.addEventListener('keydown', initAudio, { once: true });
window.addEventListener('mousedown', initAudio, { once: true });

function animate(time) {
    const deltaTime = (time - lastFrameTime) / 1000;
    lastFrameTime = time;;
    

    updatePlayer(deltaTime);
    updateVehiclePosition(carritoRosa._optra, deltaTime);
    updateWheelRotation(carritoRosa._optra.children[1], deltaTime);
    UpdateCars(deltaTime);

    CheckcollisionsLimits(deltaTime);

    PowerUpAnimation(deltaTime);

    UpdateItems(deltaTime);

    Checkcollisions(deltaTime);

    animateWater();

    animarHumo(time);

    const globalTime = time * 0.001;
    tentacles.forEach(t => t.update(globalTime));
    
    animarMeteoritos(time);

   
    animarSol(sol, solVisual, deltaTime);
    
    UpdateCamra(renderer, scene);
 
    orbit.update(); 
}


renderer.setAnimationLoop(animate);