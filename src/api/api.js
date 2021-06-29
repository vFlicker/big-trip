import EventsModel from '../model/events';

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getDestinations() {
    const headers = new Headers();
    headers.append('Authorization', this._authorization);

    return fetch(this._endPoint + '/destinations', {headers})
      .then((response) => response.json());
  }

  getEvents() {
    const headers = new Headers();
    headers.append('Authorization', this._authorization);

    return fetch(this._endPoint + '/points', {headers})
      .then((response) => response.json())
      .then((events) => events.map((event) => EventsModel.adaptToClient(event)));
  }

  getOffers() {
    const headers = new Headers();
    headers.append('Authorization', this._authorization);

    return fetch(this._endPoint + '/offers', {headers})
      .then((response) => response.json());
  }
}
