import dayjs from 'dayjs';

export const cloneArrayOfObjects = (array) => {
  return array.map((obj) => Object.assign({}, obj));
};

export const getDateDifference = (dateStart, dateEnd) => {
  return dayjs(dateEnd).diff(dayjs(dateStart));
};

export const ucFirst = (string) => {
  if (!string) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
};
