const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

function draw() {
    ctx.fillStyle = "black"; // Fond noir (si non transparent)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white"; // Dessiner la balle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
    ctx.fill();
}

draw();

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => console.log("Connected to server");
socket.onmessage = (event) => console.log(`Message from server: ${event.data}`);
socket.onclose = () => console.log("Disconnected");
