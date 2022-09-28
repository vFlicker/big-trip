import { DataStore } from '../dataStorage';
import { EventsModel } from '../model';
import { isOnline } from '../utils';

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

  async getAllData() {
    if (!isOnline()) {
      const storeEvents = Object.values(this.#eventsStorage.getItems());
      const storeDestinations = this.#destinationStorage.getItems();
      const storeOffers = this.#offerStorage.getItems();

      DataStore.setDestinations = storeDestinations;
      DataStore.setOffers = storeOffers;

      return storeEvents.map(EventsModel.adaptToClient);
    }

    const [events, destinations, offers] = await this.#api.getAllData();

    const eventItems = createStoreStructure(events);

    this.#eventsStorage.setItems(eventItems);
    this.#destinationStorage.setItems(destinations);
    this.#offerStorage.setItems(offers);

    DataStore.setDestinations = destinations;
    DataStore.setOffers = offers;

    return events;
  }

  async addEvent(event) {
    if (!isOnline()) {
      return new Error('Add event failed');
    }

    const newEvent = await this.#api.addEvent(event);

    this.#eventsStorage.setItem(newEvent.id, newEvent);

    return newEvent;
  }

  async deleteEvent(event) {
    if (!isOnline()) {
      this.#eventsStorage.removeItem(event.id);
      return;
    }

    await this.#api.deleteEvent(event);

    this.#eventsStorage.removeItem(event.id);
  }

  async updateEvent(event) {
    if (!isOnline()) {
      this.#eventsStorage.setItem(event.id, { ...event });

      return event;
    }

    const updatedEvent = await this.#api.updateEvent(event);

    this.#eventsStorage.setItem(updatedEvent.id, updatedEvent);

    return updatedEvent;
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
