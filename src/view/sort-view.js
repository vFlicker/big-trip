import {SortType} from '../const';
import { ucFirst } from '../utils';
import AbstractView from './abstract-view';

const createSortItem = (sortType, currentSortType, isDisabled = false) => {
  const isChecked = sortType === currentSortType;

  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input
        id="sort-${sortType}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortType}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
        data-sort-type="${sortType}"
      >
      <label class="trip-sort__btn" for="sort-${sortType}">${ucFirst(sortType)}</label>
    </div>`
  );
};

const createSortTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${createSortItem(SortType.DAY, currentSortType)}
      ${createSortItem(SortType.EVENT, currentSortType, true)}
      ${createSortItem(SortType.TIME, currentSortType)}
      ${createSortItem(SortType.PRICE, currentSortType)}
      ${createSortItem(SortType.OFFER, currentSortType, true)}
    </form>`
);

export default class SortView extends AbstractView {
  constructor(sortType) {
    super();

    this._sortType = sortType;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  get template() {
    return createSortTemplate(this._sortType);
  }

  setTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
