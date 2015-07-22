import "./app";
import "angular-mocks";

describe("duration", () => {
  beforeEach(module('starter'));
  var duration;
  beforeEach(inject($filter => duration = $filter('duration')));

  it("returns 0 for 0", () => {
    expect(duration(0)).toEqual("0");
  });

  it("returns itself for numbers less than 60", () => {
    expect(duration(10)).toEqual("10");
  });

  it("formats minutes", () => {
    expect(duration(77)).toEqual("1:17");
  });

  it("formats hours", () => {
    expect(duration(7*60*60 + 25*60 + 11)).toEqual("7:25:11");
  });

  it("fills middle components with zeros", () => {
    expect(duration(7*60*60 + 5*60 + 1)).toEqual("7:05:01");
  });
});
