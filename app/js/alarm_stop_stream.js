export default function($rootScope, $cordovaShake) {
  var alarmStopStream = new Bacon.Bus();

  $rootScope.$on('$cordovaLocalNotification:click', () => alarmStopStream.push());
  $cordovaShake.watch(() => alarmStopStream.push(), 20);

  return alarmStopStream;
}
