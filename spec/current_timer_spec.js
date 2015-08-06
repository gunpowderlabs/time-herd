import "spec_helper";

describe("currentTimer", () => {
  function mockChance() { return Chance(0); }
  beforeEach(module('timeherd'));
  beforeEach(module($provide => {
    $provide.value('chance', mockChance());
    $provide.value('alarm', {start: angular.noop, stop: angular.noop});
    $provide.factory('timerIdStream', () => new Bacon.Bus());
  }));

  it("returns a new timer by default", inject(currentTimer => {
    expect(currentTimer().id).toEqual(mockChance().hash());
  }));

  it("opens an existing timer on new id", inject((currentTimer, timerIdStream) => {
    timerIdStream.push("foo");

    expect(currentTimer().id).toEqual("foo");
  }));

  it("destroying the current watch mutes the alarm", inject((currentTimer, alarmStopStream) => {
    const spy = jasmine.createSpy();
    alarmStopStream.onValue(spy);

    currentTimer.destroy();

    expect(spy).toHaveBeenCalled();
  }));

  it("destroying the current watch creates a new timer instance", inject(currentTimer => {
    const chance = mockChance();
    chance.hash();
    currentTimer();
    currentTimer.destroy();

    expect(currentTimer().id).toEqual(chance.hash());
  }));

  it("destroying the current watch destroys the watch itself", inject(currentTimer => {
    const timer = currentTimer();
    spyOn(timer, 'destroy');

    currentTimer.destroy();

    expect(timer.destroy).toHaveBeenCalled();
  }));
});
