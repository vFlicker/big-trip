import { creatTripInfoTemplate } from './view/trip-info';
import { createMenuTemplate } from './view/menu';
import { createFilterTemplate } from './view/filter';
import { createSortTemplate } from './view/sort';
import { createEventListTemplate } from './view/event-list';
import { createEventItemTemplate } from './view/event-item';

const EVENT_COUNT = 3;

const render = (container, block, position) => {
  container.insertAdjacentHTML(position, block);
};

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

for (let index = 0; index < EVENT_COUNT; index++) {
  render(containerEventList, createEventItemTemplate(), 'beforeend');
}
