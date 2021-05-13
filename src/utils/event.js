import {getDuration} from './date';

export const sortByTime = (firstEvent, secondEvent) => {
  const firstDuration = getDuration(firstEvent.date.end, firstEvent.date.start);
  const secondDuration = getDuration(secondEvent.date.end, secondEvent.date.start);

  return firstDuration - secondDuration;
};

export const sortByPrice = (firstEvent, secondEvent) => {
  return firstEvent.price - secondEvent.price;
};
