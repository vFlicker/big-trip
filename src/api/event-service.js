import { ApiService, HttpMethod } from '../framework';
import { EventsModel } from '../model';

export class EventService extends ApiService {
  addEvent = async (event) => {
    const response = this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedEvent = await ApiService.parseResponse(response);
    const adaptedEvent = EventsModel.adaptToClient(parsedEvent);

    return adaptedEvent;
  };

  getEvents = async () => {
    const response = await this._load({ url: 'points' });
    const events = await ApiService.parseResponse(response);
    const adaptedEvents = events.map(EventsModel.adaptToClient);

    return adaptedEvents;
  };

  getDestinations = async () => {
    const response = await this._load({ url: 'destinations' });
    const destinations = await ApiService.parseResponse(response);

    return destinations;
  };

  getOffers = async () => {
    const response = await this._load({ url: 'offers '});
    const offers = await ApiService.parseResponse(response);

    return offers;
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
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedEvent = await ApiService.parseResponse(response);
    const adaptedEvent = EventsModel.adaptToClient(parsedEvent);

    return adaptedEvent;
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
}
