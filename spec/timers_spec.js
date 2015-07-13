import * as app from '../app';

describe("Timer", () => {
  beforeEach(module('starter'));

  it("newly created timer is running", inject(timer => {
    expect(timer().secondsLeft).toEqual(25*60);
    expect(timer().pause).toEqual(false);
  }));

  it("counts down the timer", inject((timer, $interval) => {
    var t = timer(100);

    $interval.flush(5000);

    expect(t.secondsLeft).toEqual(95);
  }));

  it("doesn't go below zero", inject((timer, $interval) => {
    var t = timer(5);

    $interval.flush(10000);

    expect(t.secondsLeft).toEqual(0);
  }));

  it("doesn't count down if timer is paused", inject((timer, $interval) => {
    var t = timer(5);
    t.stop();

    $interval.flush(10000);

    expect(t.secondsLeft).toEqual(5);
  }));
});
