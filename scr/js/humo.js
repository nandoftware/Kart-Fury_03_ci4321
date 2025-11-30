import * as THREE from "three";

const texturaHumo = new THREE.TextureLoader().load('scr/assets/humo.png')
texturaHumo.colorSpace = THREE.SRGBColorSpace;


const posicionesFijas = [
    new THREE.Vector3(-80, 0.1, -60),
    new THREE.Vector3(80, 0.1, -60),
    new THREE.Vector3(-80, 0.1, 60),
    new THREE.Vector3(80, 0.1, 60),
    new THREE.Vector3(0, 0.1, 90),
    new THREE.Vector3(0, 0.1, -90),
    new THREE.Vector3(-100, 0.1, 0),
    new THREE.Vector3(100, 0.1, 0)
];


const cantidadParticulas = 100;
const arregloPos = new Float32Array(cantidadParticulas * 3);
const arregloVel = new Float32Array(cantidadParticulas * 3);
const arregloTamano = new Float32Array(cantidadParticulas);
const arregloAlfa = new Float32Array(cantidadParticulas);
const arregloDesfase = new Float32Array(cantidadParticulas);


for (let i = 0; i < cantidadParticulas; i++) {


    const posBase = posicionesFijas[Math.floor(Math.random() * posicionesFijas.length)];
    const x = posBase.x + (Math.random() - 0.5) * 20;
    const y = 0.1;
    const z = posBase.z + (Math.random() - 0.5) * 20;


    arregloPos[i * 3] = x;
    arregloPos[i * 3 + 1] = y;
    arregloPos[i * 3 + 2] = z;


    arregloVel[i * 3] = (Math.random() - 0.5) * 0.5;
    arregloVel[i * 3 + 1] = 0;
    arregloVel[i * 3 + 2] = (Math.random() - 0.5) * 0.5;


    arregloTamano[i] = (6 + Math.random() * 10) * 500;
    arregloAlfa[i] = 0.2 + Math.random() * 0.3;
    arregloDesfase[i] = Math.random() * Math.PI * 2;

}


const geometria = new THREE.BufferGeometry();

geometria.setAttribute('position', new THREE.BufferAttribute(arregloPos, 3));
geometria.setAttribute('velocity', new THREE.BufferAttribute(arregloVel, 3));
geometria.setAttribute('size', new THREE.BufferAttribute(arregloTamano, 1));
geometria.setAttribute('alpha', new THREE.BufferAttribute(arregloAlfa, 1));
geometria.setAttribute('timeOffset', new THREE.BufferAttribute(arregloDesfase, 1));


const material = new THREE.PointsMaterial({

    size: 1000,
    map: texturaHumo,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0x444444
    
});


const sistemaHumo = new THREE.Points(geometria, material);


export function agregarHumoAPista(escena) {
    escena.add(sistemaHumo);
}


export function animarHumo(tiempo) {

    const t = tiempo * 0.001;
    const pos = geometria.attributes.position.array;
    const vel = geometria.attributes.velocity.array;
    const alfas = geometria.attributes.alpha.array;
    const desfases = geometria.attributes.timeOffset.array;


    for (let i = 0; i < cantidadParticulas; i++) {
        const idx = i * 3;
        pos[idx] += vel[idx] * 0.5;
        pos[idx + 2] += vel[idx + 2] * 0.5;
        pos[idx + 1] = 0.1 + Math.sin(t * 2 + desfases[i]) * 0.12;


        if (pos[idx] < -120) pos[idx] = 120;
        if (pos[idx] > 120) pos[idx] = -120;
        if (pos[idx + 2] < -110) pos[idx + 2] = 110;
        if (pos[idx + 2] > 110) pos[idx + 2] = -110;


        alfas[i] = 0.25 + Math.sin(t + desfases[i]) * 0.15;
    }


    geometria.attributes.position.needsUpdate = true;

    geometria.attributes.alpha.needsUpdate = true;

}