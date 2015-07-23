import URI from "uri";

export default function timerIdStream(openURLStream) {
  return openURLStream
    .map(url => URI(url).path().from(1))
    .filter(id => !id.isBlank());
}
