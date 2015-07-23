import "spec_helper";

describe("timerIdStream", () => {
  var spy;
  beforeEach(module('starter'));
  beforeEach(inject(timerIdStream => {
    spy = jasmine.createSpy();
    timerIdStream.onValue(spy);
  }));

  it("parses id from the url", inject((openURLStream) => {
    openURLStream.push("https://timeherd.divshot.io/af23");

    expect(spy).toHaveBeenCalledWith("af23");
  }));

  it("returns undefined for empty patahs", inject((openURLStream) => {
    openURLStream.push("https://timeherd.divshot.io/");

    expect(spy).toHaveBeenCalledWith(undefined);
  }));
});
