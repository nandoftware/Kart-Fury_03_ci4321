import * as THREE from "three";
import { carritoRosa } from "./carritorosa";

const waterTexture = new THREE.TextureLoader().load(
    'scr/assets/awa.jpg'
);
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set(2, 2);

const causticTexture = new THREE.TextureLoader().load(
    'scr/assets/pista6.jpg'
);
causticTexture.colorSpace = THREE.SRGBColorSpace;
causticTexture.wrapS = THREE.RepeatWrapping;
causticTexture.wrapT = THREE.RepeatWrapping;

const causticNormalMap = new THREE.TextureLoader().load(
    'scr/assets/pista6_normal.png'
);
causticNormalMap.wrapS = THREE.RepeatWrapping;
causticNormalMap.wrapT = THREE.RepeatWrapping;

const borderTexture = new THREE.TextureLoader().load(
    'https://raw.githubusercontent.com/rochibochhi/textures/main/calavera.jpg'
);
borderTexture.wrapS = THREE.RepeatWrapping;
borderTexture.wrapT = THREE.RepeatWrapping;
borderTexture.repeat.set(10, 10);

const waterMaterial = new THREE.MeshStandardMaterial({
    map: waterTexture,
    transparent: true,
    opacity: 0.8,
    roughness: 0.1,
    metalness: 0.5
});

const waterGeometry = new THREE.PlaneGeometry(900, 900);
const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
waterPlane.rotation.x = -Math.PI / 2;
waterPlane.position.y = -0.2;

const floorMaterial = new THREE.MeshStandardMaterial({
    map: causticTexture,
    normalMap: causticNormalMap,
    emissive: 0x446688,
    emissiveIntensity: 0.5,
    roughness: 0.9,
    metalness: 0.1
});

class Segmento{
    constructor(ancho, largo){
        this._ancho_carretera = ancho;
        this._largo_carretera = largo;
        this._segmento = new THREE.Group();
        this._rayas = new THREE.Group();

        this._inicio = largo*0.5;
        this._fin = -largo*0.5;

        this._ancho_raya = 1.5;
        this._largo_raya = 5;
        this._espacio_raya = 10;

        this._carretera = new THREE.Mesh(
            new THREE.PlaneGeometry(this._ancho_carretera, this._largo_carretera),
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
        );
        this._carretera.rotation.x = -Math.PI / 2;

        this._cantidad = Math.floor(this._largo_carretera / (this._largo_raya + this._espacio_raya));
        console.log(this._cantidad)
        for (let i = 0; i < this._cantidad; i++) {
            this._x = -this._largo_carretera / 2 + i * (this._largo_raya + this._espacio_raya) + this._largo_raya / 2;
            console.log(this._x)
            this._raya = new THREE.Mesh(
                new THREE.PlaneGeometry(this._ancho_raya, this._largo_raya ),
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
            );
            this._raya.position.set(0, 0.1, this._x);
            this._raya.rotation.x = -Math.PI / 2;
            this._rayas.add(this._raya);
        }

        this._segmento.add(this._carretera);
        this._segmento.add(this._rayas);
        
    }
}

const ancho_carretera = 35;        
const ancho_total = 200;      
const alto_total = 150;     

const grosor_borde = 5;       
const ancho_raya = 1.5;
const largo_raya = 5;
const espacio_raya = 10;

const mitad_ancho = ancho_total / 2;      
const mitad_alto = alto_total / 2;     
const mitad_carretera = ancho_carretera / 2;    

const MITAD_EXTERIOR_X = mitad_ancho + mitad_carretera; 
const MITAD_EXTERIOR_Z = mitad_alto + mitad_carretera; 
const MITAD_INTERIOR_X = mitad_ancho - mitad_carretera; 
const MITAD_INTERIOR_Z = mitad_alto - mitad_carretera; 

function crearSegmentoLargo(largo) {
    const carretera = new THREE.Mesh(
        new THREE.PlaneGeometry(largo, ancho_carretera),
        floorMaterial.clone()
    );
    carretera.rotation.x = -Math.PI / 2;
    carretera.material.map = causticTexture.clone();
    carretera.material.normalMap = causticNormalMap.clone();
    carretera.material.map.rotation = Math.PI;
    carretera.material.map.center.set(0.5, 0.5);
    carretera.material.map.repeat.set(largo / 50, 1);
    carretera.material.normalMap.rotation = Math.PI;
    carretera.material.normalMap.center.set(0.5, 0.5);
    carretera.material.normalMap.repeat.set(largo / 50, 1);
    carretera.receiveShadow = true

    const rayas = new THREE.Group();
    const cantidad = Math.floor(largo / (largo_raya + espacio_raya));
    for (let i = 0; i < cantidad; i++) {
        const x = -largo / 2 + i * (largo_raya + espacio_raya) + largo_raya / 2;
        const raya = new THREE.Mesh(
            new THREE.PlaneGeometry(largo_raya, ancho_raya),
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
        );
        raya.position.set(x, 0.1, 0);
        raya.rotation.x = -Math.PI / 2;
        rayas.add(raya);
    }

    const segmento = new THREE.Group();
    segmento.receiveShadow = true
    segmento.add(carretera);
    segmento.add(rayas);
    return segmento;
}

function crearSegmentoCorto(largo) {
    const carretera = new THREE.Mesh(
        new THREE.PlaneGeometry(ancho_carretera, largo),
        floorMaterial.clone()
    );
    carretera.rotation.x = -Math.PI / 2;
    
    const mat = carretera.material;
    mat.map = causticTexture.clone();
    mat.normalMap = causticNormalMap.clone();
    mat.map.rotation = Math.PI + Math.PI / 2;
    mat.map.center.set(0.5, 0.5);
    mat.map.repeat.set(largo / 50, 1);
    mat.normalMap.rotation = Math.PI + Math.PI / 2;
    mat.normalMap.center.set(0.5, 0.5);
    mat.normalMap.repeat.set(largo / 50, 1);

    const rayas = new THREE.Group();
    const cantidad = Math.floor(largo / (largo_raya + espacio_raya));
    for (let i = 0; i < cantidad; i++) {
        const z = -largo / 2 + i * (largo_raya + espacio_raya) + largo_raya / 2;
        const raya = new THREE.Mesh(
            new THREE.PlaneGeometry(ancho_raya, largo_raya),
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
        );
        raya.position.set(0, 0.1, z);
        raya.rotation.x = -Math.PI / 2;
        rayas.add(raya);
    }

    const segmento = new THREE.Group();
    segmento.add(carretera);
    segmento.add(rayas);
    return segmento;
}

function crearBordesConGrosor(grosorVertical = 60) {
    const grupo = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ 
        map: borderTexture,
        color: 0xFFFFFF
    });
    const topExt = new THREE.Mesh(
        new THREE.BoxGeometry(2 * MITAD_EXTERIOR_X, grosorVertical, grosor_borde),
        material
    );
    topExt.position.set(0, grosorVertical / 2, MITAD_EXTERIOR_Z);
    const bottomExt = new THREE.Mesh(
        new THREE.BoxGeometry(2 * MITAD_EXTERIOR_X, grosorVertical, grosor_borde),
        material
    );
    bottomExt.position.set(0, grosorVertical / 2, -MITAD_EXTERIOR_Z);
    const leftExt = new THREE.Mesh(
        new THREE.BoxGeometry(grosor_borde, grosorVertical, 2 * MITAD_EXTERIOR_Z),
        material
    );
    leftExt.position.set(-MITAD_EXTERIOR_X, grosorVertical / 2, 0);
    const rightExt = new THREE.Mesh(
        new THREE.BoxGeometry(grosor_borde, grosorVertical, 2 * MITAD_EXTERIOR_Z),
        material
    );
    rightExt.position.set(MITAD_EXTERIOR_X, grosorVertical / 2, 0);

    const topInt = new THREE.Mesh(
        new THREE.BoxGeometry(2 * MITAD_INTERIOR_X, grosorVertical, grosor_borde),
        material
    );
    topInt.position.set(0, grosorVertical / 2, MITAD_INTERIOR_Z);
    const bottomInt = new THREE.Mesh(
        new THREE.BoxGeometry(2 * MITAD_INTERIOR_X, grosorVertical, grosor_borde),
        material
    );
    bottomInt.position.set(0, grosorVertical / 2, -MITAD_INTERIOR_Z);
    const leftInt = new THREE.Mesh(
        new THREE.BoxGeometry(grosor_borde, grosorVertical, 2 * MITAD_INTERIOR_Z),
        material
    );
    leftInt.position.set(-MITAD_INTERIOR_X, grosorVertical / 2, 0);
    const rightInt = new THREE.Mesh(
        new THREE.BoxGeometry(grosor_borde, grosorVertical, 2 * MITAD_INTERIOR_Z),
        material
    );
    rightInt.position.set(MITAD_INTERIOR_X, grosorVertical / 2, 0);

    grupo.add(topExt, bottomExt, leftExt, rightExt);
    grupo.add(topInt, bottomInt, leftInt, rightInt);

    return grupo;
}

const largo_segmento_corto = 170;   
const largo_segmento_largo = 190; 
const segmento_inferior = crearSegmentoLargo(largo_segmento_corto);
segmento_inferior.position.set(0, 0, -mitad_alto);
const segmento_superior = crearSegmentoLargo(largo_segmento_corto);
segmento_superior.position.set(0, 0, mitad_alto);
const segmento_izquierdo = crearSegmentoCorto(largo_segmento_largo);
segmento_izquierdo.position.set(-mitad_ancho, 0, 0);
const segmento_derecho = crearSegmentoCorto(largo_segmento_largo);
segmento_derecho.position.set(mitad_ancho, 0, 0);

const bordes_amarillos = crearBordesConGrosor(0.8);

const pista = new THREE.Group();
pista.add(segmento_inferior, segmento_superior, segmento_izquierdo, segmento_derecho, bordes_amarillos);

const escenaCompleta = new THREE.Group();
escenaCompleta.add(waterPlane);
escenaCompleta.add(pista);

export function animateWater() {
    waterTexture.offset.x += 0.002;
    waterTexture.offset.y += 0.001;
}

export { escenaCompleta as plane, waterPlane };
export { pista as pistaOnly };

const insideBoxGeometry1 = new THREE.BoxGeometry(ancho_total - ancho_carretera - grosor_borde,40,2)
const insideBoxGeometry2 = new THREE.BoxGeometry(2,40,ancho_total - ancho_carretera*2 - grosor_borde*4)
const outsideBoxGeometry = new THREE.BoxGeometry(ancho_total + ancho_carretera + grosor_borde, 40 ,2)
const BoxMaterial = new THREE.MeshBasicMaterial(0xFFFFFF)

const insideBoxMesh1 = new THREE.Mesh(insideBoxGeometry1, BoxMaterial)
const insideBoxMesh2 = new THREE.Mesh(insideBoxGeometry1, BoxMaterial)
const insideBoxMesh3 = new THREE.Mesh(insideBoxGeometry2, BoxMaterial)
const insideBoxMesh4 = new THREE.Mesh(insideBoxGeometry2, BoxMaterial)

const outsideBoxMesh1 = new THREE.Mesh(outsideBoxGeometry, BoxMaterial)
const outsideBoxMesh2 = new THREE.Mesh(outsideBoxGeometry, BoxMaterial)
const outsideBoxMesh3 = new THREE.Mesh(outsideBoxGeometry, BoxMaterial)
const outsideBoxMesh4 = new THREE.Mesh(outsideBoxGeometry, BoxMaterial)

export const insideBoxCollider1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
export const insideBoxCollider2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
export const insideBoxCollider3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
export const insideBoxCollider4 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())

export const outsideBoxCollider1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
export const outsideBoxCollider2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
export const outsideBoxCollider3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
export const outsideBoxCollider4 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())

export function BorderView(scene, inVi, outVi){
    scene.add(insideBoxMesh1)
    scene.add(insideBoxMesh2)
    scene.add(insideBoxMesh3)
    scene.add(insideBoxMesh4)
    scene.add(outsideBoxMesh1)
    scene.add(outsideBoxMesh2)
    scene.add(outsideBoxMesh3)
    scene.add(outsideBoxMesh4)

    insideBoxMesh1.visible = inVi
    insideBoxMesh2.visible = inVi
    insideBoxMesh3.visible = inVi
    insideBoxMesh4.visible = inVi
    outsideBoxMesh1.visible = outVi
    outsideBoxMesh2.visible = outVi
    outsideBoxMesh3.visible = outVi
    outsideBoxMesh4.visible = outVi

    insideBoxMesh1.position.set(0,0,(ancho_total - ancho_carretera*2 - grosor_borde*4)/2)
    insideBoxMesh2.position.set(0,0,-(ancho_total - ancho_carretera*2 - grosor_borde*4)/2)
    insideBoxMesh3.position.set(-mitad_ancho + grosor_borde/2 + ancho_carretera/2,0,0)
    insideBoxMesh4.position.set(mitad_ancho - grosor_borde/2 - ancho_carretera/2,0,0)

    outsideBoxMesh1.position.set(0,0,-mitad_ancho + grosor_borde)
    outsideBoxMesh2.position.set(0,0,mitad_ancho - grosor_borde)
    outsideBoxMesh3.position.set(mitad_ancho + grosor_borde/2 + ancho_carretera/2,0,0)
    outsideBoxMesh4.position.set(-mitad_ancho - grosor_borde/2 - ancho_carretera/2,0,0)

    outsideBoxMesh3.rotateY(Math.PI /2)
    outsideBoxMesh4.rotateY(Math.PI /2)

    insideBoxCollider1.setFromObject(insideBoxMesh1)
    insideBoxCollider2.setFromObject(insideBoxMesh2)
    insideBoxCollider3.setFromObject(insideBoxMesh3)
    insideBoxCollider4.setFromObject(insideBoxMesh4)

    outsideBoxCollider1.setFromObject(outsideBoxMesh1)
    outsideBoxCollider2.setFromObject(outsideBoxMesh2)
    outsideBoxCollider3.setFromObject(outsideBoxMesh3)
    outsideBoxCollider4.setFromObject(outsideBoxMesh4)

}

    const BG = new THREE.BoxGeometry(1,6,40)
    const BM = new THREE.MeshBasicMaterial({color: 0x000000})
    export const B = new THREE.Mesh(BG, BM)
    B.visible = false
    B.position.set(0,0,-75)
    export const BC = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    BC.setFromObject(B)

    export const B2 = new THREE.Mesh(BG, BM)
    B2.position.set(0,0,75)
    B2.visible = false
    export const B2C = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    B2C.setFromObject(B2)