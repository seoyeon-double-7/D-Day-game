import { Dust, Fire, Splash } from "./particles.js";

// 플레이어 상태
const states = {
  SITTING: 0, //0
  RUNNING: 1, //0
  JUMPING: 2, //2
  FALLING: 3, //3
  ROLLING: 4, // 2
  DIVING: 5, // 6
  HIT: 6, // 8
};

// TODO : 무적 상태있대만 ROLLING state로 세팅할 수 있게 하기

class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

// 멈춰있을 때
export class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
  }
  enter() {
    // 프레임 세팅
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 7;
    this.game.player.frameY = 0;
  }
  handleInput(input) {
    // 좌우 눌렀을 때 running state로 바꿔주기
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.game.player.setState(states.RUNNING, 1);
    }
    // 엔터 눌렀을 때 rolling state로 바꿔주기
    else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING, 1);
    }
  }
}

// 달릴때
export class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }
  enter() {
    // 프레임 세팅
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 7;
    this.game.player.frameY = 0;
  }
  handleInput(input) {
    // 달릴때 먼지 이펙트 실해
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height
      )
    );

    // 아래키 눌렀을 때 sitting state로 바꿔주기
    if (input.includes("ArrowDown")) {
      this.game.player.setState(states.SITTING, 0);
    }
    // 업키 눌렀을 때 jumping state로 바꿔주기
    else if (input.includes("ArrowUp")) {
      // console.log("running에서 jumping으로");
      this.game.player.setState(states.JUMPING, 1);
    }
    // 엔터 눌렀을 때 rolling state로 바꿔주기
    // TODO : 무적일때만 실행하게
    else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING, 1);
    }
  }
}

// 점프할 때
export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }
  enter() {
    this.game.player.onPlatform = true;
    // 프레임 세팅
    if (this.game.player.onPlatform) {
      // console.log("-27한다잉");
      this.game.player.vy -= 27;
    }
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 5;
    this.game.player.frameY = 2;
  }
  handleInput(input) {
    // 착지 이벤트
    // vy가 1보다클때 착지 이벤트 실행
    if (this.game.player.vy > this.game.player.weight) {
      // console.log("착지 이벤트");
      this.game.player.setState(states.FALLING, 1);
    }
    // 엔터 눌렀을때 roling state(무적)
    else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING, 1);
    }
    // 다운키 눌렀을 때 diving state(밑으로 가라앉기)
    else if (input.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

// 점프 후 착지까지
export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }
  enter() {
    if (this.game.player.onPlatform) this.game.player.vy -= 30;
    // 프레임 세팅
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 5;
    this.game.player.frameY = 3;
  }
  handleInput(input) {
    // console.log("착지");
    // 캐릭터가 땅 혹은 발판 위에 착지하면 running state로 세팅
    if (this.game.player.onPlatform) {
      this.game.player.setState(states.RUNNING, 1);
    }
    // 다운키 누르면 diving state로 세팅
    else if (input.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

// 무적 상태
export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }
  enter() {
    // 프레임 세팅
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 5;
    this.game.player.frameY = 2;
  }
  handleInput(input) {
    // fire effect
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );

    // 엔터 안누르고 바닥이나 발판에 있으면 Running state로
    if (!input.includes("Enter") && this.game.player.onPlatform) {
      this.game.player.setState(states.RUNNING, 1);
    }
    // 엔터 안누르고 바닥이나 발판에 없으면 FALLING state로
    else if (!input.includes("Enter") && !this.game.player.onPlatform) {
      this.game.player.setState(states.FALLING, 1);
    }
    // 엔터, 업키 누르고 바닥이나 발판에 있으면 vy -=27
    else if (
      input.includes("Enter") &&
      input.includes("ArrowUp") &&
      this.game.player.onPlatform
    ) {
      this.game.player.vy -= 27;
    }
    //
    else if (input.includes("ArrowDown") && !this.game.player.onPlatform) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

// 위에서 아래로 내려갈때
export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }
  enter() {
    // 프레임 세팅
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 5;
    this.game.player.frameY = 6;
    this.game.player.vy = 15;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );

    if (this.game.player.onPlatform) {
      this.game.player.setState(states.RUNNING, 1);
      for (let i = 0; i < 30; i++) {
        this.game.particles.unshift(
          new Splash(
            this.game,
            this.game.player.x + this.game.player.width * 0.5,
            this.game.player.y + this.game.player.height
          )
        );
      }
    } else if (input.includes("Enter") && !this.game.player.onPlatform) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

// 충돌
export class Hit extends State {
  constructor(game) {
    super("HIT", game);
  }
  enter() {
    // 프레임 세팅
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 5;
    this.game.player.frameY = 8;
  }
  handleInput(input) {
    if (this.game.player.frameX >= 5) {
      if (this.game.player.onPlatform) {
        this.game.player.setState(states.RUNNING, 1);
      } else if (!this.game.player.onPlatform) {
        this.game.player.setState(states.FALLING, 1);
      }
    }
  }
}
