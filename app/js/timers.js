export class TimerController {
  constructor(timer, ngAudio, $ionicPlatform, $cordovaShake, $cordovaSocialSharing) {
    this.$cordovaSocialSharing = $cordovaSocialSharing;

    this.alarm = ngAudio.load("sounds/alarm.mp3");
    this.alarm.loop = true;

    this.timer = timer();
    this.timer.onFinish(() => this.alarm.play());

    $cordovaShake.watch(() => {
      if(this.timer.status === 'finished') { this.stop(); }
    }, 20);
  }

  share() {
    this.$cordovaSocialSharing.share(undefined, "Share a timer with me at TimeHerd",
      undefined, "https://timeherd.divshot.io");
  }

  pause() {
    this.timer.stop();
  }

  start() {
    this.timer.start();
  }

  stop() {
    this.alarm.stop();
    this.timer.reset();
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
      get status() { return timerSync.status; },
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
        timerSync.status = 'paused';
        timerSync.$save();

        $interval.cancel(timer.tick);
        return this;
      },

      start() {
        timerSync.status = 'running';
        timerSync.$save();

        if (timerSync.secondsLeft <= 0) { return; }
        timer.tick = $interval(() => {
          timerSync.secondsLeft -= 1

          if (timerSync.secondsLeft === 0) {
            timerSync.status = 'finished';
            this.runFinishCallback();
          }
          timerSync.$save();
        }, 1000, timerSync.secondsLeft);
        return this;
      },

      reset() {
        this.length = this.length;
      }
    }

    timer.length = secondsLeft;

    return timer;
  };
}
