const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
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
class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}
let ball = new Ball(canvas.width / 2, 50, 0.3, 20, 10, "cyan");
let lPaddle = new Paddle(30, canvas.height / 2, 20, 300, "red");
let rPaddle = new Paddle(canvas.width - 30, canvas.height / 2, 20, 300, "purple");
function norAngle() {
    if (ball.angle < 0)
        ball.angle += 2 * Math.PI;
    if (ball.angle > 2 * Math.PI)
        ball.angle -= 2 * Math.PI;
}
function movePaddle(paddle, key) {
    if (key === "ArrowUp")
        paddle.y -= 30;
    else if (key === "ArrowDown")
        paddle.y += 30;
    if (paddle.y < 0.5 * paddle.height)
        paddle.y = 0.5 * paddle.height;
    else if (paddle.y > canvas.height - paddle.height * 0.5)
        paddle.y = canvas.height - 0.5 * paddle.height;
}
function checkCollision(oldX, oldY) {
    let sign = 1;
    let posy = 0;
    if (ball.angle > 0.5 * Math.PI && ball.angle < 1.5 * Math.PI)
        sign = -1;
    if (sign === 1)
        posy = oldY + Math.tan(ball.angle) * (rPaddle.x - (0.5 * rPaddle.width) - oldX);
    else if (sign === -1)
        posy = oldY + Math.tan(ball.angle) * (lPaddle.x + (0.5 * lPaddle.width) - oldX);
    if (sign === 1 && posy >= rPaddle.y - 0.5 * rPaddle.height && posy <= rPaddle.y + 0.5 * rPaddle.height)
        return (1);
    else if (sign === -1 && posy >= lPaddle.y - 0.5 * lPaddle.height && posy <= lPaddle.y + 0.5 * lPaddle.height)
        return (2);
    return (0);
}
function nextPos() {
    const oldX = ball.x;
    const oldY = ball.y;
    let collision = 0;
    ball.x += Math.cos(ball.angle) * ball.speed;
    ball.y += Math.sin(ball.angle) * ball.speed;
    if ((ball.x > rPaddle.x - 0.5 * rPaddle.width && (ball.angle < 0.5 * Math.PI || ball.angle > 1.5 * Math.PI)) || (ball.x < lPaddle.x + 0.5 * lPaddle.width && (ball.angle > 0.5 * Math.PI && ball.angle < 1.5 * Math.PI)))
        collision = checkCollision(oldX, oldY); // 0 = nothing || 1 = right || 2 = left
    if (collision === 1) {
        ball.x = rPaddle.x - rPaddle.width - (ball.x - rPaddle.x - 0.5 * rPaddle.width);
        ball.angle = Math.PI - ball.angle;
    }
    else if (collision === 2) {
        ball.x = lPaddle.x + lPaddle.width / 2 + (ball.x - lPaddle.x + 0.5 * lPaddle.width);
        ball.angle = Math.PI - ball.angle;
    }
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
    norAngle();
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
    // Dessiner les raquettes
    ctx.fillStyle = lPaddle.color;
    ctx.fillRect(lPaddle.x - lPaddle.width * 0.5, lPaddle.y - lPaddle.height * 0.5, lPaddle.width, lPaddle.height);
    ctx.fillStyle = rPaddle.color;
    ctx.fillRect(rPaddle.x - rPaddle.width / 2, rPaddle.y - rPaddle.height / 2, rPaddle.width, rPaddle.height);
    nextPos();
    // Relance l'animation à chaque frame
    requestAnimationFrame(animateBall);
}
animateBall();
const socket = new WebSocket("ws://localhost:8080");
window.addEventListener("keydown", (event) => {
    socket.send(JSON.stringify({ type: "input", key: event.key, state: "down" }));
    console.log(event.key);
    if (event.key === "ArrowUp" || event.key === "ArrowDown")
        movePaddle(rPaddle, event.key);
    else if (event.key === "w" || event.key === "s")
        movePaddle(lPaddle, event.key);
});
window.addEventListener("keyup", (event) => {
    socket.send(JSON.stringify({ type: "input", key: event.key, state: "up" }));
});
socket.onopen = function () { return console.log("Connected to server"); };
socket.onmessage = function (event) { return console.log("Message from server: ".concat(event.data)); };
socket.onclose = function () { return console.log("Disconnected"); };
export {};
