import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { DateTimeFormats } from '../const';
import { getDateDifference, humanizeDate } from './common';

dayjs.extend(duration);

const getDuration = (ms) => dayjs.duration(ms);

export const compareDates = (dateStart, dateEnd) =>
  dayjs(dateStart).isAfter(dateEnd);

const getDurationBetweenDates = (dateStart, dateEnd) =>
  getDuration(getDateDifference(dateStart, dateEnd));

export const humanizeDateTime = (date) => {
  const firstDate = humanizeDate(date, DateTimeFormats.FULL_DATE);
  const secondDate = humanizeDate(date, DateTimeFormats.TIME);
  const union = 'T';

  return `${firstDate}${union}${secondDate}`;
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
