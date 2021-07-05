import dayjs from 'dayjs';

export const isOnline = () => {
  return window.navigator.onLine;
};

export const cloneArrayOfObjects = (array) => {
  return array.map((obj) => Object.assign({}, obj));
};

export const getDateDifference = (dateStart, dateEnd) => {
  return dayjs(dateEnd).diff(dayjs(dateStart));
};

export const humanizeDate = (date, formatter = 'MM-DD-YYYY') => {
  return dayjs(date).format(formatter);
};

export const ucFirst = (string) => {
  if (!string) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
};

export const sortByTime = (firstEvent, secondEvent) => {
  const firstDuration = getDateDifference(firstEvent.dateEnd, firstEvent.dateStart);
  const secondDuration = getDateDifference(secondEvent.dateEnd, secondEvent.dateStart);

  return firstDuration - secondDuration;
};

export const sortByPrice = (firstEvent, secondEvent) => {
  return firstEvent.price - secondEvent.price;
};

export const sortByDate = (firstEvent, secondEvent) => {
  return dayjs(firstEvent.dateStart).diff(dayjs(secondEvent.dateStart));
};
