import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getRandomInteger } from '../mock/utils';

dayjs.extend(duration);

const minDaysOffset = -7;
const maxDaysOffset = 7;
const maxHoursOffset = 23;
const maxMinutesOffset = 59;

const getDuration = (ms) => {
  return dayjs.duration(ms);
};

const getDurationBetweenDates = (dateStart, dateEnd) => {
  return getDuration(getDateDifference(dateStart, dateEnd));
};

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

export const getDateDifference = (dateStart, dateEnd) => {
  return dayjs(dateEnd).diff(dayjs(dateStart));
};

export const humanizeDurationBetweenDates = (dateStart, dateEnd) => {
  const durationBetweenDates = getDurationBetweenDates(dateStart, dateEnd);

  const days = durationBetweenDates.days();
  const hours = durationBetweenDates.hours();
  const minutes = durationBetweenDates.minutes();

  if (days) {
    return `${days}D ${hours}H ${minutes}M`;
  }

  if (hours) {
    return `${hours}H ${minutes}M`;
  }

  return `${minutes}M`;
};

export const humanizeDate = (date, formatter = 'MM-DD-YYYY') => {
  return dayjs(date).format(formatter);
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

export const isPastDate = (date) => {
  return dayjs().isAfter(date);
};

export const isFutureDate  = (date) => {
  return dayjs().isBefore(date, 'day') || dayjs().isSame(date, 'day');
};
