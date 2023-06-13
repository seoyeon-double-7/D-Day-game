export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    // font 써주기
    this.fontFamily = "Helvetica";
    this.livesImage = document.getElementById("lives");
    this.nextImage = document.getElementById("next");
  }
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;

    context.font = this.fontSize + "px " + this.fontFamily;
    // context.font = this.fontSize * 2 + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    // score
    context.fillText("점수: " + this.game.score, 40, 100);

    // timer

    context.fillText(
      "남은시간 : " +
        (this.game.maxTime * 0.001 - this.game.time * 0.001).toFixed(1),
      200,
      100
    );

    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 45 * i + 500, 70, 45, 45);
    }

    context.textAlign = "center";

    // 게임 클리어
    if (this.game.gameClear) {
      // 간단한 시나리오 넣어주기

      // if (this.game.score > this.game.winningScore) {
      // }
      context.font = this.fontSize * 0.7 + "px " + this.fontFamily;

      context.fillText(
        "SCORE " + this.game.score,
        this.game.width * 0.5,
        this.game.height * 0.5 - 40
      );
      context.font = this.fontSize * 2 + "px " + this.fontFamily;

      context.fillText(
        "GAME CLEAR!",
        this.game.width * 0.5,
        this.game.height * 0.5 - 20
      );
      context.font = this.fontSize * 0.7 + "px " + this.fontFamily;

      context.fillText(
        "다음단계",
        this.game.width * 0.5,
        this.game.height * 0.5 + 20
      );

      context.drawImage(
        this.nextImage,
        this.game.width,
        this.game.height * 0.5 + 20,
        290,
        124
      );
    }

    // 게임 오버
    else if (this.game.gameOver) {
      context.font = this.fontSize * 2 + "px " + this.fontFamily;
      context.fillText(
        "실패",
        this.game.width * 0.5,
        this.game.height * 0.5 - 20
      );
      context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
      context.fillText(
        "홈으로 가기",
        this.game.width * 0.5,
        this.game.height * 0.5 + 20
      );
    }
    context.restore();
  }
}
