import { UpdateType } from '../const';
import {
  filter,
  ucFirst,
} from '../utils';
import { FilterView } from '../view';
import { remove, render, replace } from '../framework';

export class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #eventsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, eventsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const filters = this.#getFilters();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters);
    this.#filterComponent.setTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #getFilters = () => {
    const events = this.#eventsModel.getEvents();
    const currentFilterType = this.#filterModel.getFilter();

    return Object
      .keys(filter)
      .map((type) => ({
        type,
        name: ucFirst(type),
        isChecked: currentFilterType === type,
        isDisabled: filter[type](events).length === 0,
      }));
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.getFilter() === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
