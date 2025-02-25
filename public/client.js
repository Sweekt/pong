var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
function draw() {
    ctx.fillStyle = "black"; // Fond noir (si non transparent)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white"; // Dessiner la balle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
    ctx.fill();
}
draw();
var socket = new WebSocket("ws://localhost:8080");
socket.onopen = function () { return console.log("Connected to server"); };
socket.onmessage = function (event) { return console.log("Message from server: ".concat(event.data)); };
socket.onclose = function () { return console.log("Disconnected"); };
