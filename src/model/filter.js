import { FilterType } from '../const';
import { Observable } from '../framework';

export default class FilterModel extends Observable {
  #activeFilter = FilterType.EVERYTHING;

  setFilter = (updateType, filter) => {
    this.#activeFilter = filter;

    this._notify(updateType, filter);
  };

  getFilter = () => this.#activeFilter;
}
