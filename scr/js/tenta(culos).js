import * as THREE from "three";

export function createTentacle(startPos, endPos, thickness = 1.5, segments = 64) {
    const base = startPos.clone();
    const tip = endPos.clone();

    const points = [
        base,
        new THREE.Vector3(),
        new THREE.Vector3(),
        tip
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    curve.curveType = 'centripetal';

    const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, segments, thickness, 8, false),
        new THREE.MeshStandardMaterial({
            color: 0x4B0082,
            roughness: 0.85,
            metalness: 0.15
        })
    );

    // agg una esfera a la punta del tentaculo
    const tipSphere = new THREE.Mesh(
        new THREE.SphereGeometry(thickness, 8, 6),
        tube.material.clone()
    );
    tipSphere.position.copy(tip);

    const tentacle = new THREE.Group();
    tentacle.add(tube);
    tentacle.add(tipSphere);

    tentacle.update = function(time) {
        const sway1 = Math.sin(time * 0.7 + base.x * 0.05) * 6;
        const sway2 = Math.cos(time * 0.6 + base.z * 0.05) * 5;
        const lift1 = Math.sin(time * 0.5) * 2;
        const lift2 = Math.cos(time * 0.4) * 1.5;

        points[1].set(base.x + sway1, base.y + 5 + lift1, base.z + sway2);
        points[2].set(tip.x + sway1 * 0.7, tip.y + 3 + lift2, tip.z + sway2 * 0.7);

        tube.geometry.dispose();
        tube.geometry = new THREE.TubeGeometry(curve, segments, thickness, 8, false);

        // mover la esfera a la punta
        tipSphere.position.copy(points[3]);
    };

    return tentacle;
}
