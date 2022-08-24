import {humanizeDate} from './common';
import {DateTimeFormats} from '../const';

export const getEventPeriod = (events) => {
  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];

  if (firstEvent && lastEvent) {
    const humanizeFirstFrom = humanizeDate(firstEvent.dateStart, DateTimeFormats.MONTH_AND_DAY);
    const humanizeFirstTo = humanizeDate(lastEvent.dateEnd, DateTimeFormats.MONTH_AND_DAY);

    return (
      `${humanizeFirstFrom} &nbsp;&mdash;&nbsp; ${humanizeFirstTo}`
    );
  }

  return 'trip date';
};

export const getTotalPrice = (events) => events.reduce((sum, event) => {
  const offersPrice = event.offers.reduce((sum, offer) => sum += offer.price, 0);

  return sum + event.price + offersPrice;
}, 0);

export const getTitle = (events) => {
  const allCities = events.map((event) => event.destination.name);

  const filtredCities = allCities.reduce((array, city, index) => {
    if (city === allCities[index + 1]) {
      return array;
    }

    array.push(city);
    return array;
  }, []);

  if (filtredCities.length > 3) {
    const firstCity = filtredCities[0];
    const lastCity = filtredCities[filtredCities.length - 1];

    return `${firstCity} &mdash; ... &mdash; ${lastCity}`;
  }

  return filtredCities.join(' &mdash; ');
};
