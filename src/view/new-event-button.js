import AbstractView from './abstract';

const createNewEventButton = () => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
      New event
    </button>`
);

export default class NewEventButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNewEventButton();
  }

  setClickHandler(callback) {
    this._callback.buttonClick = callback;

    this
      .getElement()
      .addEventListener('click', this._clickHandler);
  }

  enable() {
    this.getElement().disabled = false;
  }

  disable() {
    this.getElement().disabled = true;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }
}
