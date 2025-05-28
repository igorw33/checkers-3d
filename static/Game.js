let current = 0
class Game {

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.updateProjectionMatrix();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x150050);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);

        this.camera.position.set(-180, 100, 0)
        this.camera.lookAt(0, 0, 0);
        this.axes = new THREE.AxesHelper(1000)
        this.scene.add(this.axes)


        this.szachownica = [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]

        ];

        this.pionki = [

            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]

        ];
        this.geometry = new THREE.BoxGeometry(20, 5, 20);
        this.board = new THREE.Group();
        for (var x = -4; x < 4; x++) {
            for (var z = -4; z < 4; z++) {
                if (this.szachownica[x + 4][z + 4] == 1) {
                    this.material = new THREE.MeshBasicMaterial({
                        color: 0x4d5d53,
                        map: new THREE.TextureLoader().load('img/wood.jpg'),
                        side: THREE.DoubleSide,
                        wireframe: false,
                    });
                    this.cc = "black"
                }
                else {
                    this.material = new THREE.MeshBasicMaterial({
                        map: new THREE.TextureLoader().load('img/wood.jpg'),
                        color: 0xFFFFFF,
                        side: THREE.DoubleSide,
                        wireframe: false,
                    });
                    this.cc = "white"
                }
                this.cube = new THREE.Mesh(this.geometry, this.material);
                this.cube.position.set(x * 20 + 10, 0, z * -20 - 10)
                this.cube.posx = x + 4
                this.cube.posz = z + 4
                this.cube.cc = this.cc
                this.board.add(this.cube)
            }
        }
        this.scene.add(this.board)

        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()

        this.render() // wywołanie metody render

    }

    secondPlayerPos = () => {
        net.checkTab()
        this.camera.position.set(180, 100, 0)
        this.camera.lookAt(0, 0, 0);
    }

    addPeons() {
        for (let x = -4; x < 4; x++) {
            for (let z = -4; z < 4; z++) {
                this.pionek = new Pionek()
                if (this.pionki[x + 4][z + 4] == 1) {
                    this.pionek.changeColor(0xff0000)
                    this.pionek.posx = x + 4
                    this.pionek.posz = z + 4
                }
                else if (this.pionki[x + 4][z + 4] == 2) {
                    this.pionek.changeColor(0xFFDEAD)
                    this.pionek.posx = x + 4
                    this.pionek.posz = z + 4
                }
                if (this.pionki[x + 4][z + 4] != 0) {
                    this.pionek.changePosX(x * 20 + 10)
                    this.pionek.changePosZ(z * -20 - 10)
                    this.scene.add(this.pionek)
                }
            }
        }
    }

    boardClick(event) {
        this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        console.log(intersects.length)
        if (intersects.length > 0) {
            console.log(intersects[0].object);
            if (intersects[0].object.geometry.type == "CylinderGeometry" && this.camera.position.x == -180) {
                if (intersects[0].object.getColor().g != 0) {
                    if (current != 0) {
                        current.changeColor(0xFFDEAD)
                    }
                    intersects[0].object.changeColor(0x000000)
                    current = intersects[0].object
                    this.board.children.forEach(element => {
                        if (element.cc == "black") {
                            element.material.color.setHex(0x4d5d53)
                        }
                        else if (element.cc = "white") {
                            element.material.color.setHex(0xFFFFFF)
                        }
                    })
                    game.handleWhite(current)
                }
            }
            else if (intersects[0].object.geometry.type == "CylinderGeometry" && this.camera.position.x == 180) {
                if (intersects[0].object.getColor().g == 0) {
                    if (current != 0) {
                        current.changeColor(0xff0000)
                    }
                    intersects[0].object.changeColor(0x000000)
                    current = intersects[0].object
                    this.board.children.forEach(element => {
                        if (element.cc == "black") {
                            element.material.color.setHex(0x4d5d53)
                        }
                        else if (element.cc = "white") {
                            element.material.color.setHex(0xFFFFFF)
                        }
                    })
                    game.handleBlack(current)
                }
            }
            if (intersects[0].object.geometry.type == "BoxGeometry" && intersects[0].object.material.color.r == 0.050980392156862744 && current != 0) {
                let toRemoveX = -100
                let toRemoveZ = -100
                if (intersects[0].object.posx - current.posx == 2 || intersects[0].object.posx - current.posx == -2) {
                    new TWEEN.Tween(current.position)
                        .to({ x: intersects[0].object.position.x, z: intersects[0].object.position.z }, 500)
                        .repeat(0)
                        .easing(TWEEN.Easing.Elastic.InOut)
                        .onComplete(this.scene.children.forEach(element => {
                            if (element.type == "Mesh") {
                                if (element.geometry.type == "CylinderGeometry") {
                                    if (element.posx == ((current.posx + intersects[0].object.posx) / 2) && element.posz == ((current.posz + intersects[0].object.posz) / 2)) {
                                        this.scene.remove(element)
                                        toRemoveX = element.posx
                                        toRemoveZ = element.posz
                                        this.szachownica[element.posx][element.posz] = 0
                                    }
                                }
                            }
                        }))
                        .start()
                }
                else {
                    new TWEEN.Tween(current.position)
                        .to({ x: intersects[0].object.position.x, z: intersects[0].object.position.z }, 500)
                        .repeat(0)
                        .easing(TWEEN.Easing.Bounce.Out)
                        .start()
                }
                net.updateTab(current.posx, current.posz, intersects[0].object.posx, intersects[0].object.posz, this.camera.position.x, current.position, intersects[0].object.position.x, intersects[0].object.position.z, toRemoveX, toRemoveZ)
                current.posx = intersects[0].object.posx
                current.posz = intersects[0].object.posz
                if (this.camera.position.x == -180) {
                    current.changeColor(0xFFDEAD)
                    current = 0
                }
                else if (this.camera.position.x == 180) {
                    current.changeColor(0xff0000)
                    current = 0
                }
                this.board.children.forEach(element => {
                    if (element.cc == "black") {
                        element.material.color.setHex(0x4d5d53)
                    }
                    else if (element.cc = "white") {
                        element.material.color.setHex(0xFFFFFF)
                    }
                })
                net.moveDone()
                net.checkTab()
            }
        }
    }

    peonMove(data) {
        console.log(data)
        let toMove
        this.scene.children.forEach(element => {
            if (element.posx == data.oldX && element.posz == data.oldZ) {
                toMove = element
                toMove.posx = data.newX
                toMove.posz = data.newZ
            }
        });
        if (data.newX - data.oldX == 2 || data.newX - data.oldX == -2) {
            new TWEEN.Tween(toMove.position)
                .to({ x: data.newXpx, z: data.newZpx }, 500)
                .repeat(0)
                .easing(TWEEN.Easing.Elastic.InOut)
                .onComplete(
                    this.scene.children.forEach(element => {
                        if (element.type == "Mesh") {
                            if (element.geometry.type == "CylinderGeometry") {
                                if (element.posx == ((data.newX + data.oldX) / 2) && element.posz == ((data.newZ + data.oldZ) / 2)) {
                                    this.scene.remove(element)
                                    this.szachownica[element.posx][element.posz] = 0
                                }
                            }
                        }
                    }))
                .start()
        }
        else {
            new TWEEN.Tween(toMove.position)
                .to({ x: data.newXpx, z: data.newZpx }, 500)
                .repeat(0)
                .easing(TWEEN.Easing.Bounce.Out)
                .start()
        }
    }

    handleWhite() {
        console.log(current.posx)
        console.log(current.posz)

        this.board.children.forEach(element => {
            let peonCheck = 0
            if (element.geometry.type == "BoxGeometry" && element.posx == current.posx + 1 && (element.posz == current.posz + 1 || element.posz == current.posz - 1)) {
                let availableMove = element
                this.scene.children.forEach(element2 => {
                    if (element2.type == "Mesh") {
                        if (element2.geometry.type == "CylinderGeometry") {
                            if (element2.posx == availableMove.posx && element2.posz == availableMove.posz) {
                                if (element2.getColor().g != 0) {
                                    peonCheck = 1
                                }
                                else {
                                    peonCheck = 2
                                }
                            }
                        }
                    }
                })
                switch (peonCheck) {
                    case 0:
                        element.material.color.setHex(0x0d25fc)
                        break
                    case 2:
                        let toCheckx = -100
                        let toCheckz = -100
                        if (element.posz == current.posz + 1) {
                            toCheckx = current.posx + 2
                            toCheckz = current.posz + 2
                        }
                        else if (element.posz == current.posz - 1) {
                            toCheckx = current.posx + 2
                            toCheckz = current.posz - 2
                        }
                        if (toCheckx < 8 && toCheckz < 8 && toCheckz > -1) {
                            if (this.pionki[toCheckx][toCheckz] == 0) {
                                this.board.children.forEach(element3 => {
                                    if (element3.posx == toCheckx && element3.posz == toCheckz) {
                                        element3.material.color.setHex(0x0d25fc)
                                    }
                                })
                            }
                        }
                        break
                }
            }
        })
    }

    handleBlack() {
        console.log(current.posx)
        console.log(current.posz)
        this.board.children.forEach(element => {
            let peonCheck = 0
            if (element.geometry.type == "BoxGeometry" && element.posx == current.posx - 1 && (element.posz == current.posz + 1 || element.posz == current.posz - 1)) {
                let availableMove = element
                this.scene.children.forEach(element2 => {
                    if (element2.type == "Mesh") {
                        if (element2.geometry.type == "CylinderGeometry") {
                            if (element2.posx == availableMove.posx && element2.posz == availableMove.posz) {
                                if (element2.getColor().g == 0) {
                                    peonCheck = 1
                                }
                                else {
                                    peonCheck = 2
                                }
                            }
                        }
                    }
                })
                switch (peonCheck) {
                    case 0:
                        element.material.color.setHex(0x0d25fc)
                        break
                    case 2:
                        let toCheckx = -100
                        let toCheckz = -100
                        if (element.posz == current.posz + 1) {
                            toCheckx = current.posx - 2
                            toCheckz = current.posz + 2
                        }
                        else if (element.posz == current.posz - 1) {
                            toCheckx = current.posx - 2
                            toCheckz = current.posz - 2
                        }
                        if (toCheckx > -1 && toCheckz < 8 && toCheckz > -1) {
                            if (this.pionki[toCheckx][toCheckz] == 0) {
                                this.board.children.forEach(element3 => {
                                    if (element3.posx == toCheckx && element3.posz == toCheckz) {
                                        element3.material.color.setHex(0x0d25fc)
                                    }
                                })
                            }
                        }
                        break
                }
            }
        })
    }

    render = () => {
        requestAnimationFrame(this.render);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();
        // console.log("render leci")
    }
}