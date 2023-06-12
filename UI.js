export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    // font 써주기
    this.fontFamily = "Helvetica";
    this.livesImage = document.getElementById("lives");
  }
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;

    context.font = this.fontSize * 2 + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    // score
    context.fillText("점수: " + this.game.score, 40, 100);

    // timer
    context.font = this.fontSize + "px " + this.fontFamily;
    context.fillText(
      "남은시간 : " +
        (this.game.maxTime * 0.001 - this.game.time * 0.001).toFixed(1),
      40,
      160
    );

    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 45 * i + 40, 185, 45, 45);
    }

    // game over messages
    if (this.game.gameOver) {
      context.textAlign = "center";
      context.font = this.fontSize * 2 + "px " + this.fontFamily;
      if (this.game.score > this.game.winningScore) {
        context.fillText(
          "성공",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        context.fillText(
          "다음단계",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        context.fillText(
          "실패",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        context.fillText(
          "분발하자잉",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    context.restore();
  }
}
