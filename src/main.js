import Api from './api/api';
import Provider from './api/provider';
import Store from './api/store';
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

const EVENTS_STORE_PREFIX = 'bigtrip-localstorage-events';
const EVENTS_STORE_VER = 'v1';
const EVENTS_STORE_NAME = `${EVENTS_STORE_PREFIX}-${EVENTS_STORE_VER}`;

const DESTINATION_STORE_PREFIX = 'bigtrip-localstorage-destinations';
const DESTINATION_STORE_VER = 'v1';
const DESTINATION_STORE_NAME = `${DESTINATION_STORE_PREFIX}-${DESTINATION_STORE_VER}`;

const OFFERS_STORE_PREFIX = 'bigtrip-localstorage-offers';
const OFFERS_STORE_VER = 'v1';
const OFFERS_STORE_NAME = `${OFFERS_STORE_PREFIX}-${OFFERS_STORE_VER}`;

const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');
const containerMainContent = document.querySelector('.page-main .page-body__container');

const api = new Api(END_POINT, AUTHORIZATION);
const eventsStorage = new Store(EVENTS_STORE_NAME, window.localStorage);
const destinationStorage= new Store(DESTINATION_STORE_NAME, window.localStorage);
const offerStorage = new Store(OFFERS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, eventsStorage, destinationStorage, offerStorage);

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
  apiWithProvider,
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

Promise.all([apiWithProvider.getDestinations(), apiWithProvider.getEvents(), apiWithProvider.getOffers()])
  .then(([destinations, events, offers]) => {
    destinationModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    eventsModel.setEvents(UpdateType.INIT, events);
    render(containerTripMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);
  })
  .catch(() => {
    destinationModel.setDestinations([]);
    offersModel.setOffers([]);
    eventsModel.setEvents(UpdateType.INIT, []);
    render(containerTripMain, new TripInfoView([]), RenderPosition.AFTERBEGIN);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
