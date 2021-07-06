import TripInfoView from '../view/trip-info';
import {sortByDate} from '../utils/common';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {getEventPeriod, getTotalPrice, getTitle} from '../utils/trip-info';

export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoView(this._getInfo());

    if (prevFilterComponent === null) {
      render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getInfo() {
    const sortedEvents = this._eventsModel.getEvents().sort(sortByDate);

    return {
      date: getEventPeriod(sortedEvents),
      price: getTotalPrice(sortedEvents),
      title: getTitle(sortedEvents),
    };
  }
}
