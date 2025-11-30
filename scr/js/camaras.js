import * as THREE from "three";
import { camaras } from "./main";
import {
    item1_UI, item2_UI, panel_UI,
    K, M, C5, C6, C7,
    P,T,S,SPACE,C1,C2,C3,C4,
    

} from "./UI.js"


var indice = 0;


export function UpdateCamra(rend, sce){
    rend.render(sce, camaras[indice]);
}

window.addEventListener('keyup', (e) => {
    
    if (e.key == 't'||e.key == 'T'){
        indice = indice + 1;
        
    }
    if (indice > 2){
        indice = 0;
    }
    
    Adj_UI(indice)
    
}, false);

function Adj_UI(i){
    console.log("hola")
    camaras[i].add(item1_UI.item)   
    camaras[i].add(item2_UI.item)
    camaras[i].add(panel_UI.item)

    camaras[i].add(K.item)
    camaras[i].add(M.item)
    camaras[i].add(C5.item)
    camaras[i].add(C6.item)
    camaras[i].add(C7.item)


    camaras[i].add(P.item)
    camaras[i].add(T.item)
    camaras[i].add(S.item)
    camaras[i].add(SPACE.item)
    camaras[i].add(C1.item)
    camaras[i].add(C2.item)
    camaras[i].add(C3.item)
    camaras[i].add(C4.item)
}
