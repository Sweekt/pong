let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

//function nextPos()

let i = 0;
let dir = true;
let speed = 1;

function animateBall() {
    let pos = {x: canvas.width * (i / 100), y: canvas.height / 2};
    // Remplir le fond
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dessiner la balle
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
    ctx.fill();
    // Mise à jour de la position
    if (dir) i += speed;
    else i-= speed;
    // Inversion de la direction
    if (i >= 100) dir = false;
    else if (i <= 0) dir = true;
    // Relance l'animation à chaque frame
    requestAnimationFrame(animateBall);
}

animateBall();
let socket = new WebSocket("ws://localhost:8080");
socket.onopen = function () { return console.log("Connected to server"); };
socket.onmessage = function (event) { return console.log("Message from server: ".concat(event.data)); };
socket.onclose = function () { return console.log("Disconnected"); };
