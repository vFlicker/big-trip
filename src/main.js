import { creatTripInfoTemplate } from './view/trip-info';
import { createMenuTemplate } from './view/menu';
import { createFilterTemplate } from './view/filter';
import { createSortTemplate } from './view/sort';
import { createEventListTemplate } from './view/event-list';

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
