import { AbstractView } from '../framework';

// TODO: refactor this class
export class SmartView extends AbstractView {
  constructor() {
    super();

    this._state = {};
  }

  updateState = (update, justStateUpdating) => {
    if (!update) {
      return;
    }

    this._state = { ...this._state, ...update };

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  };

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  };

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: resetHandlers');
  };
}
