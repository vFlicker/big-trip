import { AbstractView } from '../framework';

// TODO: refactor this class
export class SmartView extends AbstractView {
  _state = {};

  updateState = (update) => {
    if (!update) {
      return;
    }

    this._setState(update);

    this.#rerenderElement();
  };

  _setState = (update) => {
    this._state = { ...this._state, ...update };
  };

  _restoreHandlers = () => {
    throw new Error('Abstract method not implemented: resetHandlers');
  };

  #rerenderElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  };
}
