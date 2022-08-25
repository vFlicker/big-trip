import { EventsModel } from '../model';
import {Method, SuccessHTTPSStatusRange} from './const';

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: 'points'})
      .then(Api.toJSON)
      .then((events) => events.map(EventsModel.adaptToClient));
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(Api.toJSON);
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
      method: Method.POST,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  deleteEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.DELETE,
    });
  }

  updateEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  sync(data) {
    return this._load({
      url: 'points/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static catchError(err) {
    throw err;
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPSStatusRange.MIN ||
      response.status > SuccessHTTPSStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }
}
