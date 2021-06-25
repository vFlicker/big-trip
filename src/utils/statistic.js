import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getDateDifference } from './date';

dayjs.extend(duration);

export const getUniqueItems = (items) => [...new Set(items)];

const getFilteredEventByType = (events, type) => {
  return events.filter((event) => event.type === type);
};

const getSumPrice = (events) => {
  return events.reduce((totalPrice, event) => event.price + totalPrice, 0);
};

const getDuration = (events) => {
  return events.reduce((totalDuration, event) => getDateDifference(event.dateStart, event.dateEnd) + totalDuration, 0);
};

export const getEventTypes = (events) => {
  return getUniqueItems(events.map((event) => event.type));
};

export const getSumPriceByType = (events) => {
  const eventTypes = getEventTypes(events);

  return eventTypes.map((type) => getSumPrice(getFilteredEventByType(events, type)));
};

export const getCountOfUses = (events) => {
  const eventTypes = getEventTypes(events);

  return eventTypes.map((type) => getFilteredEventByType(events, type).length);
};

export const getDurationInMs = (events) => {
  const eventTypes = getEventTypes(events);

  return eventTypes.map((type) => getDuration(getFilteredEventByType(events, type)));
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
