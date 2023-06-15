class Field {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }
  update() {
    // movement
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    // TODO : 플레이어, 발판 충돌 체크
    if (
      this.game.player.x < this.x + this.width &&
      this.game.player.x + this.game.player.width > this.x &&
      this.game.player.y + this.game.player.height > this.y &&
      this.game.player.y + this.game.player.height < this.y + this.height &&
      this.game.player.vy >= 0
    ) {
      this.game.player.y = this.y - this.game.player.height;
      this.game.player.vy = 0;
      this.game.player.onPlatform = true;
    } else {
      this.game.player.onPlatform = false;
    }
    if (this.x + this.width < 0)
      // check it off screen
      this.markedForDeletion = true;
  }
  draw(context) {
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

export class Field1 extends Field {
  constructor(game) {
    // 부모 클래스 변수, 함수 사용가능
    super();
    this.game = game;
    this.width = 141;
    this.height = 53;
    // this.platforms=[
    //   {x:0,y:350},
    //   {x:200,y:250},
    //   {x:400,y:150},
    //   {x:600,y:250},
    //   {x:800,y:150},
    // ]

    // 발판 최대 최소 높이
    this.minY = this.game.height - this.game.groundMargin;
    this.maxY = this.minY - 300;

    this.x = this.game.width;
    this.y = Math.random() * (this.maxY - this.minY) + this.minY;
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 0;
    this.image = document.getElementById("field1");
  }
  update(deltaTime) {
    super.update(deltaTime);
  }
}

export class Field2 extends Field {}

export class Field3 extends Field {}

export class Field4 extends Field {}
