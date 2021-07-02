import dayjs from 'dayjs';
import { FilterType } from '../const';

const isPastDate = (date) => {
  return dayjs().isAfter(date);
};

const isFutureDate  = (date) => {
  return dayjs().isBefore(date, 'day') || dayjs().isSame(date, 'day');
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureDate(event.dateStart)),
  [FilterType.PAST]: (events) => events.filter((event) => isPastDate(event.dateEnd)),
};
