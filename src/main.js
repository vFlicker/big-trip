import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import FilterView from './view/filter';
import SortView from './view/sort';
import EventListView from './view/event-list';
import EventItemView from './view/event-item';
import EventItemEditView from './view/event-item-edit';
import { getEvents } from './mock/event';
import { render } from './utils/render';

const EVENT_COUNT = 5;
const events = getEvents(EVENT_COUNT);

// Header
const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');

render(containerTripMain, new TripInfoView(events).getElement(), 'afterbegin');
render(containerMenu, new MenuView().getElement(), 'beforeend');
render(containerFilter, new FilterView().getElement(), 'beforeend');

// Main
const containerTripEvents = document.querySelector('.trip-events');
render(containerTripEvents, new SortView().getElement(), 'beforeend');
render(containerTripEvents, new EventListView().getElement(), 'beforeend');

const containerEventList = document.querySelector('.trip-events__list');
render(containerEventList, new EventItemEditView(events[0]).getElement(), 'beforeend');

events.forEach((event) => {
  render(containerEventList, new EventItemView(event).getElement(), 'beforeend');
});
