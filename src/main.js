import Api from './api/api';
import DestinationsModel from './model/destinations';
import EventsModel from './model/events';
import FilterModel from './model/filter';
import OffersModel from './model/offers';
import MenuView from './view/menu';
import TripInfoView from './view/trip-info';
import NewEventButtonView from './view/new-event-button';
import StatisticsView from './view/statistic';
import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter';
import {remove, render, RenderPosition} from './utils/render';
import {FilterType, MenuItem, UpdateType} from './const';

const AUTHORIZATION = 'Basic 48avd2449w934avd';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');
const containerMainContent = document.querySelector('.page-main .page-body__container');

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const destinationModel = new DestinationsModel();
const offersModel = new OffersModel();

const menuComponent = new MenuView();
const newEventButtonComponent = new NewEventButtonView();

const boardPresenter = new BoardPresenter(
  containerMainContent,
  eventsModel,
  filterModel,
  destinationModel,
  offersModel,
  api,
);

const filterPresenter = new FilterPresenter(
  containerFilter,
  filterModel,
  eventsModel,
);

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      menuComponent.setMenuItem(menuItem);
      boardPresenter.init();
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

const newEventButtonClickHandler = () => {
  remove(statisticsComponent);
  boardPresenter.destroy();
  menuComponent.setMenuItem(MenuItem.TABLE);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  boardPresenter.init();
  boardPresenter.createEvent(handleEventNewClose);
  newEventButtonComponent.getElement().disabled = true;
};

menuComponent.setMenuClickHandler(handleMenuClick);
newEventButtonComponent.setButtonClickHandler(newEventButtonClickHandler);

render(containerMenu, menuComponent, RenderPosition.BEFOREEND);
render(containerTripMain, newEventButtonComponent, RenderPosition.BEFOREEND);

boardPresenter.init();
filterPresenter.init();

Promise.all([api.getDestinations(), api.getEvents(), api.getOffers()])
  .then(([destinations, events, offers]) => {
    destinationModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    eventsModel.setEvents(UpdateType.INIT, events);
    render(containerTripMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);
  });
