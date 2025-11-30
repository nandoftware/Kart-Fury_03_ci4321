import * as THREE from "three";

const meteoritos = [];


const meteorTexture = new THREE.TextureLoader().load('scr/assets/meteorito.jpg');



meteorTexture.wrapS = THREE.RepeatWrapping;
meteorTexture.wrapT = THREE.RepeatWrapping;
meteorTexture.repeat.set(1, 1); 



export function crearMeteoritos(scene) {
    
    const geometry = new THREE.SphereGeometry(1, 32, 32);


    const material = new THREE.MeshPhongMaterial({
        map: meteorTexture,
        shininess: 20,
        flatShading: true
    });


    const positions = [
        // izquierda
        new THREE.Vector3(-80, 40, -60),
        new THREE.Vector3(-70, 30, 0),
        new THREE.Vector3(-85, 50, 60),
        // derecha
        new THREE.Vector3(80, 35, -50),
        new THREE.Vector3(75, 45, 10),
        new THREE.Vector3(82, 30, 65),
        // frente/atras
        new THREE.Vector3(0, 40, 90),
        new THREE.Vector3(0, 50, -95),
        new THREE.Vector3(40, 35, 85),
        new THREE.Vector3(-40, 45, -88),
    ];


    const sizes = [3.6, 6.6, 4.8, 8.4, 4.2, 7.2, 5.4, 6.0, 4.5, 7.8];


    for (let i = 0; i < positions.length; i++) {
        const size = sizes[i];
        const mesh = new THREE.Mesh(geometry.clone(), material.clone());
        mesh.scale.setScalar(size);
        mesh.position.copy(positions[i]);

        
        mesh.userData = {
            
            basePosition: positions[i].clone(),
            
            // movimiento en Y 
            floatSpeedY: 0.5 + Math.random() * 0.5,
            floatAmplitudeY: 2 + Math.random() * 20,
            timeOffsetY: Math.random() * Math.PI * 2,
            
            // movimiento en X 
            floatSpeedX: 0.3 + Math.random() * 0.4,
            floatAmplitudeX: 5 + Math.random() * 200,
            timeOffsetX: Math.random() * Math.PI * 2
        };

        scene.add(mesh);
       
        meteoritos.push(mesh);
    }
}


export function animarMeteoritos(time) {
    
    const t = time * 0.001;
    
    meteoritos.forEach(meteor => {
        
        const u = meteor.userData;
        const base = u.basePosition;


        // animacion en X
        meteor.position.x = base.x + Math.sin(t * u.floatSpeedX + u.timeOffsetX) * u.floatAmplitudeX;
        // animacion en Y
        meteor.position.y = base.y + Math.sin(t * u.floatSpeedY + u.timeOffsetY) * u.floatAmplitudeY;

        // rotacion suave
        meteor.rotation.x += 0.002;
        meteor.rotation.y += 0.003;
    });
}

