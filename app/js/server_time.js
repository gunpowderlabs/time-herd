export default function($interval, $http, $log) {
  let bestOffset = 0;
  let bestPrecision;
  function adjustOffest(times) {
    const precision = (times.response - times.request) - 2;
    const offset = times.server + precision - times.response;
    if (!bestPrecision || bestPrecision > precision) {
      bestOffset = offset;
      bestPrecision = precision;
    }
  }
  function getServerTime() {
    const times = {request: null, response: null, server: null};
    const request = new XMLHttpRequest();
    request.open('GET', 'http://time.jsontest.com/');
    request.onreadystatechange = function() {
      if (this.readyState === this.HEADERS_RECEIVED) {
        times.response = Date.now();
      };
    }
    request.onload = function() {
      if (this.status === 200) {
        times.server = JSON.parse(this.response).milliseconds_since_epoch;
        adjustOffest(times);
      } else {
        $log.error("Request failed", this.reponse);
      }
    }
    times.request = Date.now();
    request.send();
  }

  $interval(getServerTime, 500, 10);

  return function() {
    return Date.now() + bestOffset;
  };
}
