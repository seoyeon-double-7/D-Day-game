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

const boomSound = new Audio("music/boom_sound.mp3");
const coinSound = new Audio("music/coin_sound.mp3");
const overSound = new Audio("music/game_over.mp3");
const jumpSound = new Audio("music/jump_sound.mp3");
const pangSound = new Audio("music/pang_sound.mp3");
// const running_sound = new Audio("music/running_sound.mp3");
export class Player {
  // 플레이어 기본 세팅
  constructor(game) {
    this.game = game;
    this.reset();
  }
  // 플레이어 초기화
  reset() {
    // 크기
    this.width = 100;
    this.height = 150;

    // 좌표
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.weight = 1;

    // 발판과 플레이어의 충돌 여부를 초기화
    this.onPlatform = false;

    // 플레이어 이미지 불러오기 (점프)
    this.image = document.getElementById(
      `player${this.game.currentMapIndex + 1}`
    );

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
    // if (this.currentState !== this.states[1]) {
    //   running_sound.play();
    //   running_sound.volume = 0.3;
    // }

    // 낙하체크
    this.checkFall();

    // 충돌 체크
    this.checkField();
    this.checkCollision();

    // 입력 이펙트
    this.currentState.handleInput(input);

    // 입력에 따라서 speed 설정해주기
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

    //  vy값을 변경한 후에 y값을 변경
    // y값 세팅 => 바닥에 안 닿을때까지 1더해주기
    // console.log(this.vy);
    if (this.vy === -27) {
      jumpSound.play();
      jumpSound.volume = 0.5;
    }
    if (!this.onPlatform) {
      this.vy += this.weight;
    }
    this.y += this.vy;

    // 점프중x 바닥에 있을때 y값 세팅

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

  // state 설정
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    // console.log("state enter");
    this.currentState.enter();
  }

  checkField() {
    // console.log(this.currentState);
    let isOnPlatform = false;
    this.game.platforms.forEach((platform) => {
      if (
        this.x < platform.x + platform.width &&
        this.x + this.width > platform.x &&
        this.y + this.height > platform.y &&
        this.y + this.height <= platform.y + platform.height &&
        //플레이어가 점프 도중에 발판 위에 있는 경우 vy 값이 음수일 수 있으므로 0에서 -1로 수정
        this.vy >= -1
      ) {
        // 플레이어와 발판과 충돌이 있을 경우에만 값을 변경
        isOnPlatform = true;
        this.y = platform.y - this.height;
        this.vy = 0;
      }
      if (platform.x + platform.width < 0)
        // check it off screen
        platform.markedForDeletion = true;
    });
    this.onPlatform = isOnPlatform;
  }

  // 충돌 처리
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      // console.log(enemy);
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
        // !enemy.isEnemy && this.currentState === this.states[4]
        //   ? pangSound.play()
        //   : coinSound.play();
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
          this.currentState === this.states[4]
            ? pangSound.play()
            : coinSound.play();
          // 점수 증가, +1 메시지 띄우기
          this.game.score += 135;

          this.game.floatingMessages.push(
            new FloatingMessages("+1", enemy.x, enemy.y, 150, 50)
          );
          // 효과음 재생
        }
        // 장애물과 충돌했을 때 아픈 모션 캐릭터 state로 교체
        // 점수, 생명 감소(생명이 0일때 게임 오버)
        else {
          boomSound.play();
          this.setState(6, 0);
          this.game.score -= 5;
          this.game.lives--;

          if (this.game.lives <= 0) {
            this.game.gameOver = true;
            overSound.play();
          }
        }
      }
    });
  }
  checkFall() {
    // 화면 밖으로 낙하한다면 게임 종료!
    if (this.y > this.game.height) {
      // this.game.gameOver = true;
      this.game.reset(0);
      // overSound.play();
    }
  }
}
