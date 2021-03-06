import "spec_helper";

describe("Timer", () => {
  function timerSyncMock() {
    const actions = [];
    actions.$add = i => actions.push({$value: i});;
    actions.$remove = actions.remove;
    return {
      controls: {
        $id: 'foo',
        $save: angular.noop
      },
      actions: actions
    }
  }
  let mockedServerTimeValue;

  beforeEach(module('timeherd'));
  beforeEach(module($provide => {
    mockedServerTimeValue = 1000;
    $provide.value('serverTime', function() { return mockedServerTimeValue; });
    $provide.decorator('timer', $delegate => {
      return function(opts) {
        opts.timerSync = timerSyncMock();
        return $delegate(opts);
      };
    });
  }));

  it("newly created timer is paused", inject(timer => {
    expect(timer({}).secondsLeft()).toEqual(25*60);
    expect(timer({}).status).toEqual('paused');
  }));

  it("returns the timer id", inject(timer => {
    var t = timer({});
    expect(t.id).toEqual('foo');
  }));

  it("counts down the timer", inject((timer) => {
    var t = timer({secondsLeft: 100}).start();

    mockedServerTimeValue = 6000;

    expect(t.secondsLeft()).toEqual(95);
  }));

  it("doesn't go below zero", inject((timer) => {
    var t = timer({secondsLeft: 5}).start();

    mockedServerTimeValue = 8000;

    expect(t.secondsLeft()).toEqual(0);
  }));

  it("resets when length is changed", inject((timer) => {
    var t = timer({secondsLeft: 5}).start();
    t.length = 4;

    expect(t.secondsLeft()).toEqual(4);
    expect(t.length).toEqual(4);
    expect(t.status).toEqual('paused');
  }));

  it("doesn't count down if timer is paused", inject((timer) => {
    var t = timer({secondsLeft: 5}).start();
    t.stop();

    mockedServerTimeValue = 6000;

    expect(t.secondsLeft()).toEqual(5);
  }));

  it("secodsPassed returns at most timer length", inject(timer => {
    var t = timer({secondsLeft: 5}).start();

    mockedServerTimeValue = 10000;

    expect(t.secondsPassed()).toEqual(5);
  }));

  it("fires onFinish callback when countdown completes", inject((timer, $interval) => {
    var t = timer({secondsLeft: 5}).start();
    var finishSpy = jasmine.createSpy();
    t.onFinish(finishSpy);

    mockedServerTimeValue = 6000;
    $interval.flush(5000);

    expect(finishSpy).toHaveBeenCalled();
    expect(t.status).toEqual('finished');
  }));

  it("it doesn't fire onFinish callback when countdown isn't completed", inject((timer, $interval) => {
    var t = timer({secondsLeft: 5}).start();
    var finishSpy = jasmine.createSpy();
    t.onFinish(finishSpy);

    mockedServerTimeValue = 4000;
    $interval.flush(5000);

    expect(finishSpy).not.toHaveBeenCalled();
    expect(t.status).toEqual('running');
  }));

  it("resets the timer", inject((timer, $interval) => {
    var t = timer({secondsLeft: 5}).start();
    mockedServerTimeValue = 6000;
    $interval.flush(5000);

    t.reset();

    expect(t.secondsLeft()).toEqual(5);
    expect(t.status).toEqual('paused');
  }));

  it("doesn't run onFinish callback after being destroyed", inject((timer, $interval) => {
    var t = timer({secondsLeft: 5}).start();
    var finishSpy = jasmine.createSpy();
    t.onFinish(finishSpy);
    t.destroy();

    mockedServerTimeValue = 6000;
    $interval.flush(5000);

    expect(finishSpy).not.toHaveBeenCalled();
  }));
});
