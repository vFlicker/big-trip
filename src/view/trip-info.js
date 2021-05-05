import AbstractView from './abstract';
import { getEventPeriod } from '../utils/date';

const getTitle = (events) => {
  if (events.length > 3) {
    return `${events[0].destantion.name} &mdash; ... &mdash; ${events[events.length - 1].destantion.name}`;
  }

  return events.map((event) => event.destantion.name).join(' &mdash; ');
};

const creatTripInfoTemplate = (events) => {
  const title = getTitle(events);
  const date = getEventPeriod(events[0], events[events.length - 1]);
  const price = events.reduce((sum, event) => sum + event.price, 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${date}</p>
      </div>

      <p class="trip-info__cost">
        Total: €&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return creatTripInfoTemplate(this._events);
  }
}
