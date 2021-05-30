import {getDateDifference} from './date';

export const sortByTime = (firstEvent, secondEvent) => {
  const firstDuration = getDateDifference(firstEvent.dateEnd, firstEvent.dateStart);
  const secondDuration = getDateDifference(secondEvent.dateEnd, secondEvent.dateStart);

  return firstDuration - secondDuration;
};

export const sortByPrice = (firstEvent, secondEvent) => {
  return firstEvent.price - secondEvent.price;
};
