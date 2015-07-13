export class TimerController {
  constructor($interval, $firebaseObject, $scope) {
    var ref = new Firebase("https://shining-heat-7954.firebaseio.com/timer");
    this.timer = $firebaseObject(ref);

    this.timer.secondsLeft = 10;
    this.pause = false;
    this.$interval = $interval;
    this.start();
  }
  stop() {
    this.timer.pause = true;
    this.timer.$save();
    this.$interval.cancel(this.tick);
  }
  start() {
    this.timer.pause = false;
    this.timer.$save();
    if (this.timer.secondsLeft <= 0) { return; }
    this.tick = this.$interval(() => {
      this.timer.secondsLeft -= 1
      this.timer.$save();
    }, 1000, this.timer.secondsLeft);
  }
}

export function timer() {
  return {secondsLeft: 100};
}
