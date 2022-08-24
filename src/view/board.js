import AbstractView from './abstract';

const createBoardTemplate = () => (
  `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>`
);

export default class Board extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}
