import dayjs from 'dayjs';

export const compareDates = (dateStart, dateEnd) =>
  dayjs(dateStart).isAfter(dateEnd);

