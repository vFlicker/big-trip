import { ApiService as _ApiService, HttpMethod } from '../framework';

export class ApiService extends _ApiService {
  async getEvents() {
    const response = await this._load({ url: 'points' });
    const events = await ApiService.parseResponse(response);
    return events;
  }

  async getDestinations() {
    const response = await this._load({ url: 'destinations' });
    const parsedDestinations = await ApiService.parseResponse(response);
    return parsedDestinations;
  }

  async getOffers() {
    const response = await this._load({ url: 'offers '});
    const parsedOffers = await ApiService.parseResponse(response);
    return parsedOffers;
  }

  async addEvent(event) {
    const response = await this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(ApiService.adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedEvent = await ApiService.parseResponse(response);
    return parsedEvent;
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(ApiService.adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedEvent = await ApiService.parseResponse(response);
    return parsedEvent;
  }

  async deleteEvent(event) {
    await this._load({
      url: `points/${event.id}`,
      method: HttpMethod.DELETE,
    });
  }

  async sync(data) {
    const response = await this._load({
      url: 'points/sync',
      method: HttpMethod.POST,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedData = await ApiService.parseResponse(response);
    return parsedData;
  }

  static adaptToServer(event) {
    const adaptEvent = {
      ...event,
      'date_to': event.dateEnd instanceof Date ? event.dateEnd.toISOString() : null,
      'date_from': event.dateStart instanceof Date ? event.dateStart.toISOString() : null,
      'base_price': event.price,
      'is_favorite': event.isFavorite,
    };

    delete adaptEvent.dateEnd;
    delete adaptEvent.dateStart;
    delete adaptEvent.price;
    delete adaptEvent.isFavorite;

    return adaptEvent;
  }
}
