import EventsModel from './model/events';
import FilterModel from './model/filter';
import MenuView from './view/menu';
import NewEventButtonView from './view/new-event-button';
import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter';
import StatisticPresenter from './presenter/statistic';
import TripInfoPresenter from './presenter/trip-info';
import {isOnline} from './utils/common';
import {render, RenderPosition} from './utils/render';
import {showToast} from './utils/toast/toast';
import {FilterType, MenuItem, UpdateType} from './const';
import Api from './api/api';
import Provider from './api/provider';
import Store from './api/store';
import {AUTHORIZATION, END_POINT, EVENTS_STORE_NAME, DESTINATION_STORE_NAME, OFFERS_STORE_NAME} from './api/const';

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

const menuComponent = new MenuView();
const newEventButtonComponent = new NewEventButtonView();

const boardPresenter = new BoardPresenter(containerMainContent, eventsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(containerFilter, filterModel, eventsModel);
const statisticPresenter = new StatisticPresenter(containerMainContent, eventsModel);
const tripInfoPresenter = new TripInfoPresenter(containerTripMain, eventsModel);

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

render(containerMenu, menuComponent, RenderPosition.BEFOREEND);
render(containerTripMain, newEventButtonComponent, RenderPosition.BEFOREEND);

tripInfoPresenter.init();
boardPresenter.init();
filterPresenter.init();

apiWithProvider.getAllData()
  .then((events) => {
    newEventButtonComponent.disable();
    eventsModel.setEvents(UpdateType.INIT, events);
  })
  .catch(() => {
    newEventButtonComponent.disable();
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
