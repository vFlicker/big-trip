import EventEmitter from 'events';
import { FilterType } from '../const';

export class FilterModel extends EventEmitter {
  #activeFilter = FilterType.EVERYTHING;

  get filter() {
    return this.#activeFilter;
  }

  setFilter(updateType, filter) {
    this.#activeFilter = filter;
    this.emit('update', updateType, filter);
  }
}
