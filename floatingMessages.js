export class FloatingMessages {
  // 메시지 기본 세팅
  constructor(value, x, y, targetX, targetY) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.markedForDeletion = false;
    this.timer = 0;
  }

  // 메시지 update
  update() {
    // xy값 좌측 상단으로 서서히 이동
    this.x += (this.targetX - this.x) * 0.03;
    this.y += (this.targetY - this.y) * 0.03;
    this.timer++;
    // timer가 100이 넘으면 메시지 없애주기
    if (this.timer > 100) this.markedForDeletion = true;
  }

  // 메시지 draw
  draw(context) {
    // 메시지 세팅
    context.font = "20px Creepster";
    context.fillStyle = "white";
    context.fillText(this.value, this.x, this.y);
    context.fillStyle = "black";
    context.fillText(this.value, this.x + 2, this.y + 2);
  }
}
