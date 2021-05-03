import { creatTripInfoTemplate } from './view/trip-info';
import { createMenuTemplate } from './view/menu';
import { createFiltersTemplate } from './view/filters';

const render = (container, block, position) => {
  container.insertAdjacentHTML(position, block);
};

const containerTripMain = document.querySelector('.trip-main');
render(containerTripMain, creatTripInfoTemplate(), 'afterbegin');

const containerMenu = document.querySelector('.trip-controls__navigation');
render(containerMenu, createMenuTemplate(), 'beforeend');

const containerFilter = document.querySelector('.trip-controls__filters');
render(containerFilter, createFiltersTemplate(), 'beforeend');
