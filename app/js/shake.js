export default function $cordovaShake($ionicPlatform, $timeout) {
  return {
    watch(callback, threshold) {
      $ionicPlatform.ready().then(() => {
        if (typeof shake !== 'undefined') {
          shake.startWatch(() => $timeout(callback), threshold);
        }
      });
    }
  }
}
