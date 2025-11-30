import * as THREE from "three";
import { carritoRosa, carroGenerico, carroGenerico2 } from "./carritorosa";
import { 
    insideBoxCollider1, 
    insideBoxCollider2, 
    insideBoxCollider3, 
    insideBoxCollider4, 
    outsideBoxCollider1,
    outsideBoxCollider2,
    outsideBoxCollider3,
    outsideBoxCollider4,
    BC, B2C} from "./pista";
import { coneColliders, stars } from "./powerUps";
import { C1, C2, C3, C4, C5, C6, C7 } from "./UI";

const PISTA_ANCHO = 30;
const LIMITE_IZQUIERDO = -PISTA_ANCHO / 2 + 0.5;
const LIMITE_DERECHO = PISTA_ANCHO / 2 - 0.5;

// teclas
export const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// jugador
export const player = {
    speed: 0,
    maxSpeed: 30,
    acceleration: 45,
    deceleration: 10,
    currentSteering: 0,
    maxSteering: Math.PI / 6,
    steeringDamping: 5,
    rotationSpeed: 4,
    lap: 0,
    points: 0
};

// actualizaciones
export function updatePlayer(deltaTime) {
    // Aceleración
    if (keys['w'] || keys['W']) {
        player.speed += player.acceleration * deltaTime;
    } else if (keys['s'] || keys['S']) {
        player.speed -= player.acceleration * deltaTime;
    } else {
        const friction = player.deceleration * deltaTime;
        if (player.speed > 0) {
            player.speed = Math.max(0, player.speed - friction);
        } else if (player.speed < 0) {
            player.speed = Math.min(0, player.speed + friction);
        }
    }

    player.speed = Math.max(-player.maxSpeed, Math.min(player.speed, player.maxSpeed));
    // console.log(player.speed)
    UpdateKM(deltaTime)

    // giro
    let targetSteering = 0;
    if (keys['a'] || keys['A']) {
        targetSteering = player.maxSteering;
    } else if (keys['d'] || keys['D']) {
        targetSteering = -player.maxSteering;
    }

    player.currentSteering += (targetSteering - player.currentSteering) * player.steeringDamping * deltaTime;
    player.currentSteering = Math.max(-player.maxSteering, Math.min(player.currentSteering, player.maxSteering));
}

// posición del carrito
export function updateVehiclePosition(vehicle, deltaTime) {
    if (player.speed > 0) {
        vehicle.rotation.y += player.currentSteering * player.rotationSpeed * deltaTime;
    } else if (player.speed < 0) {
        vehicle.rotation.y += -player.currentSteering * player.rotationSpeed * deltaTime;
    }

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(vehicle.quaternion);
    vehicle.position.add(forward.multiplyScalar(player.speed * deltaTime));
}

// ruedas
export function updateWheelRotation(wheels, deltaTime) {
    const wheelRotation = player.speed * deltaTime * 4;
    wheels.children.forEach(child => {
        child.children[0].rotation.y += wheelRotation;
    });
    for (let index = 0; index < 2; index++) {
        wheels.children[index].rotation.y = player.currentSteering;
    }
}





export function CheckcollisionsLimits(deltaTime){
    if(
        carritoRosa._bodyCollider.intersectsBox(insideBoxCollider1) ||
        carritoRosa._bodyCollider.intersectsBox(insideBoxCollider2) ||
        carritoRosa._bodyCollider.intersectsBox(insideBoxCollider3) ||
        carritoRosa._bodyCollider.intersectsBox(insideBoxCollider4) ||
        carritoRosa._bodyCollider.intersectsBox(outsideBoxCollider1) ||
        carritoRosa._bodyCollider.intersectsBox(outsideBoxCollider2) ||
        carritoRosa._bodyCollider.intersectsBox(outsideBoxCollider3) ||
        carritoRosa._bodyCollider.intersectsBox(outsideBoxCollider4) 
        ){
        updateVehiclePosition(carritoRosa._optra, -2*deltaTime)
        player.speed = 0
    }

    for(let i = 0; i<coneColliders.length; i++){
        if(carritoRosa._bodyCollider.intersectsBox(coneColliders[i])){
            
            
            coneColliders[i].copy(stars[i].geometry.boundingBox).applyMatrix4(stars[i].matrixWorld)

            if(stars[i].visible){
                player.speed = -8 * player.speed
                updateVehiclePosition(carritoRosa._optra, deltaTime)
                player.points -= 10 
                UpdatePoints()
            }
            
        }
    }
    if (carritoRosa._bodyCollider.intersectsBox(carroGenerico._bodyCollider) || carritoRosa._bodyCollider.intersectsBox(carroGenerico2._bodyCollider)){
        player.speed = -8 * player.speed
        updateVehiclePosition(carritoRosa._optra, deltaTime)
    }
    if (carritoRosa._bodyCollider.intersectsBox(B2C)){
        player.lap = 1
    }
    if (carritoRosa._bodyCollider.intersectsBox(BC) && player.lap == 1){
        player.points += 10
        console.log(player.points)
        player.lap = 0
        
        UpdatePoints()
    }

}

let timeElapse = 0
function UpdateKM(DeltaTime){
    timeElapse += DeltaTime
    if(timeElapse > 0.15){
        let j = Math.abs((player.speed * 100) / player.maxSpeed)

        let i = []
            let cut = j.toString()
            for (let index = 0; index < 3; index++) {
                i[index] = cut.charAt(index).charCodeAt() - 48
            
            }
            
        C5.SetIndex(16 + i[0])
        C6.SetIndex(16 + i[1])
        C7.SetIndex(16 + i[2])
        timeElapse = 0
    }

    

}

function UpdatePoints(){
    let i = []
        let cut = player.points.toString()
        for (let index = 0; index < 4; index++) {
            i[index] = cut.charAt(index).charCodeAt() - 48
            
        }
            
        C1.SetIndex(16 + i[0])
        C2.SetIndex(16 + i[1])
        C3.SetIndex(16 + i[2])
        C4.SetIndex(16 + i[3]) 
}


