export default function $cordovaShake($ionicPlatform) {
  return {
    watch(callback, threshold) {
      $ionicPlatform.ready().then(() => {
        if (typeof shake !== 'undefined') {
          shake.startWatch(callback, threshold);
        }
      });
    }
  }
}
