import * as THREE from "three";

class CurrentItem{
    constructor(path){
        this.itemMap = new THREE.TextureLoader().load(path)
        this.mapMateral = new THREE.SpriteMaterial({map:this.itemMap})
        this.item = new THREE.Sprite(this.mapMateral)
        this.item.visible = false
        
    }
    
    SetPositionCamera0(x,y,z){
        this.item.position.set(x,y,z)
    }
    SetVisible(bool){
        this.item.visible = bool
    }
    SetScale(x,y,z){
        this.item.scale.set(x,y,z)
    }
}



class Points{
    constructor(){
 
        this.currentTile = 16
        this.tileHoriz = 15 // 20 px por fila
        this.tileVert = 8 // 20 px por columna

        this.itemMap = new THREE.TextureLoader().load('scr/assets/letras.png')
        this.itemMap.magFilter = THREE.NearestFilter
        this.itemMap.repeat.set(1/this.tileHoriz,1/this.tileVert)

        this.offsetX = (this.currentTile % this.tileHoriz) / this.tileHoriz
        this.offsetY = (this.tileVert - Math.floor(this.currentTile / this.tileHoriz) - 1) / this.tileVert

        this.itemMap.offset.x = this.offsetX
        this.itemMap.offset.y = this.offsetY 

        this.mapMateral = new THREE.SpriteMaterial({map:this.itemMap})
        this.item = new THREE.Sprite(this.mapMateral)
        this.item.scale.set(0.5, 0.5, 0.5)
        
        
    }
    
    SetPositionCamera0(x,y,z){
        this.item.position.set(x,y,z)
    }
    SetIndex(i){
        this.currentTile = i
        this.offsetX = (this.currentTile % this.tileHoriz) / this.tileHoriz
        this.offsetY = (this.tileVert - Math.floor(this.currentTile / this.tileHoriz) - 1) / this.tileVert
        this.itemMap.offset.x = this.offsetX
        this.itemMap.offset.y = this.offsetY 
    }
    SetColor(hex){
        this.mapMateral.color.setHex(hex)
    }
}


export const item1_UI = new CurrentItem('scr/assets/triple ojo.png')
export const item2_UI = new CurrentItem('scr/assets/bomba.png')
export const panel_UI = new CurrentItem('scr/assets/PANEL.png')
panel_UI.SetVisible(true)
panel_UI.SetScale(1.1, 1.1, 1)


export const K = new Points()
export const M = new Points()
export const C5 = new Points()
export const C6 = new Points()
export const C7 = new Points()




export const P = new Points()
export const T = new Points()
export const S = new Points()
export const SPACE = new Points()
export const C1 = new Points()
export const C2 = new Points()
export const C3 = new Points()
export const C4 = new Points()

K.SetIndex(43)
K.SetColor(0xFF0040)
M.SetIndex(45)
M.SetColor(0xFF0040)
C5.SetColor(0x00EFFF)
C6.SetColor(0x00EFFF)
C7.SetColor(0x00EFFF)

P.SetIndex(48)
P.SetColor(0xFFDE21)
T.SetIndex(52)
T.SetColor(0xFFDE21)
S.SetIndex(51)
S.SetColor(0xFFDE21)
SPACE.SetIndex(0)
SPACE.SetColor(0xFFDE21)
C1.SetIndex(16)
C1.SetColor(0xFFDE21)
C2.SetIndex(16)
C2.SetColor(0xFFDE21)
C3.SetIndex(16)
C3.SetColor(0xFFDE21)
C4.SetIndex(16)
C4.SetColor(0xFFDE21)

