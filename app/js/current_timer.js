export default function currentTimer($window, chance, timer, $firebaseObject,
    $firebaseArray, timerIdStream, alarm, alarmStopStream) {
  let timerInstance;
  function firebaseTimer(timerId = chance.hash()) {
    const timersRef = new $window.Firebase("https://shining-heat-7954.firebaseio.com/timers");
    const timerRef = timersRef.child(timerId);
    return {
      controls: $firebaseObject(timerRef),
      actions: $firebaseArray(timerRef.child("actions"))
    };
  }

  function buildTimer(id) {
    timerInstance = timer({timerSync: firebaseTimer(id), reset: !id});
    timerInstance.onFinish(alarm.start);
    alarmStopStream.$onValue(() => {
      if(timerInstance.status !== 'finished') { return; }
      alarm.stop();
      timerInstance.reset();
    });
    return timerInstance;
  }

  timerIdStream.onValue(buildTimer);

  function current() {
    return timerInstance || buildTimer();
  }

  current.destroy = () => {
    alarmStopStream.push();
    if (timerInstance) { timerInstance.destroy(); }
    buildTimer();
  }

  return current;
}

