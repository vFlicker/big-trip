import AbstractView from './abstract';
import { getDuration, humanizeDate } from '../utils/date';

const createOfferListTemplate = (offers) => {
  const getTemplate = (offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  };

  return offers
    .map(getTemplate)
    .join('');
};

const createEventItemTemplate = (event) => {
  const {date, offers, isFavorite, type, destination, price} = event;

  const timeDuration = getDuration(date.start, date.end);

  const offerListTemplate = createOfferListTemplate(offers);

  const favoriteButtonClasses = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${humanizeDate(date.start, 'YYYY-MM-DD')}">${humanizeDate(date.start, 'MMM D')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${humanizeDate(date.start, 'YYYY-MM-DD')}T${humanizeDate(date.start, 'HH:mm')}">
              ${humanizeDate(date.start, 'HH:mm')}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${humanizeDate(date.end, 'YYYY-MM-DD')}T${humanizeDate(date.end, 'HH:mm')}">
              ${humanizeDate(date.end, 'HH:mm')}
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

export default class EventItem extends AbstractView {
  constructor(event) {
    super();

    this._event = event;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createEventItemTemplate(this._event);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;

    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._rollupClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this
      .getElement()
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this._favoriteClickHandler);
  }
}
