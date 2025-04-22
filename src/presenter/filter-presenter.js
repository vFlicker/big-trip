import { filter, ucFirst } from '../utils';
import { FilterView } from '../view';
import { remove, render, replace } from '../framework';
import { UpdateType } from '../const';

export class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #eventsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, eventsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;

    this.#filterModel.on('update', this.update);
    this.#eventsModel.on('update', this.update);
  }

  get filters() {
    const events = this.#eventsModel.events;
    const currentFilterType = this.#filterModel.filter;
    return Object.keys(filter).map((type) => ({
      type,
      name: ucFirst(type),
      isChecked: currentFilterType === type,
      isDisabled: !filter[type](events).length,
    }));
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(this.filters);
    this.#filterComponent.setTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  update = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
