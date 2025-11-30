import * as THREE from "three";
// import { GM } from "./mecánicas";
import { CreateItems } from "./Items";

import { 
    insideBoxCollider1, 
    insideBoxCollider2, 
    insideBoxCollider3, 
    insideBoxCollider4, 
    outsideBoxCollider1,
    outsideBoxCollider2,
    outsideBoxCollider3,
    outsideBoxCollider4 
} from "./pista";
import { coneColliders, stars } from "./powerUps";
import { item1_UI, item2_UI } from "./UI";

const shellTexture = new THREE.TextureLoader().load(
    'scr/assets/ojo.png'
);
shellTexture.colorSpace = THREE.SRGBColorSpace;
shellTexture.wrapS = THREE.RepeatWrapping;
shellTexture.wrapT = THREE.RepeatWrapping;

const bodyTexture = new THREE.TextureLoader().load('scr/assets/gomitas.jpg');
bodyTexture.colorSpace = THREE.SRGBColorSpace;
bodyTexture.wrapS = THREE.RepeatWrapping;
bodyTexture.wrapT = THREE.RepeatWrapping;

const wheelTexture = new THREE.TextureLoader().load('scr/assets/ruedas2.jpg');
const wheelNormalMap = new THREE.TextureLoader().load('scr/assets/ruedas2_mapa.png');
wheelTexture.colorSpace = THREE.SRGBColorSpace;
wheelTexture.wrapS = THREE.RepeatWrapping;
wheelTexture.wrapT = THREE.RepeatWrapping;
wheelNormalMap.wrapS = THREE.RepeatWrapping;
wheelNormalMap.wrapT = THREE.RepeatWrapping;

const cabinTexture = new THREE.TextureLoader().load('scr/assets/cristal.png');
cabinTexture.colorSpace = THREE.SRGBColorSpace;
cabinTexture.wrapS = THREE.RepeatWrapping;
cabinTexture.wrapT = THREE.RepeatWrapping;

const doorTexture = new THREE.TextureLoader().load('scr/assets/optra.png');
doorTexture.colorSpace = THREE.SRGBColorSpace;
doorTexture.wrapS = THREE.RepeatWrapping;
doorTexture.wrapT = THREE.RepeatWrapping;

const bombTexture = new THREE.TextureLoader().load('scr/assets/bomb.png');
const bomb_normalTexture = new THREE.TextureLoader().load('scr/assets/bomb_normal.png');

export var GM = false;



class Car{
    constructor(mainColor, rimColor){
        // grafo de construccion de objetos (padres, hijos,  eso)
        this._optra = new THREE.Group();
            this._carroceria = new THREE.Group()
            this._ruedas = new THREE.Group()
        
        this._optra.add(this._carroceria)
        this._optra.add(this._ruedas)


        // creamos el cubo central, la carroceria
        this._bodyGeometry = new THREE.BoxGeometry(3.5, 1.2, 6);
        this._bodyMaterial = new THREE.MeshStandardMaterial({ 
            map: bodyTexture,
            color: mainColor,
            //roughness: 0.4,
            metalness: 0.6
            
        });
        this._body = new THREE.Mesh(this._bodyGeometry, this._bodyMaterial);
        this._body.position.y = 1.5;
        this._body.castShadow = true;
        this._carroceria.add(this._body);
        


        // Cabina
        this._cabinGeometry = new THREE.BoxGeometry(2.2, 1, 2.5);
        this._cabinMaterial = new THREE.MeshStandardMaterial({ 
            map: cabinTexture,
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            side: THREE.DoubleSide
            // roughness: 0.2,
            // metalness: 0.8
        });
        this._cabin = new THREE.Mesh(this._cabinGeometry, this._cabinMaterial);
        this._cabin.position.set(0, 2.3, 1.5);
        this._cabin.castShadow = true;
        this._carroceria.add(this._cabin);
        


        // Ruedas
        this._wheelGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 16);
        this._wheelMaterial = new THREE.MeshStandardMaterial({ 
            map: wheelTexture,
            normalMap: wheelNormalMap,
            color: 0xffffff, // el color base no afecta si usas textura, pero evita negro si algo falla
            metalness: 0.0,
            roughness: 0.8
        });

        this._wheelRimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.55, 6);
        this._wheelRimMaterial = new THREE.MeshStandardMaterial({ 
            color: rimColor,
            // roughness: 0.3,
            // metalness: 0.8
        });

        this._wheelPositions = [
            { x: -2.0, y: 0.9, z: -1.8 }, // delantera izquierda
            { x: 2.0, y: 0.9, z: -1.8 }, // delantera derecha
            { x: -2.0, y: 0.9, z: 1.8 }, // tracera izquierda
            { x: 2.0, y: 0.9, z: 1.8 }, // tracera derecha
        ];

        this._wheelPositions.forEach(pos => {
            this._wheel = new THREE.Mesh(this._wheelGeometry, this._wheelMaterial);
            // wheel.position.set(pos.x, pos.y, pos.z);
            // wheel.rotation.z = Math.PI / 2;
            this._wheel.castShadow = true;

            // cauchos.add(wheel);

            this._wheelRim = new THREE.Mesh(this._wheelRimGeometry, this._wheelRimMaterial);
            this._wheelRim.position.set(pos.x, pos.y, pos.z);
            this._wheelRim.rotation.z = Math.PI / 2;
            this._wheelRim.castShadow = true;
            this._ruedas.add(this._wheelRim);
            this._wheelRim.add(this._wheel)
        });

        this._carLightInside = new THREE.PointLight(0xFFFFFF, 3, 30);
        this._carLightInside.position.set(0, 3, 0);
        this._optra.add(this._carLightInside);

        // luces delanteras
        this._lightGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.2);
        this._lightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
        });

        this._lightPos = [
            { x: -1, y: 1.5, z: -3 },
            { x: 1, y: 1.5, z: -3 },
        ]

        this._lightPos.forEach(pos =>{
            this._frontLight = new THREE.Mesh(this._lightGeometry, this._lightMaterial);
            this._frontLight.position.set(pos.x, pos.y, pos.z);
            this._optra.add(this._frontLight)
        })


        // luces traceras
        this._light2Material = new THREE.MeshBasicMaterial({ 
            color: 0x550000,
        });
        this._lightTPos = [
            { x: -1, y: 1.5, z: 3 },
            { x: 1, y: 1.5, z: 3 },
        ]

        this._lightTPos.forEach(pos =>{
            this._backLightMesh = new THREE.Mesh(this._lightGeometry, this._light2Material);
            this._backLightMesh.position.set(pos.x, pos.y, pos.z);
            this._optra.add(this._backLightMesh)
        })

        


        // puertas
        // const doorWidth = 1.8;
        // const doorHeight = 0.9;
        // const doorThickness = 0.02;

        this._doorGeometry = new THREE.BoxGeometry(0.02, 0.9, 1.8);
        this._doorMaterial = new THREE.MeshStandardMaterial({ 
            map: doorTexture,
            color: 0xffffff,
            roughness: 0.3,
            metalness: 0.7
        });

        this._doorsPos = [
            { x: -(3.5 / 2 + 0.02 / 2), y: 1.5, z: 0 }, // puerta izq
            { x: 3.5 / 2 + 0.02 / 2, y: 1.5, z: 0 }, // puerta der
        ]

        this._doorsPos.forEach(pos =>{
            this._door = new THREE.Mesh(this._doorGeometry, this._doorMaterial);
            this._door.position.set(pos.x, pos.y, pos.z);
            this._door.castShadow = true;
            this._door.receiveShadow = true;
            this._carroceria.add(this._door);
        })



        // colliders
        this._bodyCollider = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this._bodyCollider.setFromObject(this._body);


        // powerUps disponisbles: 0 - caparazones, 1 - bomba
        this._itemType = -1;      // -1 = nada, 0 = shell, 1 = bomba
        this._itemCharges = 0;    // cuántos usos quedan

        // posiciones de los caparazones
        this._rotator = new THREE.Group();
        this._optra.add(this._rotator);

        this._shells = [new Shell(), new Shell(), new Shell()]


        this._launchShellPosGometry = new THREE.BoxGeometry(1,1,1);
        this._launchShellPosMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        this._launchShellPosMesh = new THREE.Mesh(this._launchShellPosGometry, this._launchShellPosMaterial);
        this._launchShellPosMesh.visible = false;
        this._optra.add(this._launchShellPosMesh);
        this._launchShellPosMesh.position.set(0,2,-5);
        
        this._shellsPositions = [
            { x: 0, y: 0, z: -5, id: 0 }, // 1
            { x: 4, y: 0, z: 3, id: 1 }, // 2
            { x: -4, y: 0, z: 3, id: 2 }, // 3
        ]
        this._shellsPositions.forEach(pos=>{
            this._shells[pos.id]._shell.visible = false;
            this._rotator.add(this._shells[pos.id]._shell)
            this._shells[pos.id]._shell.position.set(pos.x, pos.y, pos.z)

        })

        //posicion de la bomba

        this._bomb = new Bomb();
        this._bomb._bombMesh.position.set(0,1,4)
        this._optra.add(this._bomb._bombMesh)
        this._bomb._bombMesh.visible = false

    }

    Update(deltaTime){
        this._bodyCollider.copy(this._body.geometry.boundingBox).applyMatrix4(this._body.matrixWorld)
        this._rotator.rotation.y += deltaTime * 2;
    }
 

    Action() {
        if(this._itemCharges == 1){
            item1_UI.SetVisible(false)
            item2_UI.SetVisible(false)
        }
        if (this._itemCharges < 1){
             return;
        }

        const launchPos = this._launchShellPosMesh.getWorldPosition(new THREE.Vector3());
        // -1 en z se considera alante, si a ese vector lo rotamos con nuestra misma rotacion y lo normalizamos, obtenemos la sireccion
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this._optra.quaternion).normalize();

        if (this._itemType === 0) {
            // console.log("lanza caparazon")
            // lanza un caparazón
            CreateItems(launchPos, forward, this._itemType);
            this._shells[this._itemCharges-1]._shell.visible = false
            this._itemCharges--;

        } else if (this._itemType === 1) {
            // console.log("lanza bomba")
            // lanzar bomba
            CreateItems(launchPos, forward,  this._itemType);
            this._itemCharges--;
        
            this._bomb._bombMesh.visible = false;
        }
        
    }

    Interaction(identificator) {
        
        if (identificator === 0) {
            // triple caparazón 3 cargas
            this._rotator.rotation.y = 0;
            this._itemType = 0;
            this._itemCharges = 3;

        
            this._shellsPositions.forEach(pos => {
                this._shells[pos.id]._shell.visible = true;
            });
            this._bomb._bombMesh.visible = false; // asegurar que no se vea bomba

            // aqui debe actualizar el icono de arriba
            item1_UI.SetVisible(true)
            item2_UI.SetVisible(false)
        } 
        else if (identificator === 1) {
            // 1 carga de bomba
            this._itemType = 1;
            this._itemCharges = 1;

            // mostrar bomba
            this._bomb._bombMesh.visible = true;
            this._shellsPositions.forEach(pos => {
                this._shells[pos.id]._shell.visible = false; 
            });
            
            item1_UI.SetVisible(false)
            item2_UI.SetVisible(true)
        }
    }

    ChangeGodMode(isActive){
        if(isActive){
            this._wheelMaterial.color = new THREE.Color(0xEFB810);
            this._wheelMaterial.roughness = 0.3;
            this._wheelMaterial.metalness = 0.8;

        }
        else{
            this._wheelMaterial.color = new THREE.Color(0x222222);
            this._wheelMaterial.roughness = 1.0;
            this._wheelMaterial.metalness = 0.0;
        }
    }

}

export class Shell{
    constructor(){
        
        // this.type = 'shell';
        this._active = false;
        this._shell = new THREE.Group();
        this._forward = new THREE.Vector3();
        this._speed = 60;
        this._durability = 5;

        this._shellGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 25);
        this._shellMaterial = new THREE.MeshStandardMaterial({ map: shellTexture });
        this._shellMesh = new THREE.Mesh(this._shellGeometry, this._shellMaterial);
        this._shell.add(this._shellMesh);

        //colliders

        this._boxColliderGeometry = new THREE.BoxGeometry(1,1,1)
        
        this._boxColliderMesh = new THREE.Mesh(this._boxColliderGeometry, new THREE.MeshBasicMaterial({ color: 0xFFFFFF }))
        this._boxColliderMesh.visible = false;
        this._shell.add(this._boxColliderMesh)

        this._shellCollider = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this._shellCollider.setFromObject(this._boxColliderMesh)
        
        // this._shellCollider.copy(this._boxColliderMesh.geometry.boundingBox).applyMatrix4(this._boxColliderMesh.matrixWorld)
        

        
        
    }



    Update(deltaTime){
        if (this._active) {
            // this._shellMesh.rotation.y += deltaTime;
        
            const move = this._forward.clone().multiplyScalar(this._speed * deltaTime);
            this._shell.position.add(move);
            this._shellCollider.copy(this._boxColliderMesh.geometry.boundingBox).applyMatrix4(this._boxColliderMesh.matrixWorld)
            

            
            if ((this._shellCollider.intersectsBox(insideBoxCollider1) ||
                this._shellCollider.intersectsBox(insideBoxCollider2) ||
                this._shellCollider.intersectsBox(outsideBoxCollider1) ||
                this._shellCollider.intersectsBox(outsideBoxCollider2))){
                // normales en z
                this._forward.z = -this._forward.z
                // this._forward.x = -this._forward.x
                const move = this._forward.clone().multiplyScalar(this._speed * deltaTime);
                this._shell.position.add(move);
                this._shell.position.add(move);
                this._durability--
            }
            else if ((this._shellCollider.intersectsBox(insideBoxCollider3) ||
                this._shellCollider.intersectsBox(insideBoxCollider4) ||
                this._shellCollider.intersectsBox(outsideBoxCollider3) ||
                this._shellCollider.intersectsBox(outsideBoxCollider4))){
                // normales en x
                // this._forward.z = -this._forward.z
                this._forward.x = -this._forward.x
                const move = this._forward.clone().multiplyScalar(this._speed * deltaTime);
                this._shell.position.add(move);
                this._shell.position.add(move);
                this._durability--
            }
            for (let i=0; i<coneColliders.length; i++){
                if (this._shellCollider.intersectsBox(coneColliders[i])){
                    this._durability = 0;
                    stars[i].visible = false
                    stars[i].position.y = -20
                    
               
                    
                    
                }
            }

        }
    }
}

export class Bomb {
    constructor() {
        // this.type = 'bomb';
        this._bombGeometry = new THREE.SphereGeometry(1);
        this._bombMaterial = new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.4, map: bombTexture});
        this._bombMesh = new THREE.Mesh(this._bombGeometry, this._bombMaterial);
        this._bombMaterial.normalMap = bomb_normalTexture

        this._timeAlive = 0;
        this._fase2 = false;
        this._forward = new THREE.Vector3();
        this._speed = 80;
        this._active = false; 
        this._durability = 2.7;
        this._vo = 0.5  
        this._g = 2;
    }

    Update(deltaTime) {
        if (!this._active) return;

        // mueve la bomba (temporal)
        
       
        // console.log(this._bombMesh.position.y )

        if(this._bombMesh.position.y < 0){
            this._bombMesh.scale.set(10, 10, 10);
            this._bombMaterial.color.setHex(0xFF1100); // explosion roja
            
            this._bombMaterial.opacity -= deltaTime*0.5 
            this._bombMaterial.roughness = 0.9
            this._vo = 0
        }
        else{
            this._bombMesh.position.add(this._forward.clone().multiplyScalar(this._speed * deltaTime));
            this._bombMesh.position.y += this._vo
            this._vo -= deltaTime; 
        }
        
        this._durability -= deltaTime;
        
    }
}

window.addEventListener('keydown', (e) => {
    
    if (e.key == 'g'||e.key == 'G'){
        
        GM = !GM;
        console.log(carritoRosa._optra.getWorldDirection(new THREE.Vector3()))
        carritoRosa.ChangeGodMode(GM)
    }
    if (e.key == '1' && GM){
        carritoRosa.Interaction(0);
    }
    if (e.key == '2' && GM){
        carritoRosa.Interaction(1);
    }
    if(e.key == ' '){
        carritoRosa.Action();
    }


}, false);




export const carroGenerico = new Car(0xFFFFFF, 0xFFFFFF);
export const carroGenerico2 = new Car(0xFFFFFF, 0xFFFFFF);
export const carritoRosa = new Car(0xFF69B4, 0xFFB6C1);

export function UpdateCars(deltaTime){
    carritoRosa.Update(deltaTime);
    carroGenerico.Update(deltaTime);
    carroGenerico2.Update(deltaTime);

    
}