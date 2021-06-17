import Observer from '../utils/observer';

export default class Events extends Observer{
  constructor() {
    super();

    this._events = [];
  }

  setEvents(events) {
    this._events = events;
  }

  getEvents() {
    return this._events;
  }
}
