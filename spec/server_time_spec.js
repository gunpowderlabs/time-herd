import "spec_helper";

describe("serverTime", () => {
  beforeEach(module('timeherd'));

  it("returns current unix timestamp", inject(serverTime => {
    var localTimeBeforeStamp = Date.now();
    var serverStamp = serverTime();
    var localTimeAfterStamp = Date.now();

    expect((localTimeBeforeStamp >= serverStamp) &&
      (serverStamp <= localTimeAfterStamp)).toBeTruthy();
  }));
});
