import { TripInfoView } from '../view';
import {
  getEventPeriod,
  getTitle,
  getTotalPrice,
  remove,
  render,
  RenderPosition,
  replace,
  sortByDate
} from '../utils';

export default class TripInfoPresenter {
  constructor(tripInfoContainer, eventsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoView(this._getInfo());

    if (prevTripInfoComponent === null) {
      render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
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
