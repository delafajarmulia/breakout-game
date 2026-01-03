const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// ball state
const BALL_RADIUS = 10;
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 2,
    dy: -2
};

// paddle state
const PADDLE = {
    width: 75,
    height: 10,
    speed: 7
};
let paddleX = (canvas.width - PADDLE.width) /2;

// input state
let input = {
    left: false,
    right: false
};

// game state
let score = 0;
let lives = 3;

// brick config
const BRICK = {
    rows: 3,
    cols: 5,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30
};

// Brick daya
let bricks = Array.from({length: BRICK.cols}, () => 
    Array.from({length: BRICK.rows}, () => ({
        x: 0,
        y: 0,
        active: true
    }))
);

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(
        paddleX,
        canvas.height - PADDLE.height,
        PADDLE.width,
        PADDLE.height
    );
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    bricks.forEach((col, c) => {
        col.forEach((brick, r) => {
            if(!brick.active) return;

            brick.x = c * (BRICK.width + BRICK.padding) + BRICK.offsetLeft;
            brick.y = r * (BRICK.height + BRICK.padding) + BRICK.offsetTop;

            ctx.beginPath();
            ctx.rect(brick.x, brick.y, BRICK.width, BRICK.height);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        })
    })
}

function drawUI(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function detectBrickCollision() {
    bricks.forEach(col => {
        col.forEach(brick => {
            if(!brick.active) return;

            if(
                ball.x > brick.x &&
                ball.x < brick.x + BRICK.width &&
                ball.y > brick.y &&
                ball.y < brick.y + BRICK.height
            ){
                ball.dy = -ball.dy;
                brick.active = false;
                score++;

                if(score === BRICK.rows * BRICK.cols){
                    alert("YOU WIN, CONGRATS!");
                    document.location.reload();
                }
            }
        })
    })
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // wall
    if(ball.x < BALL_RADIUS || ball.x > canvas.width - BALL_RADIUS){
        ball.dx *= -1;
    }

    // ceiling
    if(ball.y < BALL_RADIUS){
        ball.dy *= -1;
    }

    // paddle / floor
    if(ball.y > canvas.height - BALL_RADIUS){
        if(ball.x > paddleX && ball.x < paddleX + PADDLE.width){
            ball.dy *= -1;
        } else {
            lives--;
            resetBall();
        }
    }
}

function resetBall() {
    if (lives <= 0){
        alert("GAME OVER");
        document.location.reload();
        return;
    }

    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 2;
    ball.dy = -2;
    paddleX = (canvas.width - PADDLE.width) / 2;
}

function movePaddle(){
    if(input.right && paddleX < canvas.width - PADDLE.width){
        paddleX += PADDLE.speed;
    }
    if(input.left && paddleX > 0){
        paddleX -= PADDLE.speed;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    drawBall();
    drawBricks();
    drawPaddle();
    drawUI();

    detectBrickCollision();
    moveBall();
    movePaddle();

    requestAnimationFrame(gameLoop);
}

const runButton = document.getElementById("runButton");
runButton.addEventListener("click", () => {
    gameLoop();
    runButton.disabled = true;
})

function keyDownHandler(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        input.right = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft"){
        input.left = true;
    }
}

function keyUpHandler(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        input.right = false;
    }else if(e.key === "Left" || e.key === "ArrowLeft"){
        input.left = false;
    }
}

function mouseMoveHandler(e){
    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - PADDLE.width / 2;
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler)