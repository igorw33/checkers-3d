var express = require("express")
var app = express()
const PORT = 3000;
app.use(express.static('static'))

var users = [];
let currentTab = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];
let lastMove = {}
let startDate = Date.now()

app.post("/ADD_USER", (req, res) => {
    let body = {}
    req.on("data", function (data) {
        body = JSON.parse(data);
    })
    req.on("end", function () {
        if (users.length >= 2) {
            console.log("nie można dodać - za dużo userów")
            res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
            res.end(JSON.stringify("error - nie można dodać, za dużo userów", null, 5))
        }
        else {
            if (users.length == 0) {
                users.push(body.user)
                body.which = 1
                console.log(users)
                res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
                res.end(JSON.stringify(body, null, 5));
            }
            else if (users.length == 1) {
                if (users[0] == body.user) {
                    console.log("nie można dodać - jest już taki username")
                    res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                    res.end(JSON.stringify("error - nie można dodać, jest już tak username", null, 5))
                }
                else {
                    users.push(body.user)
                    console.log(users)
                    body.which = 2
                    res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
                    res.end(JSON.stringify(body, null, 5));
                }
            }
        }
    });
})

app.post("/RESET", (req, res) => {
    users = []
    currentTab = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
    ];
    console.log("Tablica została wyczyszczona")
    console.log(users)
    res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
    res.end(JSON.stringify("Tablica została wyczyszczona", null, 5));
})

app.post("/CHECK_USERS", (req, res) => {
    startDate = Date.now()
    console.log("sprawdzam ilość userów...")
    console.log(users)
    if (users.length == 2) {
        res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        res.end(JSON.stringify("Koniec", null, 5));
    }
    else {
        res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        res.end(JSON.stringify("Czekaj na drugiego gracza", null, 5));
    }
})

app.post("/TAB_UPDATE", (req, res) => {
    let body = {}
    startDate = Date.now()
    req.on("data", function (data) {
        body = JSON.parse(data);
        lastMove = body
    })
    req.on("end", function () {
        currentTab[body.oldX][body.oldZ] = 0
        if (body.color == 180) {
            currentTab[body.newX][body.newZ] = 1
        }
        else if (body.color == -180) {
            currentTab[body.newX][body.newZ] = 2
        }
        if (body.toRemoveX != -100 && body.toRemoveZ != -100) {
            currentTab[body.toRemoveX][body.toRemoveZ] = 0
        }
        res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
        res.end(JSON.stringify(currentTab, null, 5));
    })
})

app.post("/TAB_CHECK", (req, res) => {
    let whiteCounter = 0
    let blackCounter = 0
    let whiteOnLast = 0
    let blackOnLast = 0
    currentTab.forEach(element => {
        element.forEach(element2 => {
            if (element2 == 1) {
                blackCounter += 1
            }
            else if (element2 == 2) {
                whiteCounter += 1
            }
        });
    });
    currentTab[0].forEach(element => {
        if (element == 1) {
            whiteOnLast = 1
        }
    });
    currentTab[7].forEach(element => {
        if (element == 2) {
            blackOnLast = 1
        }
    });
    let obj = {
        tab: currentTab,
        time: (Date.now() - startDate) / 1000,
        message: ""
    }
    if (obj.time >= 30) {
        res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        res.end(JSON.stringify("TimeEnd"));
    } else if (whiteCounter == 0) {
        obj.message = "Czarny wygrywa - wszystkie białe pionki zostały zbite"
        res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
        res.end(JSON.stringify(obj));
    } else if (blackCounter == 0) {
        obj.message = "Biały wygrywa - wszystkie czarne pionki zostały zbite"
        res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
        res.end(JSON.stringify(obj));
    } else if (whiteOnLast == 1) {
        obj.message = "Czarny wygrywa - pionek dotarł na ostatnie pole"
        res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
        res.end(JSON.stringify(obj));
    } else if (blackOnLast == 1) {
        obj.message = "Biały wygrywa - pionek dotarł na ostatnie pole"
        res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
        res.end(JSON.stringify(obj));
    }
    else {
        res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
        res.end(JSON.stringify(obj));
    }
})

app.post("/GET_LAST_MOVE", (req, res) => {
    res.writeHead(200, { "Content-type": "application/json;charset=utf-8" });
    res.end(JSON.stringify(lastMove));
})

app.post("/TIME_CHECK", (req, res) => {
    res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
    if ((Date.now() - startDate) / 1000 >= 30) {
        res.end(JSON.stringify("TimeEnd"));
    }
    else {
        res.end(JSON.stringify((Date.now() - startDate) / 1000));
    }
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})