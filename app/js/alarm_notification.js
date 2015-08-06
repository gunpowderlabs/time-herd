export default function($cordovaLocalNotification) {
  return {
    show() {
      if (!window.cordova) { return; }
      $cordovaLocalNotification.schedule({
        id: 0,
        text: 'Time passed! Tap this notification to stop the alarm.',
        sound: null
      });
    },

    hide() {
      if (!window.cordova) { return; }
      $cordovaLocalNotification.cancel(0);
    }
  }
}
