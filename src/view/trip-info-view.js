import { AbstractView } from '../framework';

const createTripInfoTemplate = ({ date, price, title }) => (
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

export class TripInfoView extends AbstractView {
  #info = null;

  constructor(info) {
    super();

    this.#info = info;
  }

  get template() {
    return createTripInfoTemplate(this.#info);
  }
}
