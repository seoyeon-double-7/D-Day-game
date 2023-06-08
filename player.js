import { Sitting } from "./playerState.js";

export class Player {
  // 초기화 생성자
  constructor(game) {
    this.game = game;
    // 크기
    this.width = 100;
    this.height = 91.3;
    // 좌표
    this.x = 0;
    this.y = this.game.height - this.height;
    this.vy = 0;
    this.weight = 1;

    // 플레이어 이미지 불러오기
    this.image = document.getElementById("player");

    this.speed = 0;
    this.maxSpeed = 10;

    // state 관리 (sitting, running,)
    // plaeyr을 props로 넘기기
    this.states = [new Sitting(this)];
    this.currentState = this.states[0];
    this.currentState.enter();
  }
  update(input) {
    // horizontal movement
    this.x += this.speed;
    if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // vertical move
    if (input.includes("ArrowUp") && this.onGround()) this.vy -= 20;
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
  }
  draw(context) {
    context.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height;
  }
}
