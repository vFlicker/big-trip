import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import FilterView from './view/filter';
import BoardPresenter from './presenter/board';
import { getEvents, availableDestination, availableTypes, availableOffers } from './mock/event';
import { render, RenderPosition } from './utils/render';

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
const containerMainContent = document.querySelector('.page-main .page-body__container');

const boardPresenter = new BoardPresenter(containerMainContent);
boardPresenter.init(events, availableDestination, availableTypes, availableOffers);
