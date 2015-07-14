import * as timers from './timers';
import {duration} from './filters';

var app = angular.module('starter', ['ionic', 'firebase', 'angular-svg-round-progress',
    'ng-autofocus', 'ngAudio']);

app.controller('TimerController', timers.TimerController);
app.factory('timer', timers.timer);
app.filter('duration', duration);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

export function run() {
  angular.bootstrap(document, [app.name]);
};
