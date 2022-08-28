import { FilterType } from '../const';
import { Observer } from '../utils';

export default class FilterModel extends Observer {
  #activeFilter = FilterType.EVERYTHING;

  setFilter = (updateType, filter) => {
    this.#activeFilter = filter;

    this._notify(updateType, filter);
  };

  getFilter = () => this.#activeFilter;
}
