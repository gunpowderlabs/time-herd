import "spec_helper";

describe("timerIdStream", () => {
  var spy;
  beforeEach(module('timeherd'));
  beforeEach(inject(timerIdStream => {
    spy = jasmine.createSpy();
    timerIdStream.onValue(spy);
  }));

  it("parses id from the url", inject((openURLStream) => {
    openURLStream.push("https://timeherd.divshot.io/af23");

    expect(spy).toHaveBeenCalledWith("af23");
  }));

  it("ignores empty ids", inject((openURLStream) => {
    openURLStream.push("https://timeherd.divshot.io/");

    expect(spy).not.toHaveBeenCalled();
  }));
});
