const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

class Ball {
    x: number;
    y: number;
    angle: number;
    speed: number;
    ispeed: number
    radius: number;
    color: string;
    constructor(x: number, y: number, angle: number, speed: number, ispeed: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.ispeed = ispeed;
        this.radius = radius;
        this.color = color;
    }
}

class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    color: string;
    score: string;
    constructor(x: number, y: number, width: number, height: number, speed: number, color: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
        this.score = "0";
    }
}

class keyInput {
    arrowUp: boolean = false;
    arrowDown: boolean = false;
    w: boolean = false;
    s: boolean = false;
}


let state = 0;
let start = 0;
let ball = new Ball(canvas.width / 2, canvas.height / 2, 0, 5, 5, 10, "#fcc800");
let lPaddle = new Paddle(30, canvas.height / 2, 20, 200, 10, "#fcc800");
let rPaddle = new Paddle(canvas.width - 30, canvas.height / 2, 20, 200, 10, "#fcc800");
let input = new keyInput();

let animFrame = 0;
let animLoop = 1;

function titleScreen() {
    ctx.fillStyle = "#364153";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#101828";
    ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);
    ctx.fillStyle = "#fcc800";
    ctx.font = "84px 'Press Start 2P'";
    ctx.textAlign = "center"
    ctx.fillText("Pong Game", canvas.width * 0.5, canvas.height * 0.5);
    if (animFrame === 0 || animFrame === 1)
        ctx.fillStyle = "#fcc800";
    else if (animFrame === 2 || animFrame === 3)
        ctx.fillStyle = "#ffd014";
    else if (animFrame === 4 || animFrame === 5)
        ctx.fillStyle = "#ffd52b";
    else if (animFrame === 6 || animFrame === 7)
        ctx.fillStyle = "#ffd83e";
    else if (animFrame === 8 || animFrame === 9)
        ctx.fillStyle = "#ffdb5e";
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillText("Press any key", canvas.width * 0.5, canvas.height * 0.5 + 60 + animFrame);
    animFrame += animLoop;
    if (animFrame === 0 || animFrame === 9)
        animLoop *= -1;
    if (state === 0)
        setTimeout(() => titleScreen(), 70);
}

function norAngle() {
    if (ball.angle < 0)
        ball.angle += 2 * Math.PI;
    if (ball.angle > 2 * Math.PI)
        ball.angle -= 2 * Math.PI;
}

function resetGame() {
    start = 0;
    ball.x = 0.5 * canvas.width;
    ball.y = 0.5 * canvas.height;
    ball.speed = ball.ispeed;
    lPaddle.y = 0.5 * canvas.height;
    rPaddle.y = 0.5 * canvas.height;
}

function movePaddle() {
    if (input.arrowUp)
        rPaddle.y -= rPaddle.speed;
    if (input.arrowDown)
        rPaddle.y += rPaddle.speed;
    if (input.w)
        lPaddle.y -= lPaddle.speed;
    if (input.s)
        lPaddle.y += lPaddle.speed;
    if (rPaddle.y < 0.5 * rPaddle.height)
        rPaddle.y = 0.5 * rPaddle.height;
    else if (rPaddle.y > canvas.height - rPaddle.height * 0.5)
        rPaddle.y = canvas.height -   0.5 * rPaddle.height;
    if (lPaddle.y < 0.5 * lPaddle.height)
        lPaddle.y = 0.5 * lPaddle.height;
    else if (lPaddle.y > canvas.height - lPaddle.height * 0.5)
        lPaddle.y = canvas.height - 0.5 * lPaddle.height;
    setTimeout(() => movePaddle(), 10);
}

function checkCollision(oldX: number, oldY: number) {
    let sign = 1;
    let posy = 0;
    if (ball.angle > 0.5 * Math.PI && ball.angle < 1.5 * Math.PI)
        sign = -1;
    if (sign === 1)
        posy = oldY + Math.tan(ball.angle) * (rPaddle.x - (0.5 * rPaddle.width) - oldX);
    else if (sign === -1)
        posy = oldY + Math.tan(ball.angle) * (lPaddle.x + (0.5 * lPaddle.width) - oldX);
    if (sign === 1 && posy >= rPaddle.y - 0.5 *  rPaddle.height && posy <= rPaddle.y + 0.5 * rPaddle.height)
        return (1);
    else if (sign === -1 && posy >= lPaddle.y - 0.5 * lPaddle.height && posy <= lPaddle.y + 0.5 * lPaddle.height)
        return (2);
    return (0);
}

function bounceAngle(paddle: Paddle, side: string) {
    const ratio = (ball.y - paddle.y) / (paddle.height / 2);
    ball.speed = ball.ispeed + 0.5 * ball.ispeed * Math.abs(ratio);
    ball.angle = Math.PI * 0.25 * ratio;
    if (side === "right")
        ball.angle = Math.PI - ball.angle;
    norAngle();
}

function moveBall() {
    if (start === 1) {
        let oldX = ball.x;
        let oldY = ball.y;
        let collision = 0;
        ball.x += Math.cos(ball.angle) * ball.speed;
        ball.y += Math.sin(ball.angle) * ball.speed;
        if ((ball.x > rPaddle.x - 0.5 * rPaddle.width && (ball.angle < 0.5 * Math.PI || ball.angle > 1.5 * Math.PI)) || (ball.x < lPaddle.x + 0.5 * lPaddle.width && (ball.angle > 0.5 * Math.PI && ball.angle < 1.5 * Math.PI)))
            collision = checkCollision(oldX, oldY); // 0 = nothing || 1 = right || 2 = left
        if (collision === 1) {
            oldY = oldY + Math.tan(ball.angle) * (rPaddle.x - (0.5 * rPaddle.width) - oldX);
            oldX = rPaddle.x - (0.5 * rPaddle.width);
            bounceAngle(rPaddle, "right");
            ball.x = oldX + Math.cos(ball.angle) * (Math.sqrt(Math.pow(ball.y - oldY, 2) + Math.pow(ball.x - oldX, 2)));
            ball.y = oldY + Math.sin(ball.angle) * (Math.sqrt(Math.pow(ball.y - oldY, 2) + Math.pow(ball.x - oldX, 2)));
        } else if (collision === 2) {
            oldY =  oldY - Math.tan(ball.angle) * (lPaddle.x + (0.5 * lPaddle.width) - oldX);
            oldX = lPaddle.x + (0.5 * lPaddle.width);
            bounceAngle(lPaddle, "left");
            ball.x = oldX + Math.cos(ball.angle) * (Math.sqrt(Math.pow(ball.y - oldY, 2) + Math.pow(ball.x - oldX, 2)));
            ball.y = oldY + Math.sin(ball.angle) * (Math.sqrt(Math.pow(ball.y - oldY, 2) + Math.pow(ball.x - oldX, 2)));
        }
        if (ball.x > canvas.width) {
            resetGame();
            lPaddle.score = String(Number(lPaddle.score) + 1);
        }
        if (ball.x < 0) {
            resetGame();
            rPaddle.score = String(Number(rPaddle.score) + 1);
        }
        if (ball.y > canvas.height) {
            ball.y = canvas.height - (ball.y - canvas.height);
            ball.angle = 2 * Math.PI - ball.angle;
        } else if (ball.y < 0) {
            ball.y = -ball.y;
            ball.angle = 2 * Math.PI - ball.angle;
        }
        norAngle();
    }
    setTimeout(() => moveBall(), 10);
}

function animateBall() {
    // Remplir le fond
    ctx.fillStyle = "#101828";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Debug
    ctx.fillStyle = "#364153";
    for (let i = 0; i < canvas.height; i += 60) {
        ctx.fillRect(canvas.width * 0.5 - 4, i, 8, 30);
    }
    // Dessiner la balle
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    // Dessiner les raquettes
    ctx.fillStyle = lPaddle.color;
    ctx.fillRect(lPaddle.x - lPaddle.width * 0.5, lPaddle.y - lPaddle.height * 0.5, lPaddle.width, lPaddle.height);
    ctx.fillStyle = rPaddle.color;
    ctx.fillRect(rPaddle.x - rPaddle.width * 0.5, rPaddle.y - rPaddle.height * 0.5, rPaddle.width, rPaddle.height);
    ctx.fillStyle = "#fcc800";
    ctx.font = "48px 'Press Start 2P'";
    ctx.textAlign = "left"
    ctx.fillText(lPaddle.score, canvas.width * 0.5 + 46, 80);
    ctx.textAlign = "right"
    ctx.fillText(rPaddle.score, canvas.width * 0.5 - 40, 80);
    // Relance l'animation à chaque frame
    requestAnimationFrame(animateBall);
}

function gameLoop () {
    if (state === 1) {
        animateBall();
        moveBall();
        movePaddle();
    }
    else if (state === 0)
        requestAnimationFrame(gameLoop);
}

titleScreen();
gameLoop();

const socket = new WebSocket("ws://localhost:8080");
window.addEventListener("keydown", (event) => {
    socket.send(JSON.stringify({ type: "input", key: event.key, state: "down" }));
    if (state === 1) {
        if (event.key === "w")
            input.w = true;
        if (event.key === "s")
            input.s = true;
        if (event.key === "ArrowUp")
            input.arrowUp = true;
        if (event.key === "ArrowDown")
            input.arrowDown = true;
        start = 1;
    }
    else
        state = 1;
});
window.addEventListener("keyup", (event) => {
    socket.send(JSON.stringify({ type: "input", key: event.key, state: "up" }));
    if (state === 1) {
        if (event.key === "w")
            input.w = false;
        if (event.key === "s")
            input.s = false;
        if (event.key === "ArrowUp")
            input.arrowUp = false;
        if (event.key === "ArrowDown")
            input.arrowDown = false;
    }
});
socket.onopen = function () { return console.log("Connected to server"); };
socket.onmessage = function (event) { return console.log("Message from server: ".concat(event.data)); };
socket.onclose = function () { return console.log("Disconnected"); };