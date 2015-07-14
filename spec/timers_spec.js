import * as app from '../app';

describe("Timer", () => {
  beforeEach(module('starter'));

  it("newly created timer is paused", inject(timer => {
    expect(timer().secondsLeft).toEqual(25*60);
    expect(timer().status).toEqual('paused');
  }));

  it("counts down the timer", inject((timer, $interval) => {
    var t = timer(100).start();

    $interval.flush(5000);

    expect(t.secondsLeft).toEqual(95);
  }));

  it("doesn't go below zero", inject((timer, $interval) => {
    var t = timer(5).start();

    $interval.flush(10000);

    expect(t.secondsLeft).toEqual(0);
  }));

  it("resets when length is changed", inject((timer, $interval) => {
    var t = timer(5).start();
    t.length = 4;

    $interval.flush(10000);

    expect(t.secondsLeft).toEqual(4);
    expect(t.length).toEqual(4);
    expect(t.status).toEqual('paused');
  }));

  it("doesn't count down if timer is paused", inject((timer, $interval) => {
    var t = timer(5).start();
    t.stop();

    $interval.flush(10000);

    expect(t.secondsLeft).toEqual(5);
  }));

  it("fires onFinish callback when countdown completes", inject((timer, $interval) => {
    var t = timer(5).start();
    var finishSpy = jasmine.createSpy();
    t.onFinish(finishSpy);

    $interval.flush(5000);

    expect(finishSpy).toHaveBeenCalled();
    expect(t.status).toEqual('finished');
  }));

  it("it doesn't fire onFinish callback when countdown isn't completed", inject((timer, $interval) => {
    var t = timer(5).start();
    var finishSpy = jasmine.createSpy();
    t.onFinish(finishSpy);

    $interval.flush(4000);

    expect(finishSpy).not.toHaveBeenCalled();
    expect(t.status).toEqual('running');
  }));

  it("resets the timer", inject((timer, $interval) => {
    var t = timer(5).start();
    $interval.flush(1000);
    t.reset();

    expect(t.secondsLeft).toEqual(5);
    expect(t.status).toEqual('paused');
  }));
});
