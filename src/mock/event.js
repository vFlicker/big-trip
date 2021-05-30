import { getDateStart, getDateEnd } from '../utils/date';
import { getRandomItems, getRandomInteger, getRandomValueFromArray, MIN_PRICE, MAX_PRICE } from './utils';
import { cloneArrayOfObjects } from '../utils/common';
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
  const filteredOffers = cloneArrayOfObjects(availableOffers[type]);

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
    {id: 1, title: 'Order Uber', price: 20, isChecked: false},
  ],
  bus: [
    {id: 1, title: 'Choose seats', price: 2, isChecked: false},
  ],
  train: [
    {id: 1, title: 'Travel by train', price: 40, isChecked: false},
  ],
  transport: [],
  ship: [],
  drive: [
    {id: 1, title: 'Rent a car', price: 200, isChecked: false},
  ],
  flight: [
    {id: 1, title: 'Switch to comfort', price: 80, isChecked: false},
    {id: 2, title: 'Add luggage', price: 50, isChecked: false},
    {id: 3, title: 'Add meal', price: 15, isChecked: false},
    {id: 4, title: 'Choose seats', price: 5, isChecked: false},
  ],
  'check-in': [
    {id: 1, title: 'Add breakfast', price: 50, isChecked: false},
    {id: 2, title: 'Switch to comfort class', price: 100, isChecked: false},
  ],
  sightseeing: [
    {id: 1, title: 'Add meal', price: 15, isChecked: false},
    {id: 2, title: 'Lunch in city', price: 30, isChecked: false},
    {id: 3, title: 'Book tickets', price: 40, isChecked: false},
  ],
  restaurant: [
    {id: 1,title: 'Add luggage', price: 45, isChecked: false},
    {id: 2, title: 'Add meal', price: 15, isChecked: false},
  ],
};
