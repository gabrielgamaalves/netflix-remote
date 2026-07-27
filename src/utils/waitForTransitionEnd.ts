export default async function waitForTransitionEnd(
  element: Element,
  callback?: (event: TransitionEvent) => void
): Promise<TransitionEvent> {
  return new Promise((resolve) => {
    const listener =
      (event: any) => {
        element
          .removeEventListener("transitionend", listener);

        if (callback) callback(event)
        resolve(event);
      };

    element
      .addEventListener("transitionend", listener);
  });
}