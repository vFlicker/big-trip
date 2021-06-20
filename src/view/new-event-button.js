import AbstractView from './abstract';

const createNewEventButton = () => {
  return (
    '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
  );
};

export default class NewEventButton extends AbstractView {
  constructor() {
    super();

    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  getTemplate() {
    return createNewEventButton();
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();

    this._callback.buttonClick();
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;

    this
      .getElement()
      .addEventListener('click', this._buttonClickHandler);
  }
}
