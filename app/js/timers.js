export class TimerController {
  constructor($scope, timer) {
    this.timer = timer()
  }
  stop() {
    this.timer.stop();
  }
  start() {
    this.timer.start();
  }
}

export function timer($firebaseObject, $interval) {
  return function(secondsLeft = 25*60) {
    var ref = new Firebase("https://shining-heat-7954.firebaseio.com/timer");
    var timerSync = $firebaseObject(ref);

    timerSync.secondsLeft = secondsLeft;
    timerSync.length = secondsLeft;
    timerSync.pause = false;

    var timer = {
      get secondsLeft() { return timerSync.secondsLeft; },
      get secondsPassed() { return timerSync.length - timerSync.secondsLeft },
      get length() { return timerSync.length; },
      get pause() { return timerSync.pause; },

      stop() {
        timerSync.pause = true;
        timerSync.$save();

        $interval.cancel(timer.tick);
      },

      start() {
        timerSync.pause = false;
        timerSync.$save();

        if (timerSync.secondsLeft <= 0) { return; }
        timer.tick = $interval(() => {
          timerSync.secondsLeft -= 1
          timerSync.$save();
        }, 1000, timerSync.secondsLeft);
      }
    }

    timer.start();

    return timer;
  };
}
