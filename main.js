import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { Field1 } from "./field.js";
import { UI } from "./UI.js";

function nextStage() {
  alert("next!");
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1920;
  canvas.height = 1080;

  this.document.getElementById("next").onclick = nextStage;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 260;
      this.speed = 0;
      this.maxSpeed = 6;

      // 객체 생성
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);

      // 적
      this.enemies = [];
      this.fields = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.maxParticles = 200;
      this.enemyTimer = 0;
      this.enemyInterval = 2500;
      this.filedTimer = 0;
      this.filedInterval = 1000;
      this.debug = false;

      // 점수
      this.score = 0;
      this.winningScore = 40;
      this.fontColor = "black";

      // 제한시간
      this.time = 0;
      // 1000 1초
      this.maxTime = 60000;
      this.gameOver = false;
      this.gameClear = false;
      this.lives = 5;

      // 다음 스테이지
      this.nextStage = false;

      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) this.gameOver = true;
      if (game.background.backgroundLayers[0].bgNum >= 2) {
        if (game.player.x >= this.width - 500) {
          this.gameClear = true;
        } else {
          this.gameOver = true;
        }
      }

      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      // handleEnemies
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

      // handle fields
      if (this.filedTimer > this.filedInterval) {
        this.fields.push(new Field1(this));
        this.filedTimer = 0;
      } else {
        this.filedTimer += deltaTime;
      }

      this.fields.forEach((field) => {
        field.update(deltaTime);
        if (field.markedForDeletion)
          this.fields.splice(this.fields.indexOf(field), 1);
      });

      // handle messages
      this.floatingMessages.forEach((message) => {
        message.update();
      });

      // handle particles
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(index, 1);
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      // handle collision sprites
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
        if (collision.markedForDeletion) this.collisions.splice(index, 1);
      });

      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      this.fields = this.fields.filter((field) => !field.markedForDeletion);
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

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.fields.forEach((field) => {
        field.draw(context);
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
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver && !game.gameClear && !game.nextStage) {
      // console.log(game.background.backgroundLayers[0].bgNum)
      requestAnimationFrame(animate);
    }
  }
  //   캐릭터 그리기
  animate(0);
});
