import dayjs from 'dayjs';

import { DateTimeFormats } from '../const';

export const cloneArrayOfObjects = (array) => array.map((obj) => ({ ...obj }));

export const getDateDifference = (dateStart, dateEnd) =>
  dayjs(dateEnd).diff(dayjs(dateStart));

export const humanizeDate = (date, formatter = DateTimeFormats.FULL_DATE) =>
  dayjs(date).format(formatter);

export const isOnline = () => window.navigator.onLine;

export const ucFirst = (string) => {
  if (!string) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
};
