import AbstractView from './abstract';

const creatTripInfoTemplate = ({date, price, title}) => {
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
  constructor(info) {
    super();

    this._info = info;
  }

  getTemplate() {
    return creatTripInfoTemplate(this._info);
  }
}
