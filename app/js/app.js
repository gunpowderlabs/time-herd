import "almond";
import "sugarjs";
import ionic from "ionic";
import ngCordova from "ng-cordova"
import angularfire from "angularfire"
import angularSVGRoundProgress from "angular-svg-round-progressbar";
import ngAutofocus from "ng-autofocus";
import ngAudio from "ng-audio";
import Bacon from "bacon";

import * as timers from './timers';
import {duration} from './filters';
import $cordovaShake from './shake';

var openURLStream = new Bacon.fromBinder(sink => {
  window.handleOpenURL = sink;
  return angular.noop;
});

var app = angular.module('starter', [ionic.name, angularfire.name, angularSVGRoundProgress.name,
    ngAutofocus.name, ngAudio.name, ngCordova.name]);

app.controller('TimerController', timers.TimerController);
app.factory('timer', timers.timer);
app.filter('duration', duration);
app.factory('$cordovaShake', $cordovaShake);
app.factory('currentTimer', timers.currentTimer);
app.value('openURLStream', openURLStream);

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
