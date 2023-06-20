const enemy1Sound = new Audio("music/boong_sound.mp3");

class Enemy {
  // 장애물 기본 세팅
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.isEnemy = true;
    this.markedForDeletion = false;
  }
  update(deltaTime) {
    // console.log(
    //   "this.x : ",
    //   this.x,
    //   "this.speedX",
    //   this.speedX,
    //   "this.game.speed",
    //   this.game.speed
    // );
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;

    // 프레임 설정
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    // 개체가 화면 밖에 있으면 지워주기
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  // 장애물 draw
  draw(context) {
    // debug 모드
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

// 장애물 1
export class FlyingEnemy extends Enemy {
  constructor(game) {
    // 부모 클래스 변수, 함수 사용가능
    super();
    this.game = game;
    this.width = 91;
    this.height = 232;
    this.x = this.game.width;

    this.minY = this.game.height - this.game.groundMargin;
    this.maxY = this.minY - 40;
    this.y = Math.random() * (this.maxY - this.minY) + this.maxY / 2;
    // y random하게
    // this.y = Math.random() * this.game.height * 0.3 + this.game.player.width;
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 0;
    this.image = document.getElementById("enemy_fly");
    // 위아래로 움직일 y 좌표 세팅
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    enemy1Sound.play();
    // 캐릭터 y좌표 sin값으로 위아래로 둥둥 떠다니는 모션 구현
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

// 장애물 2
export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 91;
    this.height = 232;
    this.x = this.game.width + 180;
    // y값 random하게 설정
    this.y = Math.random() * this.game.height * 0.5;
    this.image = document.getElementById("enemy_ballon");
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 0;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.y > this.game.height - this.game.groundMargin) this.speedY *= -1;
    // 화면 y좌표 벗어나면 지워주기
    if (this.y < -this.height) this.markedForDeletion = true;
  }
  draw(context) {
    super.draw(context);
  }
}

// 코인
export class Coin extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 41;
    this.height = 60;
    this.x = this.game.width;
    // TODO : 발판 값 불러와서 coin의 y값을 발판-10으로 세팅하기
    this.y = this.game.height - this.height - this.game.groundMargin - 100;
    this.image = document.getElementById("coin");
    this.speedX = 0;
    this.speedY = 0;
    this.isEnemy = false;
    this.maxFrame = 0;
  }
}
