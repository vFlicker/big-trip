import {
  ApiService,
  AUTHORIZATION,
  DESTINATION_STORE_NAME,
  END_POINT,
  EVENTS_STORE_NAME,
  OFFERS_STORE_NAME,
  Provider,
  Store,
} from './api';
import { FilterType, MenuItem, UpdateType } from './const';
import { render } from './framework';
import { EventsModel, FilterModel } from './model';
import {
  BoardPresenter,
  FilterPresenter,
  StatisticPresenter,
  TripInfoPresenter,
} from './presenter';
import { isOnline, showToast } from './utils';
import { MenuView, NewEventButtonView } from './view';

const tripElement = document.querySelector('.trip-main');
const menuElement = tripElement.querySelector('.trip-controls__navigation');
const filterElement = tripElement.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-main .page-body__container');

const api = new ApiService(END_POINT, AUTHORIZATION);

const eventsStorage = new Store(EVENTS_STORE_NAME, window.localStorage);
const destinationStorage = new Store(DESTINATION_STORE_NAME,window.localStorage);
const offerStorage = new Store(OFFERS_STORE_NAME, window.localStorage);

const apiWithProvider = new Provider(
  api,
  eventsStorage,
  destinationStorage,
  offerStorage
);

const eventsModel = new EventsModel(apiWithProvider);
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(
  mainElement,
  eventsModel,
  filterModel,
);
const filterPresenter = new FilterPresenter(
  filterElement,
  filterModel,
  eventsModel,
);
const statisticPresenter = new StatisticPresenter(mainElement, eventsModel);
const tripInfoPresenter = new TripInfoPresenter(tripElement, eventsModel);

const menuComponent = new MenuView();
const newEventButtonComponent = new NewEventButtonView();

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticPresenter.destroy();
      menuComponent.setItem(menuItem);
      boardPresenter.init();
      break;
    case MenuItem.STATS:
      boardPresenter.destroy();
      menuComponent.setItem(menuItem);
      statisticPresenter.init();
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

  statisticPresenter.destroy();
  boardPresenter.destroy();
  menuComponent.setItem(MenuItem.TABLE);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  boardPresenter.init();
  boardPresenter.createEvent(handleEventNewClose);
  newEventButtonComponent.disable();
};

render(menuComponent, menuElement);
render(newEventButtonComponent, tripElement);

tripInfoPresenter.init();
boardPresenter.init();
filterPresenter.init();

eventsModel.init().finally(() => {
  menuComponent.enable();
  newEventButtonComponent.enable();
  menuComponent.setClickHandler(handleMenuClick);
  newEventButtonComponent.setClickHandler(newEventButtonClickHandler);
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

