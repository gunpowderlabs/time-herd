export class TimerController {
  constructor(currentTimer, ngAudio, $cordovaShake, $cordovaSocialSharing, $cordovaLocalNotification, $rootScope) {
    this.$cordovaSocialSharing = $cordovaSocialSharing;
    this.$cordovaLocalNotification = $cordovaLocalNotification;

    this.alarm = ngAudio.load("sounds/alarm.mp3");
    this.alarm.loop = true;

    this.timer = currentTimer;
    this.timer().onFinish(() => {
      this.alarm.play();
      $cordovaLocalNotification.schedule({
        id: 0,
        text: 'Time passed! Tap this notification to stop the alarm.',
        sound: null
      });
    });

    $rootScope.$on('$cordovaLocalNotification:click', () => this.stop());
    $cordovaShake.watch(() => this.stop(), 20);
  }

  share() {
    this.$cordovaSocialSharing.share(undefined, "Share a timer with me at TimeHerd",
      undefined, `https://timeherd.divshot.io/${this.timer().id}`);
  }

  pause() {
    this.timer().stop();
  }

  start() {
    this.timer().start();
  }

  stop() {
    if(this.timer().status !== 'finished') { return; }
    this.alarm.stop();
    this.$cordovaLocalNotification.clear(0);
    this.timer().reset();
  }

  edit() {
    this.length = this.timer().length;
    this.underEdition = true;
  }

  closeEditForm() {
    this.underEdition = false;
  }

  updateTimer() {
    this.timer().length = this.length;
    this.underEdition = false;
    this.timer().start();
  }
}

export function timer($interval) {
  return function({secondsLeft = 25*60, timerSync = {$save: angular.noop}}) {
    var timer = {
      get id() { return timerSync.$id },
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
