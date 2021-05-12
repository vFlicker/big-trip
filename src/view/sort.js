import AbstractView from './abstract';
import { SortType } from '../utils/const';
import { ucFirst } from '../utils/common';

const createSortItem = (name, sortType, isChecked = false) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${name}">
      <input
        id="sort-${name}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${name}"
        ${isChecked ? 'checked' : ''}
        data-sort-type="${sortType}"
      >
      <label class="trip-sort__btn" for="sort-${name}">${ucFirst(name)}</label>
    </div>`
  );
};

const createSortTemplate = () => {
  const sortItemDay = createSortItem('day', SortType.DAY, true);
  const sortItemEvent = createSortItem('event', SortType.EVENT);
  const sortItemTime = createSortItem('time', SortType.TIME);
  const sortItemPrice = createSortItem('price', SortType.PRICE);
  const sortItemOffer = createSortItem('offer', SortType.OFFER);

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

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
