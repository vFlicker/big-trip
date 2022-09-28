import dayjs from 'dayjs';

import { getDateDifference } from './common';

const sortByTime = (firstEvent, secondEvent) => {
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

const sortByPrice = (firstEvent, secondEvent) =>
  firstEvent.price - secondEvent.price;

const sortByDate = (firstEvent, secondEvent) =>
  dayjs(firstEvent.dateStart).diff(dayjs(secondEvent.dateStart));

export const sort = {
  byTime: sortByTime,
  byPrice: sortByPrice,
  byDate: sortByDate,
};
