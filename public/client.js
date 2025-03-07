let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let speed = 10;
let pos = {x : 0, y: 0};
let angle = -1;

function nextPos() {
    pos.x += Math.cos(angle) * speed;
    pos.y += Math.sin(angle) * speed;
    if (pos.x > canvas.width) {
        pos.x = canvas.width - (pos.x - canvas.width);
        angle = Math.PI - angle;
    }
    else if (pos.x < 0) {
        pos.x = -pos.x;
        angle = Math.PI - angle;
    }
    if (pos.y > canvas.height) {
        pos.y = canvas.height - (pos.y - canvas.height);
        angle = 2 * Math.PI - angle;
    }
    else if (pos.y < 0) {
        pos.y = -pos.y;
        angle = 2 * Math.PI - angle;
    }
}

function animateBall() {
    // let pos = {x: canvas.width * (i / 100), y: canvas.height / 2};
    // Remplir le fond
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dessiner la balle
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
    ctx.fill();
    nextPos();
    // Relance l'animation à chaque frame
    requestAnimationFrame(animateBall);
}

animateBall();
let socket = new WebSocket("ws://localhost:8080");
socket.onopen = function () { return console.log("Connected to server"); };
socket.onmessage = function (event) { return console.log("Message from server: ".concat(event.data)); };
socket.onclose = function () { return console.log("Disconnected"); };
