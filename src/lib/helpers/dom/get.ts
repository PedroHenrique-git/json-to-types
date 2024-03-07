export function get<T extends Element = Element>(identifier: string) {
  return document.querySelector<T>(identifier);
}
