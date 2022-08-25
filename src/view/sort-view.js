import {SortType} from '../const';
import { ucFirst } from '../utils';
import AbstractView from './abstract-view';

const createSortItem = (name, sortType, currentSortType, isDisabled = false) => {
  const isChecked = sortType === currentSortType;

  return (
    `<div class="trip-sort__item  trip-sort__item--${name}">
      <input
        id="sort-${name}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${name}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
        data-sort-type="${sortType}"
      >
      <label class="trip-sort__btn" for="sort-${name}">${ucFirst(name)}</label>
    </div>`
  );
};

const createSortTemplate = (currentSortType) => {
  const sortItemDay = createSortItem('day', SortType.DAY, currentSortType);
  const sortItemEvent = createSortItem('event', SortType.EVENT, currentSortType, true);
  const sortItemTime = createSortItem('time', SortType.TIME, currentSortType);
  const sortItemPrice = createSortItem('price', SortType.PRICE, currentSortType);
  const sortItemOffer = createSortItem('offer', SortType.OFFER, currentSortType, true);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemDay}
      ${sortItemEvent}
      ${sortItemTime}
      ${sortItemPrice}
      ${sortItemOffer}
    </form>`
  );
};

export default class SortView extends AbstractView {
  constructor(sortType) {
    super();

    this._sortType = sortType;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }

  setTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
