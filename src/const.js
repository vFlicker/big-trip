import dayjs from 'dayjs';

export const DATEPICKER_BASIC_SETTINGS = {
  enableTime: true,
  time_24hr: true,
  dateFormat: 'm/d/y H:i',
};

export const DateTimeFormats = {
  DAY: 'D',
  FULL_DATE_AND_TIME: 'MM/D/YY HH:mm',
  FULL_DATE: 'MM/D YYYY',
  MONTH_AND_DAY: 'MMM D',
  TIME: 'HH:mm',
};

export const DEFAULT_EVENT = {
  dateStart: dayjs().startOf('day').toDate(),
  dateEnd: dayjs().startOf('day').toDate(),
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  isFavorite: false,
  price: 0,
  type: 'taxi',
  offers: [],
};

export const EscKeyEvent = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  TABLE: 'table',
  STATS: 'stats',
};

export const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export const ResetButtonText = {
  ADD: 'Cancel',
  EDIT: 'Delete',
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

export const STATISTIC_SETTINGS = {
  backgroundColor: '#ffffff',
  barHeight: 55,
  barThickness: 44,
  basicFontSize: 13,
  dataAnchor: 'start',
  dataLabelsAlign: 'start',
  dataLabelsAnchor: 'end',
  dataLabelsColor: '#000000',
  fontColor: '#000000',
  hoverBackgroundColor: '#ffffff',
  minBarLength: 50,
  padding: 5,
  titleFontSize: 23,
  titlePosition: 'left',
  type: 'horizontalBar',
};

export const StatisticTitles = {
  TYPE: 'TYPE',
  MONEY: 'MONEY',
  TIME_SPENT: 'TIME-SPENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};
