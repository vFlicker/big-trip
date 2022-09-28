import { isOnline } from '../utils';
import { ApiService } from './api-service';

const createStoreStructure = (items) => items.reduce((acc, current) => ({
  ...acc,
  [current.id]: current,
}), {});

const getSyncedEvents = (events) => events
  .filter(({ success }) => success)
  .map(({ payload }) => payload.point);

export class Provider {
  #api = null;
  #eventsStorage = null;
  #destinationStorage = null;
  #offerStorage = null;

  constructor(api, eventsStorage, destinationStorage, offerStorage) {
    this.#api = api;
    this.#eventsStorage = eventsStorage;
    this.#destinationStorage = destinationStorage;
    this.#offerStorage = offerStorage;
  }

  async getEvents() {
    if (!isOnline()) {
      return Object.values(this.#eventsStorage.getItems());
    }

    const events = await this.#api.getEvents();

    const eventItems = createStoreStructure(events);
    this.#eventsStorage.setItems(eventItems);

    return events;
  }

  async getDestinations() {
    if (!isOnline()) {
      return this.#destinationStorage.getItems();
    }

    const destinations = await this.#api.getDestinations();

    this.#destinationStorage.setItems(destinations);

    return destinations;
  }

  async getOffers() {
    if (!isOnline()) {
      return this.#offerStorage.getItems();
    }

    const offers = await this.#api.getOffers();

    this.#offerStorage.setItems(offers);

    return offers;
  }

  async addEvent(event) {
    if (!isOnline()) {
      return new Error('Add event failed');
    }

    const newEvent = await this.#api.addEvent(event);

    this.#eventsStorage.setItem(newEvent.id, newEvent);

    return newEvent;
  }

  async updateEvent(event) {
    if (!isOnline()) {
      const adaptedEvent = ApiService.adaptToServer(event);
      this.#eventsStorage.setItem(adaptedEvent.id, adaptedEvent);
      return adaptedEvent;
    }

    const updatedEvent = await this.#api.updateEvent(event);
    this.#eventsStorage.setItem(updatedEvent.id, updatedEvent);

    return updatedEvent;
  }

  async deleteEvent(event) {
    if (!isOnline()) {
      this.#eventsStorage.removeItem(event.id);
      return;
    }

    await this.#api.deleteEvent(event);

    this.#eventsStorage.removeItem(event.id);
  }

  async sync() {
    if (!isOnline()) {
      return new Error('Sync data failed');
    }

    const storeEvents = Object.values(this.#eventsStorage.getItems());

    const response = await this.#api.sync(storeEvents);
    const { created, updated } = response;

    const createdEvents = getSyncedEvents(created);
    const updatedEvents = getSyncedEvents(updated);

    const items = createStoreStructure([...createdEvents, ...updatedEvents]);
    this.#eventsStorage.setItems(items);
  }
}
