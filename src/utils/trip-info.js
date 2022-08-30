import { DateTimeFormats } from '../const';
import { humanizeDate } from './common';

export const getEventPeriod = (events) => {
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

export const getTotalPrice = (events) => events.reduce((sum, event) => {
  const offersTotalPrice = event.offers.reduce((offersReducer, { price }) => {
    const result = offersReducer + price;
    return result;
  }, 0);

  return sum + event.price + offersTotalPrice;
}, 0);

export const getTitle = (events) => {
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
