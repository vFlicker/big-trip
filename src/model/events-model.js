import EventEmitter from 'events';
import { UpdateType } from '../const';

export class EventsModel extends EventEmitter {
  #apiService = null;

  #events = [];
  #destinations = [];
  #offers = [];

  constructor(apiService) {
    super();

    this.#apiService = apiService;
  }

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const [events, destinations, offers] = await Promise.all([
        this.#apiService.getEvents(),
        this.#apiService.getDestinations(),
        this.#apiService.getOffers(),
      ]);

      this.#events = events.map(EventsModel.adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;
    } catch (err) {
      this.#events = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this.emit('update', UpdateType.INIT);
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#apiService.addEvent(update);
      const newEvent = EventsModel.adaptToClient(response);

      this.#events = [newEvent, ...this.#events];

      this.emit('update', updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete task');
    }
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#apiService.updateEvent(update);
      const updatedEvent = EventsModel.adaptToClient(response);

      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];

      this.emit('update', updateType, update);
    } catch (err) {
      throw new Error('Can\'t update task');
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try {
      await this.#apiService.deleteEvent(update);

      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];

      this.emit('update', updateType);
    } catch (err) {
      throw new Error('Can\'t delete task');
    }
  }

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
