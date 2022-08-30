import { createElement } from '../../render';

import './styles.css';

/**
 * @const {string} A class that implements the «head shake» effect
 */
const MILLISECONDS_PRE_SECOND = 1000;

/**
 * @const {number} Animation time in milliseconds
 */
const SHAKE_ANIMATION_TIMEOUT = 600;

/**
 * Abstract view class
 */
export class AbstractView {
  /**
   * @type {HTMLElement|null} view element
   */
  #element = null;

  /**
   * @type {Object} object with callbacks. Can be used to store event handlers
   */
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
  }

  /**
   * Getter to get an element
   * @returns {HTMLElement} view element
   */
  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  /**
   * Getter to get element markup
   * @abstract
   * @returns {string} marking up an element as a string
   */
  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  /**
   * Method to remove an element
   */
  removeElement() {
    this.#element = null;
  }

  /**
   * Method that implements the effect of «head shake»
   * @param {shakeCallback} [callback] function to be called after the animation completes
   */
  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_PRE_SECOND}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
