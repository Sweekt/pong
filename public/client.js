let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateBall() {
    let i = 0;
    let dir = true;
    while (true) {
        let x = canvas.width * (i / 100);
        let y = canvas.height / 2;

        ctx.fillStyle = "black"; // Fond noir
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "cyan"; // Dessiner la balle
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        await sleep(20);

        if (dir === true)
            i++;
        else
            i--;
        if (i === 100)
            dir = false;
        else if (i === 0)
            dir = true;
    }
}

animateBall();
let socket = new WebSocket("ws://localhost:8080");
socket.onopen = function () { return console.log("Connected to server"); };
socket.onmessage = function (event) { return console.log("Message from server: ".concat(event.data)); };
socket.onclose = function () { return console.log("Disconnected"); };
