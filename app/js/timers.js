export class TimerController {
  constructor(timer, ngAudio) {
    this.timer = timer();
    this.alarm = ngAudio.load("sounds/alarm.mp3");
    this.alarm.loop = true;
    this.timer.onFinish(() => this.alarm.play());
    this.length = this.timer.length;
  }
  stop() {
    this.timer.stop();
  }
  start() {
    this.timer.start();
  }

  edit() {
    this.length = this.timer.length;
    this.underEdition = true;
  }

  closeEditForm() {
    this.underEdition = false;
  }

  updateTimer() {
    this.timer.length = this.length;
    this.underEdition = false;
    this.timer.start();
  }
}

export function timer($firebaseObject, $interval) {
  return function(secondsLeft = 25*60) {
    var ref = new Firebase("https://shining-heat-7954.firebaseio.com/timer");
    var timerSync = $firebaseObject(ref);

    var timer = {
      get secondsLeft() { return timerSync.secondsLeft; },
      get secondsPassed() { return timerSync.length - timerSync.secondsLeft },
      get paused() { return timerSync.paused; },
      get length() { return timerSync.length; },
      set length(length) {
        this.stop();
        timerSync.length = length;
        timerSync.secondsLeft = length;
        timerSync.$save();
      },

      onFinish(callback) {
        this.callback = callback
      },

      runFinishCallback() {
        (this.callback || angular.noop)();
      },

      stop() {
        timerSync.paused = true;
        timerSync.$save();

        $interval.cancel(timer.tick);
        return this;
      },

      start() {
        timerSync.paused = false;
        timerSync.$save();

        if (timerSync.secondsLeft <= 0) { return; }
        timer.tick = $interval(() => {
          timerSync.secondsLeft -= 1
          timerSync.$save();

          if (timerSync.secondsLeft === 0) { this.runFinishCallback(); }
        }, 1000, timerSync.secondsLeft);
        return this;
      }
    }

    timer.length = secondsLeft;

    return timer;
  };
}
