import {getDateDifference, humanizeDate} from './common';
import {DateTimeFormats} from '../const';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const getDuration = (ms) => {
  return dayjs.duration(ms);
};

export const compareDates = (dateStart, dateEnd) => {
  return dayjs(dateStart).isAfter(dateEnd);
};

const getDurationBetweenDates = (dateStart, dateEnd) => {
  return getDuration(getDateDifference(dateStart, dateEnd));
};

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
