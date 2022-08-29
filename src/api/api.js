import { ApiService, HttpMethod } from '../framework';
import { EventsModel } from '../model';

export class Api extends ApiService {
  getEvents() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse)
      .then((events) => events.map(EventsModel.adaptToClient));
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  getAllData() {
    return Promise.all([
      this.getEvents(),
      this.getDestinations(),
      this.getOffers(),
    ]);
  }

  addEvent(event) {
    return this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse)
      .then(EventsModel.adaptToClient);
  }

  deleteEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: HttpMethod.DELETE,
    });
  }

  updateEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse)
      .then(EventsModel.adaptToClient);
  }

  sync(data) {
    return this._load({
      url: 'points/sync',
      method: HttpMethod.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse);
  }
}
