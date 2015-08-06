export default class TimerController {
  constructor(currentTimer, alarmStopStream,  $cordovaSocialSharing) {
    this.$cordovaSocialSharing = $cordovaSocialSharing;
    this.alarmStopStream = alarmStopStream;
    this.timer = currentTimer;
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
    this.alarmStopStream.push();
  }

  destroy() {
    this.timer.destroy();
  }
}

