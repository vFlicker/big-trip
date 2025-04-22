import { FilterType } from '../const';
import { Observable } from '../framework';

export class FilterModel extends Observable {
  #activeFilter = FilterType.EVERYTHING;

  get filter() {
    return this.#activeFilter;
  }

  setFilter(updateType, filter) {
    this.#activeFilter = filter;

    this.notify(updateType, filter);
  }
}
