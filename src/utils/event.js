import {getDateDifference} from './common';
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

export const humanizeDate = (date, formatter = 'MM-DD-YYYY') => {
  return dayjs(date).format(formatter);
};

export const humanizeDateTime = (date) => {
  const firstDate = humanizeDate(date, 'MM-DD-YYYY');
  const secondDate = humanizeDate(date, 'HH:mm');
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
