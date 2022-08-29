/**
 * A class that implements the Observer pattern.
 */
export class Observable {
  /**
   * @type {Set<observerCallback>} set of observerCallback type
   */
  #observers = new Set();

  /**
   * Method that allows you to subscribe to an event
   * @param {observerCallback} observer function that will be called when the event occurs
   */
  addObserver(observer) {
    this.#observers.add(observer);
  }

  /**
   * Method for unsubscribing from an event
   * @param {observerCallback} observer function that will be called when the event occurs
   */
  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  /**
   * Method for notifying subscribers about the occurrence of an event
   * @param {*} event event type
   * @param {*} payload additional information
   */
  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}
