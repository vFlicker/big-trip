import {DateTimeFormats} from '../const';
import {
  humanizeDate,
  humanizeDateTime,
  humanizeDurationBetweenDates,
} from '../utils';
import AbstractView from './abstract-view';

const createOfferListTemplate = (offers) => {
  const getTemplate = ({ title, price }) => (
    `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`
  );

  return offers
    .map(getTemplate)
    .join('');
};

const createEventItemTemplate = ({
  dateStart,
  dateEnd,
  offers,
  isFavorite,
  type,
  destination,
  price
}) => {
  const eventData = humanizeDate(dateStart, DateTimeFormats.MONTH_AND_DAY);
  const eventDataPlaceholder = humanizeDate(dateStart, DateTimeFormats.FULL_DATE);
  const eventStartTime = humanizeDate(dateStart, DateTimeFormats.TIME);
  const eventStartTimePlaceholder = humanizeDateTime(dateStart);
  const eventEndTime = humanizeDate(dateEnd, DateTimeFormats.TIME);
  const eventEndTimePlaceholder = humanizeDateTime(dateEnd);

  const timeDuration = humanizeDurationBetweenDates(dateStart, dateEnd);

  const offerListTemplate = createOfferListTemplate(offers);

  const favoriteButtonClasses = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${eventDataPlaceholder}">${eventData}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time
                class="event__start-time"
                datetime="${eventStartTimePlaceholder}">
              ${eventStartTime}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${eventEndTimePlaceholder}">
              ${eventEndTime}
            </time>
          </p>
          <p class="event__duration">${timeDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">${offerListTemplate}</ul>
        <button class="${favoriteButtonClasses}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class EventItemView extends AbstractView {
  constructor(event) {
    super();

    this._event = event;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  get template() {
    return createEventItemTemplate(this._event);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this
      .element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this._favoriteClickHandler);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;

    this
      .element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._rollupClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }
}
