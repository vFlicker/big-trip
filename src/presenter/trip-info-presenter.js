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
  #tripInfoContainer = null;
  #eventsModel = null;
  #tripInfoComponent = null;

  constructor(tripInfoContainer, eventsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView(this.#getInfo());

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #getInfo = () => {
    const sortedEvents = this.#eventsModel.getEvents().sort(sortByDate);

    return {
      date: getEventPeriod(sortedEvents),
      price: getTotalPrice(sortedEvents),
      title: getTitle(sortedEvents),
    };
  };
}