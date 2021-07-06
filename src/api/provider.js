import EventsModel from '../model/events';
import DataStore from '../dataStorage';
import {isOnline} from '../utils/common';

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign(
      {},
      acc,
      {[current.id]: current},
    );
  }, {});
};

const getSyncedEvents = (items) => {
  return items
    .filter(({success}) => success)
    .map(({payload}) => payload.point);
};

export default class Provider {
  constructor(api, eventsStorage, destinationStorage, offerStorage) {
    this._api = api;
    this._eventsStorage = eventsStorage;
    this._destinationStorage = destinationStorage;
    this._offerStorage = offerStorage;
  }

  getAllData() {
    if (isOnline()) {
      return this._api.getAllData()
        .then(([events, destinations, offers]) => {
          const eventItems = createStoreStructure(events.map(EventsModel.adaptToServer));

          this._eventsStorage.setItems(eventItems);
          DataStore.setDestinations = destinations;
          DataStore.setOffers = offers;
          this._destinationStorage.setItems(destinations);
          this._offerStorage.setItems(offers);

          return events;
        });
    }
    const storeEvents = Object.values(this._eventsStorage.getItems());
    const storeDestinations = this._destinationStorage.getItems();
    const storeOffers = this._offerStorage.getItems();
    DataStore.setDestinations = storeDestinations;
    DataStore.setOffers = storeOffers;

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._eventsStorage.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));

          return newEvent;
        });
    }

    return Promise.reject(new Error('Add event failed'));
  }

  deleteEvent(event) {
    if (isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._eventsStorage.removeItem(event.id));
    }

    this._eventsStorage.removeItem(event.id);

    return Promise.resolve();
  }

  updateEvent(event) {
    if (isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._eventsStorage.setItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));

          return updatedEvent;
        });
    }

    this._eventsStorage.setItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._eventsStorage.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);
          this._eventsStorage.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
