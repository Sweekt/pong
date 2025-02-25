const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
}
draw();
const socket = new WebSocket("ws://localhost:8080");
socket.onopen = () => console.log("Connected to server");
socket.onmessage = (event) => console.log(`Message from server: ${event.data}`);
socket.onclose = () => console.log("Disconnected");
export {};
