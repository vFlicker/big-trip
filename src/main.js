import { creatTripInfoTemplate } from './view/trip-info';

const render = (container, block, position) => {
  container.insertAdjacentHTML(position, block);
};

const containerTripMain = document.querySelector('.trip-main');
render(containerTripMain, creatTripInfoTemplate(), 'afterbegin');
