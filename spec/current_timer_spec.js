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
});
