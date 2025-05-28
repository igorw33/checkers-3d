class Net {
    send(username) {
        let body = {
            user: username,
        }
        body = JSON.stringify(body)
        console.log(body)
        fetch("/ADD_USER", { method: "post", body })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.user != undefined) {
                    document.getElementById("container").innerHTML = ""
                    var info = document.createElement("div")
                    info.id = "info"
                    document.body.appendChild(info)
                    document.getElementById("info").innerText = "Twój username - " + data.user + "."
                    if (data.which == 1) {
                        let player = "one"
                        globalThis.player = player
                        document.getElementById("info").innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Grasz <div style='color: white; display: inline-block';>białymi."
                    }
                    else if (data.which == 2) {
                        let player = "two"
                        globalThis.player = player
                        document.getElementById("info").innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Grasz <div style='color: black; display: inline-block';>czarnymi."
                        game.secondPlayerPos()
                    }
                    var wait = document.createElement("div")
                    let loader = document.createElement("div")
                    loader.id = "loader"
                    wait.id = "wait"
                    wait.innerHTML = "Czekaj na drugiego gracza"
                    document.getElementById("container").appendChild(wait)
                    document.getElementById("container").appendChild(loader)
                    game.addPeons()
                    var sprawdzanie = setInterval(function () {
                        fetch("/CHECK_USERS", { method: "post" })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                if (data == "Koniec") {
                                    document.body.removeChild(document.getElementById("startingBg"))
                                    document.body.removeChild(document.getElementById("container"))
                                    if (player == "one") {
                                        net.timeCheck()
                                    }
                                    clearInterval(sprawdzanie)
                                }
                            })
                            .catch(error => console.log(error))
                    }, 500);
                }
                else {
                    alert(data)
                }
            })
            .catch(error => console.log(error))
    }

    reset() {
        fetch("/RESET", { method: "post" })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                alert(data)
            })
            .catch(error => console.log(error))
    }

    updateTab(oldX, oldZ, newX, newZ, colorr, oldPospx, newXpx, newZpx, toRemoveX, toRemoveZ) {
        let body = {
            oldX: oldX,
            oldZ: oldZ,
            newX: newX,
            newZ: newZ,
            color: colorr,
            oldPospx: oldPospx,
            newXpx: newXpx,
            newZpx: newZpx,
            toRemoveX: toRemoveX,
            toRemoveZ: toRemoveZ
        }
        body = JSON.stringify(body)
        fetch("/TAB_UPDATE", { method: "post", body })
            .then(response => response.json())
            .then(data => {
                game.pionki = data
                console.table(data)
            })
            .catch(error => console.log(error))
    }
    timeCheck() {
        let tmchk = setInterval(function () {
            globalThis.tmchk = tmchk
            fetch("/TIME_CHECK", { method: "post" })
                .then(response => response.json())
                .then(data => {
                    // console.log(data)
                    if (data == "TimeEnd") {
                        let container = document.createElement("div")
                        let bg = document.createElement("div")
                        let wait = document.createElement("div")
                        container.id = "container"
                        wait.id = "wait"
                        bg.id = "latterBg"
                        container.appendChild(wait)
                        document.body.appendChild(bg)
                        document.body.appendChild(container)
                        wait.innerHTML = "Przegrałeś - nie wykonałeś ruchu w 30 sekundach"
                        clearInterval(tmchk)
                    }
                })
                .catch(error => console.log(error))
        }, 100);
    }
    moveDone() {
        clearInterval(tmchk)
    }
    checkTab() {
        let container = document.createElement("div")
        let bg = document.createElement("div")
        let wait = document.createElement("div")
        let clock = document.createElement("div")
        container.id = "container"
        wait.id = "wait"
        bg.id = "latterBg"
        clock.id = "clock"
        clock.innerHTML = "30"
        wait.innerHTML = "Czekaj na ruch drugiego gracza"
        container.appendChild(wait)
        container.appendChild(clock)
        document.body.appendChild(bg)
        document.body.appendChild(container)
        let chk = setInterval(function () {
            fetch("/TAB_CHECK", { method: "post" })
                .then(response => response.json())
                .then(data => {
                    if (data == "TimeEnd") {
                        clock.innerHTML = ""
                        wait.innerHTML = "Wygrałeś - twój przeciwnik nie wykonał ruchu"
                        clearInterval(chk)
                    } else if (data.message != "") {
                        if (data.message == "Czarny wygrywa - wszystkie białe pionki zostały zbite") {
                            clock.innerHTML = ""
                            game.pionki = data.tab
                            fetch("/GET_LAST_MOVE", { method: "post" })
                                .then(response => response.json())
                                .then(data => {
                                    // console.log(data)
                                    game.peonMove(data)
                                })
                                .catch(error => console.log(error))
                            game.peonMove(data)
                            wait.innerHTML = data.message
                            clearInterval(chk)
                        } else if (data.message == "Biały wygrywa - wszystkie czarne pionki zostały zbite") {
                            clock.innerHTML = ""
                            game.pionki = data.tab
                            fetch("/GET_LAST_MOVE", { method: "post" })
                                .then(response => response.json())
                                .then(data => {
                                    // console.log(data)
                                    game.peonMove(data)
                                })
                                .catch(error => console.log(error))
                            game.peonMove(data)
                            wait.innerHTML = data.message
                            clearInterval(chk)
                        } else if (data.message == "Biały wygrywa - pionek dotarł na ostatnie pole") {
                            clock.innerHTML = ""
                            game.pionki = data.tab
                            fetch("/GET_LAST_MOVE", { method: "post" })
                                .then(response => response.json())
                                .then(data => {
                                    // console.log(data)
                                    game.peonMove(data)
                                })
                                .catch(error => console.log(error))
                            game.peonMove(data)
                            wait.innerHTML = data.message
                            clearInterval(chk)
                        } else if (data.message == "Czarny wygrywa - pionek dotarł na ostatnie pole") {
                            clock.innerHTML = ""
                            game.pionki = data.tab
                            fetch("/GET_LAST_MOVE", { method: "post" })
                                .then(response => response.json())
                                .then(data => {
                                    // console.log(data)
                                    game.peonMove(data)
                                })
                                .catch(error => console.log(error))
                            game.peonMove(data)
                            wait.innerHTML = data.message
                            clearInterval(chk)
                        }
                    } else {
                        clock.innerHTML = 30 - Math.floor(data.time)
                        if (30 - Math.floor(data.time) < 10) {
                            clock.style.left = "40%"
                        } else {
                            clock.style.left = "35%"
                        }
                        if (JSON.stringify(game.pionki) != JSON.stringify(data.tab)) {
                            fetch("/GET_LAST_MOVE", { method: "post" })
                                .then(response => response.json())
                                .then(data => {
                                    // console.log(data)
                                    game.peonMove(data)
                                })
                                .catch(error => console.log(error))
                            document.body.removeChild(document.getElementById("latterBg"))
                            document.body.removeChild(document.getElementById("container"))
                            game.pionki = data.tab
                            console.table(game.pionki)
                            net.timeCheck()
                            clearInterval(chk)
                        }
                    }
                })
                .catch(error => console.log(error))
        }, 100);
    }
}