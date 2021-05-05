import { getRandomDate } from './../utils/date';
import { getRandomValueFromArray, getRandomItems, getRandomInteger, MIN_PRICE, MAX_PRICE } from './utils';
import { nanoid } from 'nanoid';

const availableTypes = {
  taxi: 'Taxi',
  bus: 'Bus',
  train: 'Ship',
  transport: 'Transport',
  drive: 'Drive',
  flight: 'Flight',
  ['check-in']: 'Check-In',
  sightseeing: 'Sightseeing',
  restaurant: 'Restaurant',
};

const availableDestantion = ['Amsterdam', 'Geneva', 'Chamonix', 'Saint Petersburg', 'Salzburg', 'Washington', 'Cairo', 'Galway', 'Bonn', 'La Paz', 'Kochi', 'Vancouver', 'Dubai', 'Denver'];

const getType = () => {
  const types = new Set(['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant']);
  const type = getRandomValueFromArray(Array.from(types));

  return type;
};

const getOffers = (type) => {
  const offers = [
    {type: 'check-in', title: 'Add breakfast', price: 50},
    {type: 'check-in', title: 'Switch to comfort class', price: 100},
    {type: 'drive', title: 'Rent a car', price: 200},
    {type: 'flight', title: 'Switch to comfort', price: 80},
    {type: 'flight', title: 'Add luggage', price: 50},
    {type: 'flight', title: 'Add meal', price: 15},
    {type: 'flight', title: 'Choose seats', price: 5},
    {type: 'sightseeing', title: 'Add meal', price: 15},
    {type: 'sightseeing', title: 'Lunch in city', price: 30},
    {type: 'sightseeing', title: 'Book tickets', price: 40},
    {type: 'taxi', title: 'Order Uber', price: 20},
    {type: 'train', title: 'Travel by train', price: 40},
  ];

  let filteredOffers = offers.filter((offer) => offer.type === type);

  if (filteredOffers.length > 0) {
    filteredOffers = getRandomItems(filteredOffers);
    filteredOffers.forEach((offer, index) => {
      offer.id = index + 1;
      offer.isChecked = Boolean(getRandomInteger(0, 1));
    });
  }

  return filteredOffers;
};

const getName = (items) => {
  const destantionNames = new Set(items);
  const name = getRandomValueFromArray(Array.from(destantionNames));

  destantionNames.delete(name);
  return name;
};

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

const getDestantions = () => {
  return {
    name: getName(availableDestantion),
    description: getDescription(),
    photos: generatePhotos(),
  };
};

const getEvent = () => {
  const type = getType();

  return {
    availableDestantion: availableDestantion.sort(),
    availableTypes,
    type,
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    date: getRandomDate(),
    destantion: getDestantions(),
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: getOffers(type),
  };
};

export const getEvents = (eventCount) => {
  const events = new Array(eventCount)
    .fill()
    .map(getEvent)
    .sort((firstEvent, secondEvent) => firstEvent.date.start - secondEvent.date.start);

  return events;
};
