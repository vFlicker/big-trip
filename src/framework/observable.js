/**
 * A class that implements the Observer pattern.
 */
export class Observable {
  /**
   * @type {Set<Observer>} set of observers
   */
  #observers = new Set();

  /**
   * Method for adding a subscriber to the list of observers
   * @param {Observer} observer subscriber
   */
  subscribe(observer) {
    this.#observers.add(observer);
  }

  /**
   * Method for removing a subscriber from the list of observers
   * @param {Observer} observer subscriber
   */
  unsubscribe(observer) {
    this.#observers.delete(observer);
  }

  /**
   * Method for notifying all subscribers about an event
   * @param {string} event event name
   * @param {any} payload event data
   */
  notify(event, payload) {
    for (const observer of this.#observers) {
      observer.update(event, payload);
    }
  }
}

/**
 * A class that implements the Observer pattern.
 */
export class Observer {
  /**
   * Method that will be called when the event occurs
   */
  update() {
    throw new Error('Observer.update is not implemented');
  }
}

