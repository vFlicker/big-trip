export default class Events {
  constructor() {
    this._events = [];
  }

  setEvents(events) {
    this._events = events;
  }

  getEvents() {
    return this._events;
  }
}
