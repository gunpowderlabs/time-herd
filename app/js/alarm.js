export default function alarm(ngAudio, alarmNotification) {
  var sound = ngAudio.load("sounds/alarm.mp3");
  sound.loop = true;
  return {
    start() {
      sound.play();
      alarmNotification.show();
    },
    stop() {
      sound.stop();
      alarmNotification.hide();
    }
  };
}

