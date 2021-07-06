import DestinationsModel from './model/destinations';
import EventsModel from './model/events';
import FilterModel from './model/filter';
import OffersModel from './model/offers';
import MenuView from './view/menu';
import NewEventButtonView from './view/new-event-button';
import StatisticsView from './view/statistic';
import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import {isOnline} from './utils/common';
import {remove, render, RenderPosition} from './utils/render';
import {showToast} from './utils/toast/toast';
import {FilterType, MenuItem, UpdateType} from './const';
import Api from './api/api';
import Provider from './api/provider';
import Store from './api/store';
import {
  AUTHORIZATION,
  END_POINT,
  EVENTS_STORE_NAME,
  DESTINATION_STORE_NAME,
  OFFERS_STORE_NAME
} from './api/const';

const containerTripMain = document.querySelector('.trip-main');
const containerMenu = containerTripMain.querySelector('.trip-controls__navigation');
const containerFilter = containerTripMain.querySelector('.trip-controls__filters');
const containerMainContent = document.querySelector('.page-main .page-body__container');

const api = new Api(END_POINT, AUTHORIZATION);
const eventsStorage = new Store(EVENTS_STORE_NAME, window.localStorage);
const destinationStorage = new Store(DESTINATION_STORE_NAME, window.localStorage);
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

const tripInfoPresenter = new TripInfoPresenter(
  containerTripMain,
  eventsModel,
);

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      menuComponent.setItem(menuItem);
      boardPresenter.init();
      break;
    case MenuItem.STATS:
      boardPresenter.destroy();
      menuComponent.setItem(menuItem);
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(containerMainContent, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const handleEventNewClose = () => {
  newEventButtonComponent.enable();
};

const newEventButtonClickHandler = () => {
  if (!isOnline()) {
    showToast('You can\'t create new point offline');
    return;
  }

  remove(statisticsComponent);
  boardPresenter.destroy();
  menuComponent.setItem(MenuItem.TABLE);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  boardPresenter.init();
  boardPresenter.createEvent(handleEventNewClose);
  newEventButtonComponent.disable();
};

render(containerMenu, menuComponent, RenderPosition.BEFOREEND);
render(containerTripMain, newEventButtonComponent, RenderPosition.BEFOREEND);

tripInfoPresenter.init();
boardPresenter.init();
filterPresenter.init();

Promise.all([apiWithProvider.getDestinations(), apiWithProvider.getEvents(), apiWithProvider.getOffers()])
  .then(([destinations, events, offers]) => {
    newEventButtonComponent.disable();
    destinationModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    eventsModel.setEvents(UpdateType.INIT, events);
  })
  .catch(() => {
    newEventButtonComponent.disable();
    destinationModel.setDestinations([]);
    offersModel.setOffers([]);
    eventsModel.setEvents(UpdateType.INIT, []);
  })
  .finally(() => {
    newEventButtonComponent.enable();
    newEventButtonComponent.setClickHandler(newEventButtonClickHandler);
    menuComponent.setClickHandler(handleMenuClick);
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
