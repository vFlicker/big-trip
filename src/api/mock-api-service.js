import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const mockDestinations = [
  {
    id: '1',
    name: 'Amsterdam',
    description: 'Beautiful city with canals.',
    pictures: [
      { src: 'img/photos/1.jpg', description: 'Amsterdam street' },
      { src: 'img/photos/2.jpg', description: 'Canal view' },
    ],
  },
  {
    id: '2',
    name: 'Geneva',
    description: 'Lake and mountains.',
    pictures: [{ src: 'img/photos/3.jpg', description: 'Geneva lake' }],
  },
  {
    id: '3',
    name: 'Chamonix',
    description: 'Famous for skiing.',
    pictures: [
      { src: 'img/photos/4.jpg', description: 'Ski resort' },
      { src: 'img/photos/5.jpg', description: 'Mountain view' },
    ],
  },
];

const mockOffers = [
  {
    type: 'taxi',
    offers: [
      { title: 'Order Uber', price: 20 },
      { title: 'Business class', price: 50 },
    ],
  },
  {
    type: 'bus',
    offers: [{ title: 'Infotainment', price: 10 }],
  },
  {
    type: 'train',
    offers: [
      { title: 'First class', price: 100 },
      { title: 'Meal', price: 15 },
    ],
  },
];

let mockEvents = [
  {
    id: nanoid(),
    type: 'taxi',
    destination: mockDestinations[0],
    date_from: dayjs().subtract(2, 'day').hour(10).minute(0).toISOString(),
    date_to: dayjs().subtract(2, 'day').hour(12).minute(0).toISOString(),
    base_price: 120,
    is_favorite: false,
    offers: [mockOffers[0].offers[0]],
  },
  {
    id: nanoid(),
    type: 'train',
    destination: mockDestinations[1],
    date_from: dayjs().subtract(1, 'day').hour(8).minute(0).toISOString(),
    date_to: dayjs().subtract(1, 'day').hour(12).minute(0).toISOString(),
    base_price: 200,
    is_favorite: true,
    offers: [mockOffers[2].offers[0], mockOffers[2].offers[1]],
  },
  {
    id: nanoid(),
    type: 'bus',
    destination: mockDestinations[2],
    date_from: dayjs().add(1, 'day').hour(9).minute(0).toISOString(),
    date_to: dayjs().add(1, 'day').hour(13).minute(0).toISOString(),
    base_price: 80,
    is_favorite: false,
    offers: [],
  },
];

export class MockApiService {
  async getEvents() {
    return Promise.resolve(mockEvents);
  }

  async getDestinations() {
    return Promise.resolve(mockDestinations);
  }

  async getOffers() {
    return Promise.resolve(mockOffers);
  }

  async addEvent(event) {
    const adaptedEVent = MockApiService.adaptToServer(event);
    mockEvents = [adaptedEVent, ...mockEvents];
    return Promise.resolve(adaptedEVent);
  }

  async updateEvent(event) {
    const adaptedEVent = MockApiService.adaptToServer(event);
    const index = mockEvents.findIndex((e) => e.id === event.id);
    if (index === -1) {
      throw new Error("Event not found");
    }

    mockEvents[index] = { ...mockEvents[index], ...adaptedEVent };
    return Promise.resolve(mockEvents[index]);
  }

  async deleteEvent(event) {
    mockEvents = mockEvents.filter((e) => e.id !== event.id);
    return Promise.resolve();
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
