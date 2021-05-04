import { getDestantions } from './destination';
import { getRandomDate } from './../utils/date';
import { getRandomValueFromArray, getRandomInteger, MAX_PRICE, MIN_PRICE, getRandomItems } from './utils';
import { nanoid } from 'nanoid';

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
  }

  return filteredOffers;
};

const getEvent = () => {
  const type = getType();

  return {
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
