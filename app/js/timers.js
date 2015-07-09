export class TimerController {
  constructor($interval) {
    this.timer = {secondsLeft: 10, pause: false};
    this.$interval = $interval;
    this.start();
  }
  stop() {
    this.timer.pause = true;
    this.$interval.cancel(this.tick);
  }
  start() {
    this.timer.pause = false;
    if (this.timer.secondsLeft <= 0) { return; }
    this.tick = this.$interval(() => this.timer.secondsLeft -= 1, 1000, this.timer.secondsLeft);
  }
}
