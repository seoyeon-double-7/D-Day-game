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
    this.quote = {
      contenst: [
        "삶이 있는 한 희망은 있다",
        "시간을 지배할 줄 아는 사람은\n인생을 지배할 줄 아는 사람이다.",
        "짧은 인생은 시간낭비에 의해\n더욱 짧아진다",
        "그대의 하루하루를 그대의\n마지막 날이라고 생각하라.",
        "소심하게 굴기에 인생은\n너무나 짧습니다.",
        "희망과 근심 가운데 하루 하루를 마지막이라고 생각하라."
      ],
      author: [
        "키케로",
        "에센 바흐",
        "S.존슨",
        "호라티우스",
        "카네기",
        "호레스"
      ]

    }
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
    // 시간
    // console.log(
    //   (this.game.maxTime / 1000 -
    //     parseInt((this.game.time / this.game.maxTime) * 100)) *
    //     8.75
    // );
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
      context.drawImage(
        this.clear1Image,
        this.game.width * 0.5 - 400,
        this.game.height * 0.5 - 300
      );
      // 스코어
      context.font = 60 + "px " + this.fontFamily;
      context.fillText(this.game.score, 1020, 580);

      let qNum = parseInt(Math.random() * 5)

      // 명언 문구
      context.font = 30 + "px " + this.fontFamily;
      context.fillText(this.quote.contenst[qNum], 900, 730);
      context.font = 28 + "px " + this.fontFamily;

      // 명언 인물
      context.fillText(this.quote.author[qNum], 915, 775);

    }

    // 게임 오버했을 때
    else if (this.game.gameOver) {
      // 게임 오버 이미지

      context.drawImage(
        this.over1Image,
        this.game.width * 0.5 - 400,
        this.game.height * 0.5 - 300
      );
      // 스코어
      context.font = 60 + "px " + this.fontFamily;
      context.fillText(this.game.score, 1020, 580);

      let qNum = parseInt(Math.random() * 5)

      // 명언 문구
      context.font = 30 + "px " + this.fontFamily;
      context.fillText(this.quote.contenst[qNum], 900, 730);
      context.font = 28 + "px " + this.fontFamily;

      // 명언 인물
      context.fillText(this.quote.author[qNum], 915, 775);
    }
    context.restore();
  }
}