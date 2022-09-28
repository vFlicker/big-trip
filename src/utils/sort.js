import dayjs from 'dayjs';

import { getDateDifference } from './common';

export const sortByTime = (firstEvent, secondEvent) => {
  const firstDuration = getDateDifference(
    firstEvent.dateEnd,
    firstEvent.dateStart
  );

  const secondDuration = getDateDifference(
    secondEvent.dateEnd,
    secondEvent.dateStart
  );

  return firstDuration - secondDuration;
};

export const sortByPrice = (firstEvent, secondEvent) =>
  firstEvent.price - secondEvent.price;

export const sortByDate = (firstEvent, secondEvent) =>
  dayjs(firstEvent.dateStart).diff(dayjs(secondEvent.dateStart));
