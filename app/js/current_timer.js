export default function currentTimer($window, chance, timer, $firebaseObject, timerIdStream) {
  var timerInstance;
  function firebaseTimer(timerId = chance.hash()) {
    var timersRef = new $window.Firebase("https://shining-heat-7954.firebaseio.com/timers");
    return $firebaseObject(timersRef.child(timerId));
  }

  timerIdStream.onValue(id => {
    timerInstance = timer({timerSync: firebaseTimer(id)});
  });

  return function() {
    timerInstance = timerInstance || timer({timerSync: firebaseTimer()});
    return timerInstance;
  }
}

