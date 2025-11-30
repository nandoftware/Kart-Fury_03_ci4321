import * as THREE from "three";
import { carritoRosa } from "./carritorosa";
import { createStar } from './BufferGeometry.js';
import { player } from "./mecánicas.js";

const boxTexture = new THREE.TextureLoader().load('scr/assets/cajapw.png');
const boxTexture_normal = new THREE.TextureLoader().load('scr/assets/cajapw_normal.png');
boxTexture.colorSpace = THREE.SRGBColorSpace;

class PowerUp {
    constructor(x, y, z) {
        this._cajaGeometry = new THREE.BoxGeometry(3, 3, 3);
        this._cajaMaterial = new THREE.MeshStandardMaterial({
            map: boxTexture,
            normalMap: boxTexture_normal 

        });

        this._caja = new THREE.Mesh(this._cajaGeometry, this._cajaMaterial);
        this._caja.position.set(x, y, z);

        this._cajaCollider = new THREE.Box3();
        this.updateCollider(); // inicializar collider

        this._active = true;
        this._count = 0;
    }

    updateCollider() {
        this._cajaCollider.setFromObject(this._caja);
    }

    Update(deltaTime) {
        this._caja.rotation.x += 0.01;
        this._caja.rotation.y += 0.01;
        this.ReSet(deltaTime);
    }

    Interaction() {
        if (this._active) {
            console.log("¡Power-up recogido!");
            const randomItem = Math.random() < 0.5 ? 0 : 1;
            carritoRosa.Interaction(randomItem);

            this._caja.visible = false;
            this._active = false;
            this._count = 0; // reiniciar contador
        }
    }

    ReSet(deltaTime) {
        if (!this._active) {
            this._count += deltaTime;
            if (this._count > 3) { // reaparece después de 3 segundos
                this._caja.visible = true;
                this._active = true;
                this.updateCollider(); 
            }
        }
    }
}

export const PW1 = new PowerUp(-30, 3, -75);
export const PW2 = new PowerUp(-30, 3, -65);
export const PW3 = new PowerUp(-30, 3, -85);

// nuevas cajitas en el lado contrario

export const PW4 = new PowerUp(-30, 3, 75);
export const PW5 = new PowerUp(-30, 3, 65);
export const PW6 = new PowerUp(-30, 3, 85);

export function AddAllBoxes(scena){
    scena.add(PW1._caja);
    scena.add(PW2._caja);
    scena.add(PW3._caja);

     // nuevas cajitas
    scena.add(PW4._caja);
    scena.add(PW5._caja);
    scena.add(PW6._caja);
}


export function PowerUpAnimation(delta){
    PW1.Update(delta)
    PW2.Update(delta)
    PW3.Update(delta)
    PW4.Update(delta); // nuevas
    PW5.Update(delta);
    PW6.Update(delta);
    
}

export function CheckcollisionsPW(){
    if (PW1._cajaCollider.intersectsBox(carritoRosa._bodyCollider)){
        PW1.Interaction();
    }
    if (PW2._cajaCollider.intersectsBox(carritoRosa._bodyCollider)){
        PW2.Interaction();
    }
    if (PW3._cajaCollider.intersectsBox(carritoRosa._bodyCollider)){
        PW3.Interaction();
    }
    if (PW4._cajaCollider.intersectsBox(carritoRosa._bodyCollider)){
        PW4.Interaction();
    }
    if (PW5._cajaCollider.intersectsBox(carritoRosa._bodyCollider)){
        PW5.Interaction();
    }
    if (PW6._cajaCollider.intersectsBox(carritoRosa._bodyCollider)){
        PW6.Interaction();
    }
}



const conePositions = [
    [-20, 0.1, -65],
    [20, 0.1, -85],
    [-20, 0.1, 85],
    [20, 0.1, 65],
    [-110, 0.1, -20],
    [-90, 0.1, 20],
    [90, 0.1, -20],
    [110, 0.1, 20]
];

export const stars = conePositions.map(([x, y, z]) => {
    const c = createStar(); 
    c.position.set(x, y, z);
    return c;
});


export function AddAllStars(scene) { stars.forEach(s => scene.add(s)); }
export function StarAnimation(dt) { stars.forEach(s => s.rotation.y += dt); }

export const coneColliders = []

for (let i = 0; i < 8; i++){
    coneColliders.push(new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()))
    coneColliders[i].setFromObject(stars[i]);
}


export function CheckCollisionsStars() {
    
        for (let i = 0; i < coneColliders.length; i++){
            if(carritoRosa._bodyCollider.intersectsBox(coneColliders[i])){
                coneColliders[i].copy(stars[i].geometry.boundingBox).applyMatrix4(stars[i].matrixWorld)
            }
        }
    
    
}

