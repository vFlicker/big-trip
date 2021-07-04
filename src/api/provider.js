import EventsModel from '../model/events';

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign(
      {},
      acc,
      {[current.id]: current},
    );
  }, {});
};

export default class Provider {
  constructor(api, eventsStorage, destinationStorage, offerStorage) {
    this._api = api;
    this._eventsStorage = eventsStorage;
    this._destinationStorage = destinationStorage;
    this._offerStorage = offerStorage;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map((event) => EventsModel.adaptToServer(event)));

          this._eventsStorage.setItems(items);

          return events;
        });
    }

    const events = Object.values(this._eventsStorage.getItems());

    return Promise.resolve(events.map((event) => EventsModel.adaptToClient(event)));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._destinationStorage.setItems(destinations);

          return destinations;
        });
    }

    const destinations = this._destinationStorage.getItems();

    return Promise.resolve(destinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._offerStorage.setItems(offers);

          return offers;
        });
    }

    const offers = this._offerStorage.getItems();

    return Promise.resolve(offers);
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event);
    }

    return Promise.reject('offline logic is not implemented');
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
}
