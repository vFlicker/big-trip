import dayjs from 'dayjs';
import { availableDestination, availableOffers } from '../mock/event';

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

export const DATEPICKER_BASIC_SETTINGS = {
  enableTime: true,
  time_24hr: true,
  dateFormat: 'm/d/y H:i',
};

export const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const DEFAULT_EVENT = {
  dateStart: dayjs().startOf('day').toDate(),
  dateEnd: dayjs().startOf('day').toDate(),
  destination: availableDestination[0],
  isFavorite: false,
  price: 0,
  type: 'taxi',
  offers: availableOffers['taxi'],
};
