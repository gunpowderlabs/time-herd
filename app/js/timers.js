export function timer(serverTime, $interval) {
  return function({secondsLeft = 25*60, timerSync = {$save: angular.noop}}) {
    var timer = {
      get id() { return timerSync.$id; },
      get status() {
        if (this.finished) { return 'finished'; }
        return this.actions.length.isEven() ? 'paused' : 'running';
      },
      get length() { return this._length; },
      set length(length) {
        this.actions = [];
        this.finished = false;
        this._length = length;
      },

      actions: [],

      onFinish(callback) {
        this.callback = callback
      },

      runFinishCallback() {
        (this.callback || angular.noop)();
      },

      millisPassed() {
        return this.actions
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
        this.actions.push(serverTime());
        return this;
      },

      start() {
        this.actions.push(serverTime());
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

    timer.length = secondsLeft;

    return timer;
  };
}
