import { FilterType } from '../const';

export class FilterModel extends EventTarget {
  #activeFilter = FilterType.EVERYTHING;

  get filter() {
    return this.#activeFilter;
  }

  setFilter(updateType, filter) {
    this.#activeFilter = filter;

    this.dispatchEvent(
      new CustomEvent('update', { detail: { updateType, filter } })
    );
  }
}
