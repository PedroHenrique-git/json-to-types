export function event<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement
>(element: T, type: K, cb: (_: HTMLElementEventMap[K]) => void) {
  element.addEventListener(type, cb);
}
