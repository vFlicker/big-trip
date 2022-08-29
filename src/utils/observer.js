export default class Observer {
  #observers = new Set();


  addObserver(observer) {
    this.#observers.add(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.delete(observer);
  }

  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}
