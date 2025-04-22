import { DateTimeFormats } from '../const';
import { remove, render, RenderPosition, replace } from '../framework';
import { humanizeDate, sort } from '../utils';
import { TripInfoView } from '../view';

const getEventPeriod = (events) => {
  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];

  if (firstEvent && lastEvent) {
    const humanizeFirstFrom = humanizeDate(
      firstEvent.dateStart,
      DateTimeFormats.MONTH_AND_DAY
    );

    const humanizeFirstTo = humanizeDate(
      lastEvent.dateEnd,
      DateTimeFormats.MONTH_AND_DAY
    );

    return `${humanizeFirstFrom} &nbsp;&mdash;&nbsp; ${humanizeFirstTo}`;
  }

  return 'trip date';
};

const getTotalPrice = (events) => events.reduce((sum, event) => {
  const offersTotalPrice = event.offers.reduce((offersReducer, { price }) => {
    const result = offersReducer + price;
    return result;
  }, 0);

  return sum + event.price + offersTotalPrice;
}, 0);

const getTitle = (events) => {
  const allCities = events.map((event) => event.destination.name);

  const filteredCities = allCities.reduce((array, city, index) => {
    if (city === allCities[index + 1]) {
      return array;
    }

    array.push(city);
    return array;
  }, []);

  if (filteredCities.length > 3) {
    const firstCity = filteredCities[0];
    const lastCity = filteredCities[filteredCities.length - 1];

    return `${firstCity} &mdash; ... &mdash; ${lastCity}`;
  }

  return filteredCities.join(' &mdash; ');
};

export class TripInfoPresenter {
  #tripInfoContainer = null;
  #eventsModel = null;
  #tripInfoComponent = null;

  constructor(tripInfoContainer, eventsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;

    this.#eventsModel.subscribe(this);
  }

  init = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView(this.#getInfo());

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  update = () => {
    this.init();
  };

  #getInfo = () => {
    const sortedEvents = this.#eventsModel.events.sort(sort.byDate);

    return {
      date: getEventPeriod(sortedEvents),
      price: getTotalPrice(sortedEvents),
      title: getTitle(sortedEvents),
    };
  };
}
