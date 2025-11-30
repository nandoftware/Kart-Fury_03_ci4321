import * as THREE from "three";
import { Shell, Bomb } from "./carritorosa";
import { scene } from "./main";
// import { limits } from "./mecánicas";


var itemsInGame = [];


export function UpdateItems(deltaTime) {
    for (let i = itemsInGame.length - 1; i >= 0; i--) {
        const item = itemsInGame[i];
        item.Update(deltaTime);

        // aplicar rebote si hay colisión con paredes
        // checkItemCollisionAndBounce(item);
        if (item._durability <= 0) {

            try{
                item._bombMesh.visible = false
                scene.remove(item._bombMesh);

            }
            catch{
                item._shell.visible = false
                scene.remove(item._shell);
            }
            
            itemsInGame.splice(i, 1);
            
        }
        
    }
}


export function CreateItems(pos, direction, tipo) {
    let newItem;

    if (tipo === 0) {
        newItem = new Shell();
        newItem._active = true;
        newItem._forward = direction.clone(); 
        newItem._shell.position.copy(pos);
        scene.add(newItem._shell);
    } else if (tipo === 1) {
        newItem = new Bomb();
        newItem._active = true;
        console.log(direction)
        newItem._forward = direction.clone();
        newItem._bombMesh.position.copy(pos);
        scene.add(newItem._bombMesh);
    }

    
    itemsInGame.push(newItem);
    
}
