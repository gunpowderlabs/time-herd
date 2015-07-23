import URI from "uri";

export default function timerIdStream(openURLStream) {
  return openURLStream.map((url) => {
    var path = URI(url).path().from(1);
    return path.isBlank() ? undefined : path;
  });
}
