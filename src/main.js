import EventsModel from './model/events';
import FilterModel from './model/filter';
import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import NewEventButtonView from './view/new-event-button';
import StatisticsView from './view/statistic';
import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter';
import { getEvents, availableDestination, availableTypes, availableOffers } from './mock/event';
import {remove, render, RenderPosition} from './utils/render';
import {FilterType, MenuItem, UpdateType} from './utils/const';

const EVENT_COUNT = 5;
const events = getEvents(EVENT_COUNT);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

// Header
const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');
render(containerTripMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);

const menuComponent = new MenuView();
const newEventButtonComponent = new NewEventButtonView();
let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      menuComponent.setMenuItem(menuItem);
      boardPresenter.init(availableDestination, availableTypes, availableOffers);
      break;
    case MenuItem.STATS:
      boardPresenter.destroy();
      menuComponent.setMenuItem(menuItem);
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(containerMainContent, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const handleEventNewClose = () => {
  newEventButtonComponent.getElement().disabled = false;
};

menuComponent.setMenuClickHandler(handleMenuClick);
newEventButtonComponent.setButtonClickHandler(() => {
  remove(statisticsComponent);
  boardPresenter.destroy();
  menuComponent.setMenuItem(MenuItem.TABLE);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  boardPresenter.init(availableDestination, availableTypes, availableOffers);
  boardPresenter.createEvent(handleEventNewClose);
  newEventButtonComponent.getElement().disabled = true;
});

render(containerMenu, menuComponent, RenderPosition.BEFOREEND);
render(containerTripMain, newEventButtonComponent, RenderPosition.BEFOREEND);

// Main
const containerMainContent = document.querySelector('.page-main .page-body__container');

const boardPresenter = new BoardPresenter(containerMainContent, eventsModel, filterModel);
boardPresenter.init(availableDestination, availableTypes, availableOffers);

const filterPresenter = new FilterPresenter(containerFilter, filterModel, eventsModel);
filterPresenter.init();
