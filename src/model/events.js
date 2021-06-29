import Observer from '../utils/observer';

export default class Events extends Observer {
  constructor() {
    super();

    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events;

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptEvent = Object.assign(
      {},
      event,
      {
        dateEnd: event.date_to !== null ? new Date(event.date_to) : event.date_to,
        dateStart: event.date_from !== null ? new Date(event.date_from) : event.date_from,
        price: event.base_price,
        isFavorite: event.is_favorite,
      },
    );

    adaptEvent.destination.photos = event.destination.pictures;

    delete adaptEvent.date_to;
    delete adaptEvent.date_from;
    delete adaptEvent.base_price;
    delete adaptEvent.is_favorite;
    delete adaptEvent.destination.pictures;

    return adaptEvent;
  }
}
