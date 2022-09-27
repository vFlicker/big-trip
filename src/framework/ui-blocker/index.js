import './styles.css';

/**
 * Class for interface blocking
 */
export class UiBlocker {
  /**
   * @type {number} time before interface lock in milliseconds
   */
  #lowerLimit;

  /**
   *  @type {number} minimum interface blocking time in milliseconds
   */
  #upperLimit;

  /**
   * @type {HTMLElement|null} interface blocking element
   */
  #element;

  /**
   *  @type {number} block method call time
   */
  #startTime;

  /**
   * @type {number} unblock method call time
   */
  #endTime;

  /**
   *  @type {number} timer ID
   */
  #timerId;

  /**
   * @param {Object} config object with blocker settings
   * @param {number} config.lowerLimit time to block the interface in milliseconds. If you call the unblock method earlier, then the interface will not be blocked
   * @param {number} config.upperLimit minimum block time in milliseconds. Minimum block duration
   */
  constructor(lowerLimit, upperLimit) {
    this.#lowerLimit = lowerLimit;
    this.#upperLimit = upperLimit;

    this.#element = document.createElement('div');
    this.#element.classList.add('ui-blocker');
    document.body.append(this.#element);
  }

  /** Method for blocking the interface */
  block = () => {
    this.#startTime = Date.now();
    this.#timerId = setTimeout(() => {
      this.#addClass();
    }, this.#lowerLimit);
  };

  /** Method to unlock interface */
  unblock = () => {
    this.#endTime = Date.now();
    const duration = this.#endTime - this.#startTime;

    if (duration < this.#lowerLimit) {
      clearTimeout(this.#timerId);
      return;
    }

    if (duration >= this.#upperLimit) {
      this.#removeClass();
      return;
    }

    setTimeout(this.#removeClass, this.#upperLimit - duration);
  };

  /** Method that adds a CSS class to an element */
  #addClass = () => {
    this.#element.classList.add('ui-blocker--on');
  };

  /** A method that removes a CSS class from an element*/
  #removeClass = () => {
    this.#element.classList.remove('ui-blocker--on');
  };
}
