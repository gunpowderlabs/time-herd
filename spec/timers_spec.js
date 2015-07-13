import {timer} from '../timers';

describe("Timer", () => {
  it("returns an initialized timer", () => {
    expect(timer()).toEqual({secondsLeft: 100});
  });
});
