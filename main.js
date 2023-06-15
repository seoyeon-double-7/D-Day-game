import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, Coin, ClimbingEnemy } from "./enemies.js";
import { Field1 } from "./field.js";
import { UI } from "./UI.js";

// js 파일 로드될때 (게임 루프)
window.addEventListener("load", function () {
  // 캔바스 설정
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1920;
  canvas.height = 1080;

  // 게임 클래스(기본 세팅)
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      // 캐릭터와 땅 사이 거리(마진)
      this.groundMargin = 260;
      this.speed = 0;
      this.maxSpeed = 6;

      // 게임에 사용될 객체 생성
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);

      // 발판, 장애물, 충돌, 효과 이펙트 요소를 담을 배열
      this.platforms = [];
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];

      this.maxParticles = 200;

      // 장애물 세팅
      this.enemyTimer = 0;
      this.enemyInterval = 4000;

      // 발판 세팅
      this.platformGap = 300;
      this.platformTimer = 0;
      this.platformInterval = 1000;
      this.debug = false;

      // 점수
      this.score = 0;
      this.winningScore = 40;
      this.fontColor = "black";

      // 제한시간
      // 1000 1초
      this.time = 0;
      this.maxTime = 60000;
      this.gameOver = false;
      this.gameClear = false;
      this.lives = 5;

      // 다음 스테이지
      this.nextStage = false;

      // 플레이어 상태
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    // 게임 update
    update(deltaTime) {
      // console.log(game.player.currentState);
      // time setting
      this.time += deltaTime;

      // 제한시간 됐을 때 게임 오버
      if (this.time > this.maxTime) this.gameOver = true;

      // 맵이 끝났을 때 캐릭터가 도착 지점에 있으면 게임 클리어
      if (game.background.backgroundLayers[0].bgNum >= 2) {
        if (game.player.x >= this.width - 500) {
          this.gameClear = true;
        } else {
          this.gameOver = true;
        }
      }

      // 배경, 플레이어 update
      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      // 장애물 처리
      // enemyInterval 시간마다 장애물 추가해주기
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion)
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });

      // 발판 처리
      // platformInterval 시간마다 발판 추가해주기
      if (this.platformTimer > this.platformInterval) {
        this.addPlatform();
        this.platformTimer = 0;
      } else {
        this.platformTimer += deltaTime;
      }

      this.platforms.forEach((platform) => {
        platform.update();

        // 발판 지워주기
        if (platform.markedForDeletion)
          this.platforms.splice(this.platforms.indexOf(platform), 1);
      });

      // 메시지 처리
      this.floatingMessages.forEach((message) => {
        message.update();
      });

      // 파티클 처리
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(index, 1);
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      // 충돌 처리
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
        if (collision.markedForDeletion) this.collisions.splice(index, 1);
      });

      // 장애물, 발판, 파티클, 콜리션, 메시지 지워주기
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      this.platforms = this.platforms.filter(
        (platform) => !platform.markedForDeletion
      );
      this.particles = this.particles.filter(
        (particle) => !particle.markedForDeletion
      );
      this.collisions = this.collisions.filter(
        (collision) => !collision.markedForDeletion
      );
      this.floatingMessages = this.floatingMessages.filter(
        (message) => !message.markedForDeletion
      );
    }

    // 게임 draw (배경, 캐릭터, 장애물, 발판, 파티클, 콜리션, 메시지)
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.platforms.forEach((platform) => {
        platform.draw(context);
      });
      this.particles.forEach((particle) => {
        particle.draw(context);
      });
      this.collisions.forEach((collision) => {
        collision.draw(context);
      });
      this.floatingMessages.forEach((message) => {
        message.draw(context);
      });
      this.UI.draw(context);
    }

    // 장애물 추가
    addEnemy() {
      // TODO : addCoin 메소드 따로 만들기
      if (this.speed > 0 && Math.random() < 0.8)
        this.enemies.push(new Coin(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new Coin(this));
      this.enemies.push(new FlyingEnemy(this));
    }

    // 발판 추가
    // TODO: main말고, filed class update메소드에서 for문 돌리며 random하게 출력하기
    addPlatform() {
      this.platforms.push(new Field1(this));
    }
  }

  // game 객체 생성
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // update하고 게임 데이터 그려주기
    game.update(deltaTime);
    game.draw(ctx);

    // 게임 오버 되거나 게임 클리어 되면 애니메이팅 종료
    if (!game.gameOver && !game.gameClear && !game.nextStage) {
      requestAnimationFrame(animate);
    }
  }
  // 그리기 시작
  animate(0);
});
