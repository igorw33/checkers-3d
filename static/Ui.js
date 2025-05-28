class Ui {
    constructor() {
        this.input = document.getElementById("btn")
        this.resett = document.getElementById("reset")
        this.root = document.getElementById("root")
        this.input.addEventListener("click", function () {
            this.username = document.getElementById("username").value
            net.send(this.username)
        })
        this.resett.addEventListener("click", function () {
            net.reset()
        })
        this.root.addEventListener("click", function (event) {
            game.boardClick(event)
        })
    }
}