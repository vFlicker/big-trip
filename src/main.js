import { creatTripInfoTemplate } from './view/trip-info';
import { createMenuTemplate } from './view/menu';

const render = (container, block, position) => {
  container.insertAdjacentHTML(position, block);
};

const containerTripMain = document.querySelector('.trip-main');
render(containerTripMain, creatTripInfoTemplate(), 'afterbegin');

const containerMenu = document.querySelector('.trip-controls__navigation');
render(containerMenu, createMenuTemplate(), 'beforeend');
