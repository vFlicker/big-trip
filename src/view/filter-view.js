import AbstractView from './abstract-view';

const createFilterItems = (filters) => {
  const getTemplate = (filters) => {
    const {type, name, isChecked, isDisabled} = filters;

    return (
      `<div class="trip-filters__filter">
        <input
          id="filter-${type}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${type}"
          ${isChecked ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}
          data-filter-type="${type}">
        <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
      </div>`
    );
  };


  return filters
    .map(getTemplate)
    .join('');
};

const createFilterTemplate = (filters) => {
  const filterItems = createFilterItems(filters);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItems}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  constructor(filters) {
    super();

    this._filters = filters;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;

    this
      .getElement()
      .addEventListener('change', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
