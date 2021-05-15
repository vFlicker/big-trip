import {getDuration} from './date';

export const sortByTime = (firstEvent, secondEvent) => {
  const firstDuration = getDuration(firstEvent.dateEnd, firstEvent.dateStart);
  const secondDuration = getDuration(secondEvent.dateEnd, secondEvent.dateStart);

  return firstDuration - secondDuration;
};

export const sortByPrice = (firstEvent, secondEvent) => {
  return firstEvent.price - secondEvent.price;
};
