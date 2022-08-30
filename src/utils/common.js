import dayjs from 'dayjs';

import { DateTimeFormats } from '../const';

export const isOnline = () => window.navigator.onLine;

export const cloneArrayOfObjects = (array) => array.map((obj) => ({ ...obj }));

export const getDateDifference = (dateStart, dateEnd) =>
  dayjs(dateEnd).diff(dayjs(dateStart));

export const humanizeDate = (date, formatter = DateTimeFormats.FULL_DATE) =>
  dayjs(date).format(formatter);

export const ucFirst = (string) => {
  if (!string) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
};

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
