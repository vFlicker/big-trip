import { AbstractView } from './abstract-view';

/**
 * Abstract stateful view class
 */
export class AbstractStatefulView extends AbstractView {
  /**
   * @type {Object} state object
   */
  _state = {};

  /**
   * Method for updating the state and redrawing the element
   * @param {Object} update object with updated state part
   */
  updateState = (update) => {
    if (!update) {
      return;
    }

    this._setState(update);

    this.#rerenderElement();
  };

  /**
   * Method for updating state
   * @param {Object} update object with updated state part
   */
  _setState = (update) => {
    this._state = { ...this._state, ...update };
  };

  /**
   * Method for restoring handlers after element redraw
   * @abstract
   */
  _restoreHandlers = () => {
    throw new Error('Abstract method not implemented: resetHandlers');
  };

  /**
   * Method for redrawing an element
   */
  #rerenderElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  };
}
