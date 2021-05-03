import { creatTripInfoTemplate } from './view/trip-info';
import { createMenuTemplate } from './view/menu';
import { createFilterTemplate } from './view/filter';
import { createSortTemplate } from './view/sort';
import { createEventListTemplate } from './view/event-list';
import { createEventItemTemplate } from './view/event-item';
import { createEventItemEditTemplate } from './view/event-item-edit';
import { render } from './utils/common';

const EVENT_COUNT = 3;

// Header
const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');

render(containerTripMain, creatTripInfoTemplate(), 'afterbegin');
render(containerMenu, createMenuTemplate(), 'beforeend');
render(containerFilter, createFilterTemplate(), 'beforeend');

// Main
const containerTripEvents = document.querySelector('.trip-events');
render(containerTripEvents, createSortTemplate(), 'beforeend');
render(containerTripEvents, createEventListTemplate(), 'beforeend');

const containerEventList = document.querySelector('.trip-events__list');
render(containerEventList, createEventItemEditTemplate(), 'beforeend');

for (let index = 0; index < EVENT_COUNT; index++) {
  render(containerEventList, createEventItemTemplate(), 'beforeend');
}
