import { getDateStart, getDateEnd } from '../utils/date';
import { getRandomValueFromArray, getRandomInteger, getRandomItems, MIN_PRICE, MAX_PRICE } from './utils';
import { nanoid } from 'nanoid';

const getDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  ];

  return getRandomItems(description).join(' ');
};

const generatePhotos = () => {
  const randomSize = getRandomInteger(1, 3);

  return new Array(randomSize)
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

const getAvailableDestinations = () => {
  const destinations = [];
  const names = ['Amsterdam', 'Geneva', 'Chamonix', 'Saint Petersburg', 'Salzburg', 'Washington', 'Cairo', 'Galway', 'Bonn', 'La Paz', 'Kochi', 'Vancouver', 'Dubai', 'Denver'];

  for (const name of names) {
    destinations.push(
      {
        name: name,
        description: getDescription(),
        photos: generatePhotos(),
      },
    );
  }

  return destinations;
};

const getDestination = () => {
  const availableDestinations = getAvailableDestinations();

  return getRandomValueFromArray(availableDestinations);
};

const getOffers = (type) => {
  const filteredOffers = [...availableOffers[type]];

  if (filteredOffers.length > 0) {
    filteredOffers.forEach((offer) => {
      offer.isChecked = Boolean(getRandomInteger(0, 1));
    });
  }

  return filteredOffers;
};

const getType = () => {
  return getRandomValueFromArray(availableTypes);
};

const getEvent = () => {
  const dateStart = getDateStart();
  const type = getType();

  return {
    dateStart,
    type,
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    dateEnd: getDateEnd(dateStart),
    destination: getDestination(),
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: getOffers(type),
  };
};

export const getEvents = (eventCount) => {
  return new Array(eventCount)
    .fill()
    .map(getEvent)
    .sort((firstEvent, secondEvent) => firstEvent.dateStart - secondEvent.dateStart);
};

export const availableDestination = getAvailableDestinations();

export const availableTypes = ['taxi', 'bus', 'train', 'transport', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const availableOffers = {
  taxi: [
    {id: 1, title: 'Order Uber', price: 20, isActive: false},
  ],
  bus: [
    {id: 1, title: 'Choose seats', price: 2, isActive: false},
  ],
  train: [
    {id: 1, title: 'Travel by train', price: 40, isActive: false},
  ],
  transport: [],
  ship: [],
  drive: [
    {id: 1, title: 'Rent a car', price: 200, isActive: false},
  ],
  flight: [
    {id: 1, title: 'Switch to comfort', price: 80, isActive: false},
    {id: 2, title: 'Add luggage', price: 50, isActive: false},
    {id: 3, title: 'Add meal', price: 15, isActive: false},
    {id: 4, title: 'Choose seats', price: 5, isActive: false},
  ],
  'check-in': [
    {id: 1, title: 'Add breakfast', price: 50, isActive: false},
    {id: 2, title: 'Switch to comfort class', price: 100, isActive: false},
  ],
  sightseeing: [
    {id: 1, title: 'Add meal', price: 15, isActive: false},
    {id: 2, title: 'Lunch in city', price: 30, isActive: false},
    {id: 3, title: 'Book tickets', price: 40, isActive: false},
  ],
  restaurant: [
    {id: 1,title: 'Add luggage', price: 45, isActive: false},
    {id: 2, title: 'Add meal', price: 15, isActive: false},
  ],
};
