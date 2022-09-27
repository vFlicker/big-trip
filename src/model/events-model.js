import { UpdateType } from '../const';
import { Observable } from '../framework';

export class EventsModel extends Observable {
  #eventService = null;

  #events = [];

  constructor(eventService) {
    super();

    this.#eventService = eventService;
  }

  init = async () => {
    try {
      const events = await this.#eventService.getAllData();
      this.#events = events.map(EventsModel.adaptToClient);
    } catch (err) {
      this.#events = [];
    }

    this._notify(UpdateType.INIT);
  };

  get events() {
    return this.#events;
  }

  addEvent = async (updateType, update) => {
    try {
      const response = await this.#eventService.addEvent(update);
      const newEvent = EventsModel.adaptToClient(response);

      this.#events = [
        newEvent,
        ...this.#events,
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete task');
    }
  };

  updateEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#eventService.updateEvent(update);
      const updatedEvent = EventsModel.adaptToClient(response);

      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update task');
    }
  };

  deleteEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try {
      await this.#eventService.deleteEvent(update);

      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete task');
    }
  };

  static adaptToClient(event) {
    const adaptEvent = {
      ...event,
      dateEnd: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
      dateStart: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
      price: event['base_price'],
      isFavorite: event['is_favorite'],
    };

    delete adaptEvent.date_to;
    delete adaptEvent.date_from;
    delete adaptEvent.base_price;
    delete adaptEvent.is_favorite;

    return adaptEvent;
  }
}
