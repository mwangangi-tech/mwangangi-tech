const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const LANE_WIDTH = GAME_WIDTH / 3;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;

let score = 0;
let gameOver = false;

class Car {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, CAR_WIDTH, CAR_HEIGHT);
  }

  move() {
    this.y += this.speed;
  }
}

const player = new Car(GAME_WIDTH / 2 - CAR_WIDTH / 2, GAME_HEIGHT - CAR_HEIGHT - 20, 'blue');
const opponents = [];

function createOpponent() {
  const lane = Math.floor(Math.random() * 3);
  const x = lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
  const opponent = new Car(x, -CAR_HEIGHT, 'red');
  opponent.speed = 2 + Math.random() * 3;
  opponents.push(opponent);
}

function drawRoad() {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  
  ctx.strokeStyle = '#FFF';
  ctx.setLineDash([20, 20]);
  ctx.beginPath();
  ctx.moveTo(LANE_WIDTH, 0);
  ctx.lineTo(LANE_WIDTH, GAME_HEIGHT);
  ctx.moveTo(LANE_WIDTH * 2, 0);
  ctx.lineTo(LANE_WIDTH * 2, GAME_HEIGHT);
  ctx.stroke();
}

function drawScore() {
  ctx.fillStyle = '#FFF';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function checkCollision(car1, car2) {
  return (
    car1.x < car2.x + CAR_WIDTH &&
    car1.x + CAR_WIDTH > car2.x &&
    car1.y < car2.y + CAR_HEIGHT &&
    car1.y + CAR_HEIGHT > car2.y
  );
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawRoad();
  drawScore();

  player.draw();

  if (Math.random() < 0.02) createOpponent();

  opponents.forEach((opponent, index) => {
    opponent.move();
    opponent.draw();

    if (checkCollision(player, opponent)) {
      gameOver = true;
      alert(`Game Over! Your score: ${score}`);
    }

    if (opponent.y > GAME_HEIGHT) {
      opponents.splice(index, 1);
      score++;
    }
  });

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  const playerCenter = player.x + CAR_WIDTH / 2;

  if (key === 'ArrowLeft' && playerCenter > LANE_WIDTH / 2) {
    player.x -= LANE_WIDTH;
  } else if (key === 'ArrowRight' && playerCenter < GAME_WIDTH - LANE_WIDTH / 2) {
    player.x += LANE_WIDTH;
  }
});

gameLoop();