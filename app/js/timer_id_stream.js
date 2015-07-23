import URI from "uri";

export default function timerIdStream(openURLStream) {
  return openURLStream
    .map(URI)
    .map(uri => uri.protocol() === 'timeherd' ? uri.hostname() : uri.path().from(1))
    .filter(id => !id.isBlank());
}
