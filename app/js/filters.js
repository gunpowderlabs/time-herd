export function duration() {
  return function(seconds) {
    var components = [];
    while (seconds / 60 > 0) {
      components.push(seconds % 60);
      seconds = Math.floor(seconds / 60);
    }
    var [first, ...rest] = components.reverse();
    rest = rest.map(c => String(c).length === 1 ? "0"+c : c);
    return [first, rest].flatten().compact().join(":");
  }
}
