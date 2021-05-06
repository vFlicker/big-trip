import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import FilterView from './view/filter';
import NoEventView from './view/no-event';
import SortView from './view/sort';
import EventListView from './view/event-list';
import EventItemView from './view/event-item';
import EventItemEditView from './view/event-item-edit';
import { getEvents } from './mock/event';
import { render, RenderPosition, replace } from './utils/render';

const EVENT_COUNT = 5;
const events = getEvents(EVENT_COUNT);

// Header
const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');

render(containerTripMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);
render(containerMenu, new MenuView(), RenderPosition.BEFOREEND);
render(containerFilter, new FilterView(), RenderPosition.BEFOREEND);

// Main
const containerMainContent = document.querySelector('.trip-events');

if (!EVENT_COUNT) {
  render(containerMainContent, new NoEventView(), RenderPosition.BEFOREEND);
} else {
  render(containerMainContent, new SortView(), RenderPosition.BEFOREEND);

  const renderEvent = (eventListComponent, event) => {
    const eventItemComponent = new EventItemView(event);
    const eventItemEditComponent = new EventItemEditView(event);

    const replaceEventToForm = () => {
      replace(eventItemEditComponent, eventItemComponent);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const replaceFormToEvent = () => {
      replace(eventItemComponent, eventItemEditComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        replaceFormToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventItemComponent.setEditClickHandler(replaceEventToForm);
    eventItemEditComponent.setEditClickHandler(replaceFormToEvent);
    eventItemEditComponent.setFormSubmitHandler(replaceFormToEvent);

    render(eventListComponent, eventItemComponent, RenderPosition.BEFOREEND);
  };

  const eventListComponent = new EventListView();
  render(containerMainContent, eventListComponent, RenderPosition.BEFOREEND);

  events.forEach((event) => renderEvent(eventListComponent, event));
}
