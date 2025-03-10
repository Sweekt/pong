let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

class Ball {
    constructor(x, y, angle, speed, radius, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.radius = radius;
        this.color = color;
    }
}

// class Paddle {
//     constructor()
// }

let ball = new Ball(0, 0, -1, 10, 10, "cyan");

function nextPos() {
    ball.x += Math.cos(ball.angle) * ball.speed;
    ball.y += Math.sin(ball.angle) * ball.speed;
    if (ball.x > canvas.width) {
        ball.x = canvas.width - (ball.x - canvas.width);
        ball.angle = Math.PI - ball.angle;
    }
    else if (ball.x < 0) {
        ball.x = -ball.x;
        ball.angle = Math.PI - ball.angle;
    }
    if (ball.y > canvas.height) {
        ball.y = canvas.height - (ball.y - canvas.height);
        ball.angle = 2 * Math.PI - ball.angle;
    }
    else if (ball.y < 0) {
        ball.y = -ball.y;
        ball.angle = 2 * Math.PI - ball.angle;
    }
}

function animateBall() {
    // Remplir le fond
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dessiner la balle
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    nextPos();
    // Relance l'animation à chaque frame
    requestAnimationFrame(animateBall);
}

animateBall();
delete Ball;
let socket = new WebSocket("ws://localhost:8080");
socket.onopen = function () { return console.log("Connected to server"); };
socket.onmessage = function (event) { return console.log("Message from server: ".concat(event.data)); };
socket.onclose = function () { return console.log("Disconnected"); };
