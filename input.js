export class InputHandler {
  constructor(game) {
    this.game = game;
    // 이벤트 key 담는 배열
    this.keys = [];
    window.addEventListener("keydown", (e) => {
      if (
        (e.code === "ArrowDown" ||
          e.code === "ArrowUp" ||
          e.code === "ArrowRight" ||
          e.code === "ArrowLeft" ||
          e.code === "Space") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.code);
      }
      // 디버그 모드
      else if (e.key === "d") {
        this.game.debug = !this.game.debug;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (
        e.code === "ArrowDown" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowRight" ||
        e.code === "ArrowLeft" ||
        e.code === "Space"
      ) {
        this.keys.splice(this.keys.indexOf(e.code), 1);
      }
    });
  }
}
