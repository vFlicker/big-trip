import { FilterType } from '../const';
import { isFutureDate, isPastDate } from './date';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureDate(event.dateStart)),
  [FilterType.PAST]: (events) => events.filter((event) => isPastDate(event.dateEnd)),
};
