import dayjs from 'dayjs';

import { getDateDifference } from '../../../utils';

const getUniqueItems = (items) => [...new Set(items)];

const getFilteredEventByType = (events, type) =>
  events.filter((event) => event.type === type);

const getSumPrice = (events) =>
  events.reduce((totalPrice, event) => event.price + totalPrice, 0);

const getDuration = (events) =>
  events.reduce((totalDuration, event) =>
    getDateDifference(event.dateStart, event.dateEnd) + totalDuration, 0);

export const getEventTypes = (events) =>
  getUniqueItems(events.map((event) => event.type));

export const getSumPriceByType = (events) => {
  const eventTypes = getEventTypes(events);

  return eventTypes.map((type) =>
    getSumPrice(getFilteredEventByType(events, type)));
};

export const getCountOfUses = (events) => {
  const eventTypes = getEventTypes(events);

  return eventTypes.map((type) =>
    getFilteredEventByType(events, type).length);
};

export const getDurationInMs = (events) => {
  const eventTypes = getEventTypes(events);

  return eventTypes.map((type) =>
    getDuration(getFilteredEventByType(events, type)));
};

export const getHumanizeDuration = (date) => {
  const days = dayjs.duration(date).days();
  const hours = dayjs.duration(date).hours();
  const minutes = dayjs.duration(date).minutes();

  if (days) {
    return `${days} D`;
  }

  if (hours) {
    return `${hours} H`;
  }

  return `${minutes} M`;
};
