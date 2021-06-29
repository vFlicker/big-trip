import Api from './api/api';
import DestinationsModel from './model/destinations';
import EventsModel from './model/events';
import FilterModel from './model/filter';
import OffersModel from './model/offers';
import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import NewEventButtonView from './view/new-event-button';
import StatisticsView from './view/statistic';
import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter';
import { availableDestination, availableTypes, availableOffers } from './mock/event';
import {remove, render, RenderPosition} from './utils/render';
import {FilterType, MenuItem, UpdateType} from './utils/const';

const AUTHORIZATION = 'Basic 48avd2449w934avd';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const destinationModel = new DestinationsModel();
const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();

// Header
const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');

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

Promise.all([api.getDestinations(), api.getEvents(), api.getOffers()])
  .then(([destinations, events, offers]) => {
    destinationModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    eventsModel.setEvents(UpdateType.INIT, events);
    render(containerTripMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);
  });
