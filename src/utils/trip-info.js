import {humanizeDate} from './common';
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
      return `${humanizeDate(firstEvent.dateStart, 'MMM DD')}`;
    }

    if (monthFrom === monthTo) {
      return (
        `${humanizeDate(firstEvent.dateStart, 'MMM DD')}
        &nbsp;&mdash;&nbsp;
        ${humanizeDate(lastEvent.dateEnd, 'DD')}`
      );
    }

    return (
      `${humanizeDate(firstEvent.dateStart, 'MMM DD')}
      &nbsp;&mdash;&nbsp;
      ${humanizeDate(lastEvent.dateEnd, 'MMM DD')}`
    );
  }

  return 'trip date';
};

export const getPrice = (events) => events.reduce((sum, event) => sum + event.price, 0);

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
