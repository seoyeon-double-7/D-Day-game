import {
  Sitting,
  Running,
  Jumping,
  Falling,
  Rolling,
  Diving,
} from "./playerState.js";

export class Player {
  // 초기화 생성자
  constructor(game) {
    this.game = game;
    // 크기
    this.width = 100;
    this.height = 91.3;
    // 좌표
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.weight = 1;

    // 플레이어 이미지 불러오기 (점프)
    this.image = document.getElementById("player");
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 10;

    // state 관리 (sitting, running,)
    // plaeyr을 props로 넘기기
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
    ];
  }
  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);

    // horizontal movement
    this.x += this.speed;
    if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;
    // horizontal movement
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // vertical move
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }
  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  // 충돌 처리
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        // 적의 x축 좌측상단이 플레이어 우측상단과 겹쳤을 때
        enemy.x < this.x + this.width &&
        // 적의 x축 우측상단 좌표가 플레이어 좌측상단과 겹치지 않을때
        enemy.x + enemy.width > this.x &&
        // 적의 y축 상단이 플레이어의 y축 하단 전까지 겹칠때
        enemy.y < this.y + this.height &&
        // 플레이어의 y축 상단이 적의 y축 하단보다 아래있을 때
        enemy.y + enemy.height > this.y
      ) {
        // 충돌된 enemy 개체 없애주기
        enemy.markedForDeletion = true;
        this.game.score++;
      } else {
        // no collision
      }
    });
  }
}
