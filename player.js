import {
  Sitting,
  Running,
  Jumping,
  Falling,
  Rolling,
  Diving,
  Hit,
} from "./playerState.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessages } from "./floatingMessages.js";

export class Player {
  // 플레이어 기본 세팅
  constructor(game) {
    this.game = game;

    // 크기
    this.width = 100;
    this.height = 150;

    // 좌표
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.weight = 1;

    // 플레이어 발판위에 있는지
    this.onPlatform = false;

    // 플레이어 이미지 불러오기 (점프)
    this.image = document.getElementById("player");

    // gif 효과를 내기 위해 frame 설정
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 10;

    // 현재 player와 충돌한 개체
    this.collisionElement = "";

    // state 관리 (sitting, running ...)
    // plaeyr을 props로 넘기기
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
    this.currentState = null;
  }

  // 플레이어 update
  update(input, deltaTime) {
    // 충돌 체크
    this.checkCollision();

    // 입력 이펙트
    this.currentState.handleInput(input);

    // 입력에 따라서 state 설정해주기
    this.x += this.speed;
    if (input.includes("ArrowRight") && this.currentState !== this.states[6])
      this.speed = this.maxSpeed;
    else if (
      input.includes("ArrowLeft") &&
      this.currentState !== this.states[6]
    )
      this.speed = -this.maxSpeed;
    else this.speed = 0;

    // 캐릭터 화면 넘어가지 않게 하기
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // y값 세팅
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    // 점프중x 바닥에 있을때 y값 세팅
    if (this.onGround())
      this.y = this.game.height - this.height - this.game.groundMargin;

    // 캐릭터 sprite 애니메이션
    // frameX값을 추가해서 다음 캐릭터 모션을 읽어와서 draw
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  // 플레이어 draw
  draw(context) {
    // debug모드
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);

    // frameX, frameY로 gif 효과
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

  // 바닥에 있는지 체크
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  // state 설정
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

        // 충돌한 개체가 코인일 경우 / 장애물일 경우
        if (!enemy.isEnemy) {
          this.collisionElement = "coin";
        } else {
          this.collisionElement = "obstacle";
        }

        // collision 배열에 객체 넣어주기
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );

        // 코인과 충돌했을 때
        if (
          !enemy.isEnemy ||
          this.currentState === this.states[4] ||
          this.currentState === this.states[5]
        ) {
          // 점수 증가, +1 메시지 띄우기
          this.game.score += 135;
          this.game.floatingMessages.push(
            new FloatingMessages("+1", enemy.x, enemy.y, 150, 50)
          );
        }
        // 장애물과 충돌했을 때 아픈 모션 캐릭터 state로 교체
        // 점수, 생명 감소(생명이 0일때 게임 오버)
        else {
          this.setState(6, 0);
          this.game.score -= 5;
          this.game.lives--;
          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    });
  }
}
