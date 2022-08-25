import { Observer } from '../utils';
import {FilterType} from '../const';

export default class Filter extends Observer {
  constructor() {
    super();

    this._activeFilter = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;

    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
