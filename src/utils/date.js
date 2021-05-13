import dayjs from 'dayjs';
import { getRandomInteger } from '../mock/utils';

const minDaysOffset = -7;
const maxDaysOffset = 7;
const maxHoursOffset = 23;
const maxMinutesOffset = 59;

export const getRandomDate = () => {
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

export const getDuration = (firstDuration, secondDuration) => {
  return dayjs(firstDuration).diff(dayjs(secondDuration));
};

export const humanizeDate = (date, formatter = 'DD-MM-YYYY') => {
  return dayjs(date).format(formatter);
};

export const humanizeDuration = (dateStart, dateEnd) => {
  const days = humanizeDate(getDuration(dateEnd, dateStart), 'D');
  const hours = humanizeDate(getDuration(dateEnd, dateStart), 'HH');
  const minutes = humanizeDate(getDuration(dateEnd, dateStart), 'mm');

  return `${days}D ${hours}H ${minutes}M`;
};

export const getEventPeriod = (eventStart, eventEnd) => {
  if (eventStart && eventEnd) {
    const monthStart = dayjs(eventStart.date.start).month();
    const monthEnd = dayjs(eventEnd.date.end).month();

    if (monthStart === monthEnd) {
      return `${humanizeDate(eventStart.date.start, 'MMM DD')}&nbsp;&mdash;&nbsp;${humanizeDate(eventEnd.date.end, 'DD')}`;
    }

    return `${humanizeDate(eventStart.date.start, 'MMM DD')}&nbsp;&mdash;&nbsp;${humanizeDate(eventEnd.date.end, 'MMM DD')}`;
  }

  return 'trip date';
};
