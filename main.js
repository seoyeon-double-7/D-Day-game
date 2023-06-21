import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, Coin, ClimbingEnemy } from "./enemies.js";
import { Field1 } from "./field.js";
import { UI } from "./UI.js";

let bgMusic = new Audio("music/bgMusic1.mp3");
let bgMusic2 = new Audio("music/bgMusic2.mp3");
let bgMusic3 = new Audio("music/bgMusic3.mp3");
let bgMusic4 = new Audio("music/bgMusic4.mp3");
const clearSound = new Audio("music/game_clear.mp3");
const powerSound = new Audio("music/power_sound.mp3");
// js 파일 로드될때 (게임 루프)

window.addEventListener("load", function () {
  // 캔바스 설정
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1920;
  canvas.height = 1080;

  // 마우스 클릭 이벤트 처리
  canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    console.log(mouseX, mouseY);
    // 클릭한 위치가 이미지 영역 내에 있는지 확인
    if (mouseX >= 583 && mouseX <= 736 && mouseY >= 500 && mouseY <= 550) {
      console.log("home으로");
    } else if (
      mouseX >= 772 &&
      mouseX <= 930 &&
      mouseY >= 500 &&
      mouseY <= 550
    ) {
      if (game.gameOver) {
        this.nextStage = false;
        console.log("다시하기");
        // animate(0);
        // game.reset();
      } else if (game.nextStage) {
        console.log("다음 맵으로!");
        // game.reset();
      }
    }
  });

  // 게임 클래스(기본 세팅)
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      // TODO : 맵벼로 지형지물, 방향 다르게하기
      // 현재 맵 인덱스와 맵 목록 설정
      this.currentMapIndex = 0;
      this.maps = ["morning", "afternoon", "dinner", "night"];

      // 캐릭터와 땅 사이 거리(마진)
      this.groundMargin = 200;
      this.speed = 0;
      this.maxSpeed = 6;

      // 게임에 사용될 객체 생성
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);

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
      this.platformGap = 400;
      this.platformTimer = 0;
      this.platformInterval = 2000;
      this.initialPlatformX = 0;

      // 플레이어의 y값을 매개변수로 전달하여 첫 번째 발판 생성
      this.addPlatform(this.player.y + 100, true);

      this.debug = false;

      // 점수
      this.score = 0;
      this.winningScore = 40;
      this.fontColor = "white";
      this.winningMap = 2;

      // 제한시간
      // 1000 1초
      this.time = 0;
      this.maxTime = 80000;

      // 게임 클리어, 오버 여부 초기화
      this.gameOver = false;
      this.gameClear = false;
      this.lives = 3;

      // 다음 스테이지
      this.nextStage = false;
      this.currentMusic = bgMusic;

      // 플레이어 상태
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();

      // 게임 시작 시 첫번째 맵으로 설정
      this.background.setMap(this.maps[this.currentMapIndex]);
    }

    gotoNextMap() {
      if (this.currentMapIndex < this.maps.length - 1) {
        this.nextStage = false;
        this.currentMapIndex++;

        this.currentMusic.pause();
        switch (this.currentMapIndex + 1) {
          case 2:
            this.currentMusic = bgMusic2;
            break;
          case 3:
            this.currentMusic = bgMusic3;
            break;
          case 4:
            this.currentMusic = bgMusic4;

          default:
            break;
        }
        this.currentMusic.loop = true;
        this.currentMusic.play();

        // 게임 시작 시 첫번째 맵으로 설정
        // this.background.setMap(this.maps[this.currentMapIndex]);
        this.background.reset();
        this.player.reset();

        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();

        this.platforms = [];
        this.enemies = [];
        this.particles = [];
        this.collisions = [];
        this.floatingMessages = [];

        // 장애물 세팅
        this.enemyTimer = 0;
        this.platformTimer = 0;

        // 플레이어의 y값을 매개변수로 전달하여 첫 번째 발판 생성
        this.addPlatform(this.player.y + 100, true);

        // 점수
        // this.winningMap = 2;

        // 제한시간
        // 1000 1초
        this.time = 0;
        // this.maxTime = 80000;

        // 게임 클리어, 오버 여부 초기화
        // this.lives = 3;
        // 플레이어 상태
      } else {
        // 모든 맵을 클리어한 경우 게임 종료 처리
        this.gameOver = true;
      }
    }

    // 게임 update
    update(deltaTime) {
      // console.log(this.enemies, this.enemies.length);
      // console.log(this.platforms, this.platforms.length);

      // time setting
      this.time += deltaTime;

      // 제한시간 됐을 때 게임 오버
      if (this.time > this.maxTime) {
        this.gameOver = true;
        overSound.play();
      }

      // 맵이 끝났을 때 캐릭터가 도착 지점에 있으면 게임 클리어
      if (game.background.background1Layers[1].bgNum >= this.winningMap) {
        if (this.player.onPlatform) {
          clearSound.play();
          this.gotoNextMap();
          // this.nextStage = true;
        }
        // else {
        //   this.gameOver = true;
        // }
      }

      // 배경, 플레이어 update
      this.background.update();
      if (this.input.keys.includes("Space")) {
        powerSound.play();
      }
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
        if (enemy.markedForDeletion) {
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });

      // 발판 처리
      // platformInterval 시간마다 발판 추가해주기
      if (
        this.player.currentState !== this.player.states[0] &&
        this.platformTimer > this.platformInterval
      ) {
        this.addPlatform();
        this.platformTimer = 0;
      } else {
        this.platformTimer += deltaTime;
      }

      this.platforms.forEach((platform) => {
        platform.update();

        // 발판 지워주기
        if (platform.markedForDeletion) {
          this.platforms.splice(this.platforms.indexOf(platform), 1);
          console.log("지워짐");
        }
      });

      // 메시지 처리
      this.floatingMessages.forEach((message) => {
        message.update();
      });

      // 파티클 처리
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) {
          this.particles.splice(index, 1);
        }
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      // 충돌 처리
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
        if (collision.markedForDeletion) {
          this.collisions.splice(index, 1);
        }
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
      this.ui.draw(context);
    }

    // 장애물 추가
    addEnemy() {
      // TODO : addCoin 메소드 따로 만들기
      if (this.speed > 0 && Math.random() < 0.8) {
        this.enemies.push(new Coin(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
      this.enemies.push(new FlyingEnemy(this));
    }

    // 발판 추가
    addPlatform(playerY, isGameStart = false, isGameEnd = false) {
      // const platformCount = Math.floor(Math.random() * 8) + 1; // 1개에서 4개 사이의 발판 개수 랜덤 설정
      const platformCount = 5;
      // 마지막으로 생성된 발판 할당(23.06.19)
      let lastPlatform =
        this.platforms.length > 0
          ? this.platforms[this.platforms.length - 1]
          : // 초기값으로 null을 설정하고, 발판이 최소한 한 개 이상 생성되었는지 확인한 후에 값을 할당
            // lastPlatform.x를 참조하기 전에 오류를 방지
            null;

      // 다음 맵으로 이동할 때 초기 발판 x 좌표 재조정
      if (isGameStart && this.currentMapIndex > 0) {
        console.log(this.platforms);
        this.initialPlatformX = 0;
      }

      for (let i = 0; i < platformCount; i++) {
        const x = lastPlatform
          ? lastPlatform.x + this.platformGap
          : this.initialPlatformX;
        const firstY = i === 0 ? playerY : 0;
        const isStart = isGameStart && i === 0;
        const isEnd = isGameEnd && i === platformCount - 1; // 마지막 발판인 경우 도착 발판 이미지로 설정
        const newPlatform = new Field1(this, x, firstY, isStart, isEnd);
        this.platforms.push(newPlatform);
        lastPlatform = newPlatform;
      }
    }

    reset(type) {
      // 게임 시작 시 첫번째 맵으로 설정
      // this.background.setMap(this.maps[this.currentMapIndex]);
      this.background.reset();
      this.player.reset();

      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();

      this.platforms = [];
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];

      // 장애물 세팅
      this.enemyTimer = 0;
      this.platformTimer = 0;

      // 플레이어의 y값을 매개변수로 전달하여 첫 번째 발판 생성
      this.addPlatform(this.player.y + 100, true);

      // 점수
      // this.winningMap = 2;

      // 제한시간
      // 1000 1초
      this.time = 0;
      // this.maxTime = 80000;

      // 게임 클리어, 오버 여부 초기화
      // this.lives = 3;
      // 플레이어 상태

      // fall(0), again(1)
      if (type === 0) {
        this.lives -= 0;
      } else this.lives = 3;
    }
  }

  // 게임 객체 생성
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  bgMusic.loop = true;
  bgMusic.play();

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 게임 업데이트 및 그리기
    game.update(deltaTime);
    game.draw(ctx);

    // 게임 오버 또는 게임 클리어 또는 다음 스테이지가 아니면 애니메이션 프레임 요청
    if (!game.gameOver && !game.gameClear && !game.nextStage) {
      requestAnimationFrame(animate);
    } else {
      // 노래 재생 중지
      pauseBackgroundMusic(game.currentMusic);
    }
  }

  // 애니메이션 시작
  animate(0);
});
// 배경음악 일시 정지
function pauseBackgroundMusic(bgMusic) {
  bgMusic.pause();
}
