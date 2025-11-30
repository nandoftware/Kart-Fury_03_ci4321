import * as THREE from "three";

// import { UpdateCollidersCars } from "./carritorosa";
import { 
    CheckcollisionsPW,
} from "./powerUps";

import { CheckCollisionsStars } from "./powerUps.js";


// export function UpdateCollidersPos(){
//     UpdateCollidersCars();
// }

let count = 0;
export function Checkcollisions(deltaTime){
    count += deltaTime;
    if(count > .2){
        CheckcollisionsPW();
        CheckCollisionsStars();
        count = 0;
    }
    
}
