import dayjs from 'dayjs';
import { getRandomInteger } from '../mock/utils';

const minDaysOffset = -7;
const maxDaysOffset = 7;
const maxHoursOffset = 23;
const maxMinutesOffset = 59;

export const getDateStart = () => {
  const days = getRandomInteger(minDaysOffset, maxDaysOffset);
  const hours = getRandomInteger(0, maxHoursOffset);
  const minutes = getRandomInteger(0, maxMinutesOffset);

  return dayjs()
    .add(days, 'd')
    .add(hours, 'h')
    .add(minutes, 'm')
    .toDate();
};

export const getDateEnd = (dateStart) => {
  const days = getRandomInteger(minDaysOffset, maxDaysOffset);
  const hours = getRandomInteger(0, maxHoursOffset);
  const minutes = getRandomInteger(0, maxMinutesOffset);

  return dayjs(dateStart)
    .add(Math.abs(days), 'd')
    .add(hours, 'h')
    .add(minutes, 'm')
    .toDate();
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
    const monthStart = dayjs(eventStart.dateStart).month();
    const monthEnd = dayjs(eventEnd.dateEnd).month();

    if (monthStart === monthEnd) {
      return `${humanizeDate(eventStart.dateStart, 'MMM DD')}&nbsp;&mdash;&nbsp;${humanizeDate(eventEnd.dateEnd, 'DD')}`;
    }

    return `${humanizeDate(eventStart.dateStart, 'MMM DD')}&nbsp;&mdash;&nbsp;${humanizeDate(eventEnd.dateEnd, 'MMM DD')}`;
  }

  return 'trip date';
};
