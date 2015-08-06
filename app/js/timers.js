export function timer(serverTime, $interval) {
  return function({secondsLeft = 25*60, timerSync = undefined, reset = true}) {
    const timer = {
      get id() { return timerSync.controls.$id; },
      get status() {
        if (this.finished) { return 'finished'; }
        return timerSync.actions.length.isEven() ? 'paused' : 'running';
      },
      get length() { return timerSync.controls.length; },
      set length(length) {
        timerSync.controls.length = length;
        timerSync.controls.$save();
        timerSync.actions.map(action => timerSync.actions.$remove(action));
        this.finished = false;
      },

      onFinish(callback) {
        this.callback = callback
      },

      runFinishCallback() {
        (this.callback || angular.noop)();
      },

      millisPassed() {
        return timerSync.actions.map('$value')
          .concat([serverTime()])
          .inGroupsOf(2)
          .filter(([start, end]) => start && end)
          .map(([start, end]) => end - start)
          .reduce((a, b) => a + b, 0);
      },

      secondsPassed() {
        return (this.millisPassed() / 1000).round();
      },

      millisLeft() {
        const left = this.length * 1000 - this.millisPassed();
        return left < 0 ? 0 : left;
      },

      secondsLeft() {
        return (this.millisLeft() / 1000).round();
      },

      stop() {
        timerSync.actions.$add(serverTime());
        return this;
      },

      start() {
        timerSync.actions.$add(serverTime());
        $interval(() => {
          if (this.millisLeft() <= 0) {
            this.finished = true;
            this.runFinishCallback();
          }
        }, this.millisLeft());

        return this;
      },

      reset() {
        this.length = this.length;
      }
    }

    if (reset) { timer.length = secondsLeft; }

    return timer;
  };
}
