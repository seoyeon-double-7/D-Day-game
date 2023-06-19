export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 50;
    // font 써주기
    this.fontFamily = "DungGeunMo";
    this.livesImage = document.getElementById("lives");
    this.nextImage = document.getElementById("next");
    this.coinbarImage = document.getElementById("coin_bar");
    this.timeImage = document.getElementById("time");
    this.timebarImage = document.getElementById("time_bar");
    this.timebar2Image = document.getElementById("time_bar2");
    this.over1Image = document.getElementById("stage1_over");
    this.clear1Image = document.getElementById("stage1_clear");
  }
  draw(context) {
    context.save();

    // ctx  설정
    // context.shadowOffsetX = 2;
    // context.shadowOffsetY = 2;
    // context.shadowColor = "white";
    // context.shadowBlur = 0;
    context.font = this.fontSize + "px " + this.fontFamily;

    // context.font = this.fontSize * 2 + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;

    // 스테이지
    context.fillText("STAGE1", 50, 85);

    // 점수
    context.drawImage(this.coinbarImage, 250, 45, 190, 60);
    context.font = 25 + "px " + this.fontFamily;
    context.fillText(this.game.score, 360, 82);

    // 남은시간 그려주기
    // TODO : 남은 시간 계산해서 timer bar로 변경
    context.drawImage(this.timeImage, 600, 45, 60, 75);
    context.drawImage(this.timebar2Image, 673, 65, 710, 45);
    context.drawImage(
      this.timebarImage,
      680,
      70,
      (this.game.maxTime / 1000 - (this.game.time / this.game.maxTime) * 100) *
        8.75,
      30
    );
    console.log(
      (this.game.maxTime / 1000 -
        parseInt((this.game.time / this.game.maxTime) * 100)) *
        8.75
    );
    // context.fillText(
    //   (this.game.maxTime * 0.001 - this.game.time * 0.001).toFixed(1),
    //   710,
    //   90
    // );

    // 그림자
    // context.shadowOffsetX = 10;
    // context.shadowOffsetY = 10;
    // context.shadowColor = "black";
    // context.shadowBlur = 30;

    // 생명 그려주기
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 70 * i + 1600, 55, 45, 45);
    }
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.textAlign = "center";

    // 게임 클리어했을 때
    if (this.game.gameClear) {
      context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
      context.drawImage(
        this.clear1Image,
        this.game.width * 0.5,
        this.game.height * 0.5
      );
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
        this.game.width * 0.5 - 400,
        this.game.height * 0.5 - 300,
        290,
        124
      );
    }

    // 게임 오버했을 때
    else if (this.game.gameOver) {
      context.font = this.fontSize * 2 + "px " + this.fontFamily;
      context.drawImage(
        this.over1Image,
        this.game.width * 0.5 - 400,
        this.game.height * 0.5 - 300
      );
      // context.fillText("실패", this.game.width * 0.5, this.game.height * 0.5);
      // context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
      // context.fillText(
      //   "홈으로 가기",
      //   this.game.width * 0.5,
      //   this.game.height * 0.5 + 20
      // );
    }
    context.restore();
  }
}
