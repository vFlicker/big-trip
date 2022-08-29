import { UpdateType } from '../const';
import { FilterView } from '../view';
import {
  filter,
  remove,
  render,
  RenderPosition,
  replace,
  ucFirst,
} from '../utils';

export default class FilterPresenter {
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
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
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