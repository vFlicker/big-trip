import { Observer } from '../utils';

export default class EventsModel extends Observer {
  #events = [];

  setEvents(updateType, events) {
    this.#events = events;

    this._notify(updateType);
  }

  getEvents = () => this.#events;

  addEvent = (updateType, update) => {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  };

  deleteEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);
  };

  updateEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

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

    delete adaptEvent.date_to;
    delete adaptEvent.date_from;
    delete adaptEvent.base_price;
    delete adaptEvent.is_favorite;

    return adaptEvent;
  }

  static adaptToServer(event) {
    const adaptEvent = Object.assign(
      {},
      event,
      {
        date_to: event.dateEnd instanceof Date ? event.dateEnd.toISOString() : null,
        date_from: event.dateStart instanceof Date ? event.dateStart.toISOString() : null,
        base_price: event.price,
        is_favorite: event.isFavorite,
      },
    );

    delete adaptEvent.dateEnd;
    delete adaptEvent.dateStart;
    delete adaptEvent.price;
    delete adaptEvent.isFavorite;

    return adaptEvent;
  }
}
