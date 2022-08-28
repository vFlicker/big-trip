import AbstractView from './abstract-view';

const createNewEventButton = () => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
      New event
    </button>`
);

export default class NewEventButtonView extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  get template() {
    return createNewEventButton();
  }

  setClickHandler(callback) {
    this._callback.buttonClick = callback;

    this
      .element
      .addEventListener('click', this._clickHandler);
  }

  enable() {
    this.element.disabled = false;
  }

  disable() {
    this.element.disabled = true;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }
}
