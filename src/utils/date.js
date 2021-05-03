import dayjs from 'dayjs';
import { getRandomInteger } from './../mock/utils';

const minDaysOffset = -7;
const maxDaysOffset = 7;
const maxHoursOffset = 23;
const maxMinutesOffset = 59;

const humanizeDay = (date) => {
  return dayjs(date).format('DD');
};

const humanizeDate = (date) => {
  return dayjs(date).format('MMM D');
};

const getRandomDate = () => {
  const days = getRandomInteger(minDaysOffset, maxDaysOffset);
  const hours = getRandomInteger(0, maxHoursOffset);
  const minutes = getRandomInteger(0, maxMinutesOffset);

  const startDate = dayjs()
    .add(days, 'd')
    .add(hours, 'h')
    .add(minutes, 'm')
    .toDate();

  const endDate = dayjs(startDate)
    .add(Math.abs(days), 'd')
    .add(hours, 'h')
    .add(minutes, 'm')
    .toDate();

  return {
    start: startDate,
    end: endDate,
  };
};

const getEventPeriod = (startingPoint, endingPoint) => {
  const monthStart = dayjs(startingPoint.date.start).month();
  const monthEnd = dayjs(endingPoint.date.end).month();

  if (monthStart === monthEnd) {
    return `${humanizeDate(startingPoint.date.start)}&nbsp;&mdash;&nbsp;${humanizeDay(endingPoint.date.end)}`;
  }

  return `${humanizeDate(startingPoint.date.start)}&nbsp;&mdash;&nbsp;${humanizeDate(endingPoint.date.end)}`;
};

export {
  getRandomDate,
  getEventPeriod
};
