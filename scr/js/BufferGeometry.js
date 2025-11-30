import * as THREE from 'three';

const conoTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/rochibochhi/textures/main/calavera.jpg');
conoTexture.wrapS = THREE.RepeatWrapping;
conoTexture.wrapT = THREE.RepeatWrapping;
conoTexture.repeat.set(0.5, 0.5); 

export function createStar() {
    const radius = 1;
    const height = 2;
    const radialSegments = 16;
    const vertices = [];
    const indices = [];
    const uvs = [];

    vertices.push(0, height, 0);
    uvs.push(0.5, 1);

    vertices.push(0, 0, 0);
    uvs.push(0.5, 0);

    for (let i = 0; i <= radialSegments; i++) {
        const angle = (i / radialSegments) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        vertices.push(x, 0, z);
        
        const u = i / radialSegments;
        uvs.push(u, 0);
    }

    const apex = 0;
    const baseCenter = 1;

    for (let i = 0; i < radialSegments; i++) {
        const a = 2 + i;
        const b = 2 + i + 1;
        indices.push(apex, a, b);
        indices.push(baseCenter, b, a);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ 
        map: conoTexture,
        side: THREE.DoubleSide 
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(2, 2, 2);
    return mesh;
}
