const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents();
    }

    return Promise.reject('offline logic is not implemented');
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations();
    }

    return Promise.reject('offline logic is not implemented');
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers();
    }

    return Promise.reject('offline logic is not implemented');
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event);
    }

    return Promise.reject('offline logic is not implemented');
  }

  deleteEvent(event) {
    if (isOnline()) {
      return this._api.deleteEvent(event);
    }

    return Promise.reject('offline logic is not implemented');
  }

  updateEvent(event) {
    if (isOnline()) {
      return this._api.updateEvent(event);
    }

    return Promise.reject('offline logic is not implemented');
  }
}
