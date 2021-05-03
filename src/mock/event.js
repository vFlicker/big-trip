import { getDestantions } from './destination';
import { getRandomDate } from './../utils/date';
import { getRandomInteger, MAX_PRICE, MIN_PRICE } from './utils';
import { nanoid } from 'nanoid';

const getEvent = () => {
  return {
    id: nanoid(),
    date: getRandomDate(),
    destantion: getDestantions(),
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
  };
};

export const getEvents = (eventCount) => {
  const events = new Array(eventCount)
    .fill()
    .map(getEvent)
    .sort((firstEvent, secondEvent) => firstEvent.date.start - secondEvent.date.start);

  return events;
};
