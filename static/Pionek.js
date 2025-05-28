class Pionek extends THREE.Mesh {

    constructor() {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.geometry = new THREE.CylinderGeometry(8, 8, 8, 64);
        this.position.y = 5
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('img/white.jpg'), // plik tekstury
        })
    }

    changeColor(newColor) {
        this.material.color = new THREE.Color(newColor)
    }
    changePosX(newPos) {
        this.position.x = newPos
    }
    changePosZ(newPos) {
        this.position.z = newPos
    }
    getColor() {
        return this.material.color
    }
}