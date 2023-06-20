class Layer {
  // 기본 세팅
  constructor(game, width, height, speedModifier, image) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.frSize = this.game.width * 2;
    this.speedModifier = speedModifier;
    this.image = image;
    this.bgNum = 1;
    this.x = 0;
    this.y = 0;
  }
  update() {
    // 1920 맵 하나 넘어갈때 bgNum 1씩 증가시켜주기
    if (this.x.toFixed(0) == -this.frSize) {
      this.bgNum++;
    }

    // 전체 배경 하나가 넘어갈때 x좌표 0으로 세팅(배경 이여붙여주기 위함)
    if (this.x < -this.width) {
      this.x = 0;
    } else this.x -= this.game.speed * this.speedModifier;
  }

  //  레이어 draw(기본)
  draw(context) {
    // 첫번째 배경 이미지
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    // 두번째 배경 이미지
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
  // 맵 배경화면   설정
  setMap(map) {}
}

export class Background {
  // 배경 세팅
  constructor(game) {
    this.game = game;
    this.width = 5760;
    this.height = 1080;

    this.layer1image = document.getElementById(
      `bg${this.game.currentMapIndex + 1}_1`
    );

    // this.layer4image = document.getElementById("layer4");
    // this.layer5image = document.getElementById("layer5");
    // this.layer1 = new Layer(
    //   this.game,
    //   this.width,
    //   this.height,
    //   0,
    //   this.layer1image
    // );
    // this.layer2 = new Layer(
    //   this.game,
    //   this.width,
    //   this.height,
    //   0.2,
    //   this.layer2image
    // );
    this.layer1 = new Layer(
      this.game,
      this.width,
      this.height,
      0.4,
      this.layer1image
    );
    // this.layer4 = new Layer(
    //   this.game,
    //   this.width,
    //   this.height,
    //   0.8,
    //   this.layer4image
    // );
    // this.layer5 = new Layer(
    //   this.game,
    //   this.width,
    //   this.height,
    //   1,
    //   this.layer5image
    // );
    // 배경화면 요소 5개 동시에 배경으로 찍어주기
    this.background1Layers = [
      this.layer1,
      // this.layer4,
      // this.layer5,
    ];
  }

  // 배경화면 초기화
  reset() {
    this.background1Layers.forEach((layer) => {
      layer.x = 0;
      layer.bgNum = 1;
      layer.image = document.getElementById(
        `bg${this.game.currentMapIndex + 1}_1`
      );
    });
  }

  update() {
    this.background1Layers.forEach((layer) => {
      layer.update();
    });
  }
  draw(context) {
    this.background1Layers.forEach((layer) => {
      layer.draw(context);
    });
  }
  setMap(map) {
    this.background1Layers.forEach((layer) => {
      layer.setMap(map);
    });
  }
}
