import { ApiService, HttpMethod } from '../framework';

export class EventApiService extends ApiService {
  addEvent = async (event) => {
    const response = await this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(EventApiService.adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedEvent = await ApiService.parseResponse(response);
    return parsedEvent;
  };

  getEvents = async () => {
    const response = await this._load({ url: 'points' });
    const events = await ApiService.parseResponse(response);
    return events;
  };

  getDestinations = async () => {
    const response = await this._load({ url: 'destinations' });
    const parsedDestinations = await ApiService.parseResponse(response);
    return parsedDestinations;
  };

  getOffers = async () => {
    const response = await this._load({ url: 'offers '});
    const parsedOffers = await ApiService.parseResponse(response);
    return parsedOffers;
  };

  getAllData = async () => {
    const response = await Promise.all([
      this.getEvents(),
      this.getDestinations(),
      this.getOffers(),
    ]);

    return response;
  };

  updateEvent = async (event) => {
    const response = await this._load({
      url: `points/${event.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(EventApiService.adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedEvent = await ApiService.parseResponse(response);
    return parsedEvent;
  };

  deleteEvent = async (event) => {
    await this._load({
      url: `points/${event.id}`,
      method: HttpMethod.DELETE,
    });
  };

  sync = async (data) => {
    const response = await this._load({
      url: 'points/sync',
      method: HttpMethod.POST,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedData = await ApiService.parseResponse(response);
    return parsedData;
  };

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
