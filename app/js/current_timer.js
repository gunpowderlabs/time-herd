export default function currentTimer($window, chance, timer, $firebaseObject, timerIdStream, alarm, alarmStopStream) {
  let timerInstance;
  function firebaseTimer(timerId = chance.hash()) {
    var timersRef = new $window.Firebase("https://shining-heat-7954.firebaseio.com/timers");
    return $firebaseObject(timersRef.child(timerId));
  }

  function buildTimer(id) {
    timerInstance = timer({timerSync: firebaseTimer(id)});
    timerInstance.onFinish(alarm.start);
    alarmStopStream.$onValue(() => {
      if(timerInstance.status !== 'finished') { return; }
      alarm.stop();
      timerInstance.reset();
    });
    return timerInstance;
  }

  timerIdStream.onValue(buildTimer);

  return function() {
    return timerInstance || buildTimer();
  }
}

