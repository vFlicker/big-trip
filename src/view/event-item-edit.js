import AbstractView from './abstract';
import { humanizeDate } from '../utils/date';
import { ucFirst } from '../utils/common';

const createEventTypeListTemplate = (activeType, availableTypes) => {
  const getTemplate = (type) => {
    const typeInputStatus = type === activeType
      ? 'checked'
      : '';

    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-1"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${type}" ${typeInputStatus}
          >
        <label class="event__type-label  event__type-label--${type}"
            for="event-type-${type}-1">${ucFirst(type)}
        </label>
      </div>`
    );
  };

  return availableTypes
    .map(getTemplate)
    .join('');
};

const createEventDestinationListTemplate = (availableDestination) => {
  const getTemplate = ({name}) => {
    return (
      `<option value="${name}"></option>`
    );
  };

  return Object
    .values(availableDestination)
    .map(getTemplate)
    .join('');
};

const createEventOfferListTemplate = (type, offers) => {
  const getTemplate = (offer) => {
    const offerCheckboxStatus = offer.isChecked
      ? 'checked'
      : '';

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
          id="event-offer-${type}-${offer.id}"
          type="checkbox"
          name="event-offer-${type}" ${offerCheckboxStatus}
          data-event-offer-id="${offer.id}">
        <label class="event__offer-label" for="event-offer-${type}-${offer.id}">
          <span class="event__offer-title">Add ${offer.title}</span>
          +€&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  };

  return offers
    .map(getTemplate)
    .join('');
};

const createSectionOffersTemplate = (type, offers, hasOffers) => {
  const eventOfferListTemplate = createEventOfferListTemplate(type, offers, hasOffers);

  if (hasOffers) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${eventOfferListTemplate}
        </div>
      </section>`
    );
  }

  return '';
};

const createEventPhotoListTemplate = (photos) => {
  const getTemplate = (photo) => {
    return (
      `<img class="event__photo" src="${photo}" alt="Event photo">`
    );
  };

  return photos
    .map(getTemplate)
    .join('');
};

const createSectionDestinationTemplate = (destination) => {
  const eventPhotoListTemplate = createEventPhotoListTemplate(destination.photos);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventPhotoListTemplate}
        </div>
      </div>
    </section>`
  );
};

const createEventItemEditTemplate = (data, availableDestination, availableTypes) => {
  const {destination, type, dateStart, dateEnd, price, offers, hasOffers} = data;

  const eventTypeListTemplate = createEventTypeListTemplate(type, availableTypes);

  const eventDestinationListTemplate = createEventDestinationListTemplate(availableDestination);

  const sectionOffersTemplate = createSectionOffersTemplate(type, offers, hasOffers);

  const sectionDestinationTemplate = createSectionDestinationTemplate(destination);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon"
                width="17"
                height="17"
                src="img/icons/${type}.png"
                alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypeListTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination"
                id="event-destination-1"
                type="text"
                name="event-destination"
                value="${destination.name}"
                list="destination-list-1">
            <datalist id="destination-list-1">
              ${eventDestinationListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${humanizeDate(dateStart, 'YY/MM/DD HH:mm')}"
             >
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${humanizeDate(dateEnd, 'YY/MM/DD HH:mm')}"
             >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${sectionOffersTemplate}
          ${sectionDestinationTemplate}
        </section>
      </form>
    </li>`
  );
};

export default class EventItemEdit extends AbstractView {
  constructor(event, availableDestination, availableTypes, availableOffers) {
    super();

    this._event = event;
    this._availableDestination = availableDestination;
    this._availableTypes = availableTypes;
    this._availableOffers = availableOffers;
    this._data = EventItemEdit.parseEventToData(event);

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEventItemEditTemplate(this._data, this._availableDestination, this._availableTypes, this._availableOffers);
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    this.updateElement();
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    const eventType = evt.target.value;

    this.updateData({
      type: eventType,
      offers: this._availableOffers[eventType],
      hasOffers: this._availableOffers[eventType].length > 0,
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const destination = this._availableDestination.find((item) => item.name === evt.target.value);

    if (!destination) {
      evt.target.setCustomValidity('The destination is unavailable');
      evt.target.reportValidity();
      return;
    }

    this.updateData({
      destination,
    });
  }

  _offerChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    const currentOfferId = Number(evt.target.dataset.eventOfferId);
    const offers = this._data.offers;

    for (const offer of offers) {
      if (offer.id === currentOfferId) {
        offer.isChecked = !offer.isChecked;
        break;
      }
    }

    this.updateData({
      offers,
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    const price = Number(evt.target.value);

    if (isNaN(price) || !price) {
      evt.target.setCustomValidity('Invalid price value');
      evt.target.reportValidity();
      return;
    }

    this.updateData({
      price,
    });
  }

  _setInnerHandlers() {
    this
      .getElement()
      .querySelector('.event__type-list')
      .addEventListener('change', this._typeChangeHandler);

    this
      .getElement()
      .querySelector('.event__input--destination')
      .addEventListener('input', this._destinationChangeHandler);

    if (this._data.hasOffers) {
      this
        .getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._offerChangeHandler);
    }

    this
      .getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceChangeHandler);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;

    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._rollupClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    this
      .getElement()
      .addEventListener('submit', this._formSubmitHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  static parseEventToData(event) {
    return Object.assign(
      {},
      event,
      {
        hasOffers: event.offers.length > 0,
      },
    );
  }
}
