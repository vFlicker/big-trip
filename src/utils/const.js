import dayjs from 'dayjs';

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
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
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

export const MenuItem = {
  TABLE: 'table',
  STATS: 'stats',
};

export const STATISTICS_SETTINGS = {
  type: 'horizontalBar',
  backgroundColor: '#ffffff',
  hoverBackgroundColor: '#ffffff',
  dataAnchor: 'start',
  basicFontSize: 13,
  datalabelsColor: '#000000',
  fontColor: '#000000',
  datalabelsAnchor: 'end',
  datalabelsAlign: 'start',
  titleFontSize: 23,
  titlePosition: 'left',
  padding: 5,
  minBarLength: 50,
  barHeight: 55,
  barThickness: 44,

};

export const StatiscticsTitles = {
  TYPE: 'TYPE',
  MONEY: 'MONEY',
  TIME_SPENT: 'TIME-SPENT',
};

export const ResetButtonText = {
  ADD: 'Cancel',
  EDIT: 'Delete',
};
