import * as THREE from "three";

export function crearAmbiente(scene) {
    const sol = new THREE.DirectionalLight(0xFF7777, 2.0);
    sol.position.set(50, 80, 50); 
    sol.castShadow = true;

    sol.shadow.mapSize.width = 2048;
    sol.shadow.mapSize.height = 2048;
    sol.shadow.camera.near = 0.5;
    sol.shadow.camera.far = 500;
    sol.shadow.camera.left = -150;
    sol.shadow.camera.right = 150;
    sol.shadow.camera.top = 150;
    sol.shadow.camera.bottom = -150;

    scene.add(sol);
    // scene.add(new THREE.DirectionalLightHelper(sol, 5));

    const solVisual = new THREE.Mesh(
        new THREE.SphereGeometry(10, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xFFB5C0 })
    );
    
    solVisual.position.copy(sol.position);
    scene.add(solVisual);

    return { sol, solVisual };
}
var elapsedTime = 0
export function animarSol(sol, solVisual, deltaTime) {
    elapsedTime += deltaTime
    // const baseAngle = elapsedTime * 0.15;
    // solVisual.rotation.y = baseAngle;
    
    const radius = 180;
    sol.position.x = Math.sin(elapsedTime) * radius;
    sol.position.z = Math.cos(elapsedTime) * radius;
    sol.position.y = 60 + 20 * Math.sin(elapsedTime * 0.07);

    solVisual.position.x = Math.sin(elapsedTime) * radius;
    solVisual.position.z = Math.cos(elapsedTime) * radius;
    solVisual.position.y = 60 + 20 * Math.sin(elapsedTime * 0.07);
    
    // const intensityOffset = 0.2 * Math.sin(elapsedTime * 2.3);
    // sol.intensity = 1.8 + intensityOffset;
}