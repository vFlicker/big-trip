import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import FilterView from './view/filter';
import NoEventView from './view/no-event';
import SortView from './view/sort';
import EventListView from './view/event-list';
import EventItemView from './view/event-item';
import EventItemEditView from './view/event-item-edit';
import { getEvents } from './mock/event';
import { render, RenderPosition } from './utils/render';

const EVENT_COUNT = 5;
const events = getEvents(EVENT_COUNT);

// Header
const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');

render(containerTripMain, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);
render(containerMenu, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(containerFilter, new FilterView().getElement(), RenderPosition.BEFOREEND);

// Main
const containerMainContent = document.querySelector('.trip-events');

if (!EVENT_COUNT) {
  render(containerMainContent, new NoEventView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(containerMainContent, new SortView().getElement(), RenderPosition.BEFOREEND);

  const renderEvent = (eventListComponent, event) => {
    const eventItemComponent = new EventItemView(event);
    const eventItemEditComponent = new EventItemEditView(event);

    const replaceEventToForm = (evt) => {
      evt.preventDefault();
      eventListComponent.replaceChild(eventItemEditComponent.getElement(), eventItemComponent.getElement());
    };

    const replaceFormToEvent = (evt) => {
      evt.preventDefault();
      eventListComponent.replaceChild(eventItemComponent.getElement(), eventItemEditComponent.getElement());
    };

    eventItemComponent
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', replaceEventToForm);

    eventItemEditComponent
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', replaceFormToEvent);

    render(eventListComponent, eventItemComponent.getElement(), RenderPosition.BEFOREEND);
  };

  const eventListComponent = new EventListView().getElement();
  render(containerMainContent, eventListComponent, RenderPosition.BEFOREEND);

  events.forEach((event) => renderEvent(eventListComponent, event));
}
