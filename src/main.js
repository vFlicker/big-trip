import { creatTripInfoTemplate } from './view/trip-info';
import { createMenuTemplate } from './view/menu';
import { createFilterTemplate } from './view/filter';
import { createSortTemplate } from './view/sort';
import { createEventListTemplate } from './view/event-list';
import { createEventItemTemplate } from './view/event-item';
import { createEventItemEditTemplate } from './view/event-item-edit';
import { getEvents } from './mock/event';
import { render } from './utils/render';

const EVENT_COUNT = 5;
const events = getEvents(EVENT_COUNT);

// Header
const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');

render(containerTripMain, creatTripInfoTemplate(events), 'afterbegin');
render(containerMenu, createMenuTemplate(), 'beforeend');
render(containerFilter, createFilterTemplate(), 'beforeend');

// Main
const containerTripEvents = document.querySelector('.trip-events');
render(containerTripEvents, createSortTemplate(), 'beforeend');
render(containerTripEvents, createEventListTemplate(), 'beforeend');

const containerEventList = document.querySelector('.trip-events__list');
render(containerEventList, createEventItemEditTemplate(), 'beforeend');

events.forEach((event) => {
  render(containerEventList, createEventItemTemplate(event), 'beforeend');
});
