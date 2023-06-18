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
    // console.log(this.x, this.speedX, this.game.speed);
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    // TODO : 플레이어, 발판 충돌 체크
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
  constructor(game, x) {
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
    this.x = x;
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
