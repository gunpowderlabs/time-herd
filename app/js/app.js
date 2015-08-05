import "almond";
import "sugarjs";
import ionic from "ionic";
import ngCordova from "ng-cordova"
import angularfire from "angularfire"
import angularSVGRoundProgress from "angular-svg-round-progressbar";
import ngAutofocus from "ng-autofocus";
import ngAudio from "ng-audio";
import Bacon from "bacon";
import Chance from "chance";

import * as timers from './timers';
import {duration} from './filters';
import $cordovaShake from './shake';
import timerIdStream from './timer_id_stream';
import currentTimer from './current_timer';
import serverTime from './server_time';
import timerDirective from './timer_directive';

var openURLStream = new Bacon.Bus();
window.handleOpenURL = (url) => openURLStream.push(url)

var app = angular.module('timeherd', [ionic.name, angularfire.name, angularSVGRoundProgress.name,
    ngAutofocus.name, ngAudio.name, ngCordova.name]);

app.controller('TimerController', timers.TimerController);
app.factory('timer', timers.timer);
app.filter('duration', duration);
app.factory('$cordovaShake', $cordovaShake);
app.factory('currentTimer', currentTimer);
app.value('openURLStream', openURLStream);
app.factory('timerIdStream', timerIdStream);
app.value('chance', Chance());
app.factory('serverTime', serverTime);
app.directive('timer', timerDirective);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.run(function($rootScope) {
  Bacon.Observable.prototype.$onValue = function() {
    const self = this;
    const args = arguments;
    $rootScope.$apply(() => Bacon.Observable.prototype.onValue.apply(self, args));
  };
});

export function run() {
  angular.bootstrap(document, [app.name]);
};
