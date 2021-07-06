import {humanizeDate} from './common';
import {DateTimeFormats} from '../const';
import dayjs from 'dayjs';

export const getEventPeriod = (events) => {
  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];

  if (firstEvent && lastEvent) {
    const monthFrom = dayjs(firstEvent.dateStart).month();
    const monthTo = dayjs(lastEvent.dateEnd).month();
    const dayFrom = dayjs(firstEvent.dateStart).date();
    const dayTo = dayjs(lastEvent.dateEnd).date();

    if (monthFrom === monthTo && dayFrom === dayTo) {
      return `${humanizeDate(firstEvent.dateStart, DateTimeFormats.MONTH_AND_DAY)}`;
    }

    if (monthFrom === monthTo) {
      return (
        `${humanizeDate(firstEvent.dateStart, DateTimeFormats.MONTH_AND_DAY)}
        &nbsp;&mdash;&nbsp;
        ${humanizeDate(lastEvent.dateEnd, DateTimeFormats.DAY)}`
      );
    }

    return (
      `${humanizeDate(firstEvent.dateStart, DateTimeFormats.MONTH_AND_DAY)}
      &nbsp;&mdash;&nbsp;
      ${humanizeDate(lastEvent.dateEnd, DateTimeFormats.MONTH_AND_DAY)}`
    );
  }

  return 'trip date';
};

export const getTotalPrice = (events) => {
  return events.reduce((sum, event) => {
    const offersPrice = event.offers.reduce((sum, offer) => sum += offer.price, 0);

    return sum + event.price + offersPrice;
  }, 0);
};

export const getTitle = (events) => {
  if (events.length > 3) {
    const firstEventName = events[0].destination.name;
    const lastEventName = events[events.length - 1].destination.name;

    return `${firstEventName} &mdash; ... &mdash; ${lastEventName}`;
  }

  return events
    .map((event) => event.destination.name)
    .join(' &mdash; ');
};
