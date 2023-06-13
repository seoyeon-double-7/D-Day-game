export class CollisionAnimation {
  constructor(game, x, y) {
    this.game = game;
    this.image1 = document.getElementById("collisionAnimation");
    this.image2 = document.getElementById("shineAnimation");
    this.spriteWidth = 100;
    this.spriteHeight = 90;
    this.sizeModifier = Math.random() + 0.5;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.8;
    this.frameX = 0;
    this.maxFrame = 4;
    this.markedForDeletion = false;
    this.fps = Math.random() * 10 + 5;
    this.frameInterval = 1000 / this.fps;
    this.framTimer = 0;
  }
  draw(context) {
    context.drawImage(
      this.game.player.collisionElement === "obstacle"
        ? this.image1
        : this.image2,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update(deltaTime) {
    this.x -= this.game.speed;
    if (this.framTimer > this.frameInterval) {
      this.frameX++;
      this.framTimer = 0;
    } else {
      this.framTimer += deltaTime;
    }

    if (this.frameX > this.maxFrame) this.markedForDeletion = true;
  }
}
