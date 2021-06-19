import AbstractView from './abstract';
import { humanizeDate, compareDates } from '../utils/date';
import { ucFirst, cloneArrayOfObjects } from '../utils/common';
import { DATEPICKER_BASIC_SETTINGS } from '../utils/const';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

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

const createSectionOffersTemplate = (hasOffers, type, offers) => {
  if (hasOffers) {
    const eventOfferListTemplate = createEventOfferListTemplate(type, offers);

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

const createContainerPhotosTemplate = (hasPhotos, photos) => {
  if (hasPhotos) {
    const eventPhotoListTemplate = createEventPhotoListTemplate(photos);

    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventPhotoListTemplate}
        </div>
      </div>`
    );
  }

  return '';
};

const createSectionDestinationTemplate = (hasDestination, destination, hasDescription, hasPhotos) => {
  if (hasDestination) {
    const {photos, description} = destination;

    const descriptionTemplate = hasDescription
      ? `<p class="event__destination-description">${description}</p>`
      : '';

    const containerPhotosTemplate = createContainerPhotosTemplate(hasPhotos, photos);

    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${descriptionTemplate}
        ${containerPhotosTemplate}
      </section>`
    );
  }

  return '';
};

const createSectionDetailsTemplate = (hasDetails, hasOffers, type, offers, hasDestination, destination, hasDescription, hasPhotos) => {
  if (hasDetails) {
    const sectionOffersTemplate = createSectionOffersTemplate(hasOffers, type, offers);

    const sectionDestinationTemplate = createSectionDestinationTemplate(hasDestination, destination, hasDescription, hasPhotos);

    return (
      `<section class="event__details">
        ${sectionOffersTemplate}
        ${sectionDestinationTemplate}
      </section>`
    );
  }

  return '';
};

const createEventItemEditTemplate = (state, availableTypes, availableDestination) => {
  const {destination, type, dateStart, dateEnd, price, offers, hasOffers, hasDescription, hasPhotos, hasDestination, hasDetails} = state;

  const eventTypeListTemplate = createEventTypeListTemplate(type, availableTypes);

  const eventDestinationListTemplate = createEventDestinationListTemplate(availableDestination);

  const sectionDetailsTemplate = createSectionDetailsTemplate(hasDetails, hasOffers, type, offers, hasDestination, destination, hasDescription, hasPhotos);

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
              value="${humanizeDate(dateStart, 'MM/DD/YY HH:mm')}"
             >
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${humanizeDate(dateEnd, 'MM/DD/YY HH:mm')}"
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

        ${sectionDetailsTemplate}
      </form>
    </li>`
  );
};

export default class EventItemEdit extends AbstractView {
  constructor(event, availableDestination, availableTypes, availableOffers) {
    super();

    this._state = EventItemEdit.parseEventToState(event);
    this._availableDestination = availableDestination;
    this._availableTypes = availableTypes;
    this._availableOffers = availableOffers;
    this._startDatePicker = null;
    this._endDatePicker = null;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatePicker();
    this._setEndDatePicker();
  }

  getTemplate() {
    return createEventItemEditTemplate(this._state, this._availableTypes, this._availableDestination);
  }

  removeElement() {
    super.removeElement();

    this._removeStartDatePicker();
    this._removeEndDatePicker();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateState(update, justStateUpdating) {
    if (!update) {
      return;
    }

    this._state = Object.assign(
      {},
      this._state,
      update,
    );

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    const eventType = evt.target.value;
    const hasOffers = this._availableOffers[eventType].length !== 0;

    this.updateState({
      type: eventType,
      offers: this._availableOffers[eventType],
      hasOffers,
      hasDetails: hasOffers || this._state.hasDestination,
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const destination = this._availableDestination
      .find((destination) => destination.name === evt.target.value);

    if (!destination) {
      evt.target.setCustomValidity('The destination is unavailable');
      evt.target.reportValidity();
      return;
    }

    const hasDescription = destination.description.length !== 0;
    const hasPhotos = destination.photos.length !== 0;
    const hasDestination = hasDescription || hasPhotos;

    this.updateState({
      destination,
      hasDescription,
      hasPhotos,
      hasDestination,
      hasDetails: this._state.hasOffers || hasDestination,
    });
  }

  _offerChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    const currentOfferId = Number(evt.target.dataset.eventOfferId);

    const offers = cloneArrayOfObjects(this._state.offers);

    for (const offer of offers) {
      if (offer.id === currentOfferId) {
        offer.isChecked = !offer.isChecked;
        break;
      }
    }

    this.updateState({
      offers,
    }, true);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    const price = Number(evt.target.value);

    if (isNaN(price) || !price) {
      evt.target.setCustomValidity('Invalid price value');
      evt.target.reportValidity();
      return;
    }

    this.updateState({
      price,
    }, true);
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

    if (this._state.hasOffers) {
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

  _removeStartDatePicker() {
    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }
  }

  _removeEndDatePicker() {
    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
  }

  _startDateChangeHandler([userDate]) {
    this.updateState({
      dateStart: userDate,
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateState({
      dateEnd: userDate,
    });
  }

  _setStartDatePicker() {
    this._removeStartDatePicker();

    this._startDatePicker = flatpickr(
      this
        .getElement()
        .querySelector('.event__field-group--time input[name=event-start-time]'),

      Object.assign(
        {},
        DATEPICKER_BASIC_SETTINGS,
        {
          minDate: Date.now(),
          defaultDate: this._state.dateStart,
          onClose: this._startDateChangeHandler,
        },
      ),
    );
  }

  _setEndDatePicker() {
    const isDateStartOver = compareDates(this._state.dateStart, this._state.dateEnd);

    this._removeEndDatePicker();

    this._endDatePicker = flatpickr(
      this
        .getElement()
        .querySelector('.event__field-group--time input[name=event-end-time]'),

      Object.assign(
        {},
        DATEPICKER_BASIC_SETTINGS,
        {
          minDate: this._state.dateStart,
          defaultDate: isDateStartOver ? this._state.dateStart : this._state.dateEnd,
          onClose: this._endDateChangeHandler,
        },
      ),
    );
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventItemEdit.parseStateToEvent(this._state));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventItemEdit.parseStateToEvent(this._state));
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

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;

    this
      .getElement()
      .querySelector('.event__reset-btn')
      .addEventListener('click', this._formDeleteClickHandler);
  }

  reset(event) {
    this.updateState(EventItemEdit.parseStateToEvent(event));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatePicker();
    this._setEndDatePicker();
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  static parseEventToState(event) {
    const hasOffers = event.offers.length !== 0;
    const hasDescription = event.destination.description.length !== 0;
    const hasPhotos = event.destination.photos.length !== 0;
    const hasDestination = hasDescription || hasPhotos;

    return Object.assign(
      {},
      event,
      {
        hasOffers,
        hasDescription,
        hasPhotos,
        hasDestination,
        hasDetails: hasOffers || hasDestination,
      },
    );
  }

  static parseStateToEvent(state) {
    state = Object.assign({}, state);

    if (!state.hasOffers) {
      state.hasOffers = null;
    }

    if (!state.hasDescription) {
      state.hasDescription = null;
    }

    if (!state.hasPhotos) {
      state.hasPhotos = null;
    }

    if (!state.hasDestination) {
      state.hasDestination = null;
    }

    if (!state.hasDetails) {
      state.hasDetails = null;
    }

    delete state.hasOffers;
    delete state.hasDescription;
    delete state.hasPhotos;
    delete state.hasDestination;
    delete state.hasDetails;

    return state;
  }
}
