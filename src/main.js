import Api from './api/api';
import {AUTHORIZATION, END_POINT, EVENTS_STORE_NAME, DESTINATION_STORE_NAME, OFFERS_STORE_NAME} from './api/const';
import Store from './api/store';
import Provider from './api/provider';
import {FilterType, MenuItem, UpdateType} from './const';
import { EventsModel, FilterModel } from './model';
import {
  BoardPresenter,
  FilterPresenter,
  StatisticPresenter,
  TripInfoPresenter,
} from './presenter';
import { isOnline, render, RenderPosition, showToast } from './utils';
import { MenuView, NewEventButtonView } from './view';


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
    menuComponent.disable();
    newEventButtonComponent.disable();
    eventsModel.setEvents(UpdateType.INIT, events);
  })
  .catch(() => {
    menuComponent.disable();
    newEventButtonComponent.disable();
    eventsModel.setEvents(UpdateType.INIT, []);
  })
  .finally(() => {
    menuComponent.enable();
    newEventButtonComponent.enable();
    menuComponent.setClickHandler(handleMenuClick);
    newEventButtonComponent.setClickHandler(newEventButtonClickHandler);
  });

