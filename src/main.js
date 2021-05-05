import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import FilterView from './view/filter';
import SortView from './view/sort';
import EventListView from './view/event-list';
import EventItemView from './view/event-item';
import EventItemEditView from './view/event-item-edit';
import { getEvents } from './mock/event';
import { renderElement} from './utils/render';

const EVENT_COUNT = 5;
const events = getEvents(EVENT_COUNT);

// Header
const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');

renderElement(containerTripMain, new TripInfoView(events).getElement(), 'afterbegin');
renderElement(containerMenu, new MenuView().getElement(), 'beforeend');
renderElement(containerFilter, new FilterView().getElement(), 'beforeend');

// Main
const containerTripEvents = document.querySelector('.trip-events');
renderElement(containerTripEvents, new SortView().getElement(), 'beforeend');
renderElement(containerTripEvents, new EventListView().getElement(), 'beforeend');

const containerEventList = document.querySelector('.trip-events__list');
renderElement(containerEventList, new EventItemEditView(events[0]).getElement(), 'beforeend');

events.forEach((event) => {
  renderElement(containerEventList, new EventItemView(event).getElement(), 'beforeend');
});
