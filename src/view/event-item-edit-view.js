import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import { nanoid } from 'nanoid';

import { DateTimeFormats } from '../const';
import { DataStore } from '../dataStorage';
import { AbstractStatefulView } from '../framework';
import {
  cloneArrayOfObjects,
  compareDates,
  humanizeDate,
  ucFirst
} from '../utils';


import 'flatpickr/dist/flatpickr.min.css';

const DATEPICKER_BASIC_SETTINGS = {
  enableTime: true,
  time_24hr: true,
  dateFormat: 'm/d/y H:i',
};

const DEFAULT_EVENT = {
  dateStart: dayjs().startOf('day').toDate(),
  dateEnd: dayjs().startOf('day').toDate(),
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  isFavorite: false,
  price: 0,
  type: 'taxi',
  offers: [],
};

export const ResetButtonText = {
  ADD: 'Cancel',
  EDIT: 'Delete',
};

// TODO: look at the naming of createFunctionsTemplate and them argument names
const createEventTypeListTemplate = (id, activeType, availableOffers) => {
  const getTemplate = (type) => {
    const typeCheckStatus = type === activeType ? 'checked' : '';

    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-${id}"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${type}"
            ${typeCheckStatus}
          >
        <label class="event__type-label  event__type-label--${type}"
            for="event-type-${type}-${id}">${ucFirst(type)}
        </label>
      </div>`
    );
  };

  return availableOffers
    .map((offer) => getTemplate(offer.type))
    .join('');
};

const createEventDestinationListTemplate = (availableDestination) => {
  const getTemplate = ({name}) => (
    `<option value="${name}"></option>`
  );

  return Object
    .values(availableDestination)
    .map(getTemplate)
    .join('');
};

const createEventOfferListTemplate = (type, offers) => {
  const getTemplate = (type, offer) => {
    const { id, isChecked, price, title } = offer;

    const offerCheckStatus = isChecked ? 'checked' : '';

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
          id="event-offer-${type}-${id}"
          type="checkbox"
          name="event-offer-${type}"
          data-event-offer-id="${id}"
          ${offerCheckStatus}>
        <label class="event__offer-label" for="event-offer-${type}-${id}">
          <span class="event__offer-title">Add ${title}</span>
          +€&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  };

  return offers
    .map((offer) => getTemplate(type, offer))
    .join('');
};

const createSectionOffersTemplate = (hasSectionOffers, type, offers) => {
  if (!hasSectionOffers) {
    return '';
  }

  const eventOfferListTemplate = createEventOfferListTemplate(type, offers);

  return (
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${eventOfferListTemplate}
        </div>
      </section>`
  );
};

const createEventPhotoListTemplate = (pictures) => {
  const getTemplate = ({ src, description }) => (
    `<img class="event__photo" src="${src}" alt="${description}">`
  );

  return pictures
    .map(getTemplate)
    .join('');
};

const createContainerPhotosTemplate = (hasDestinationPictures, pictures) => {
  if (!hasDestinationPictures) {
    return;
  }

  const eventPhotoListTemplate = createEventPhotoListTemplate(pictures);

  return (
    `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventPhotoListTemplate}
        </div>
      </div>`
  );
};

const createSectionDestinationTemplate = (
  hasSectionDestination,
  destination,
  hasDestinationDescription,
  hasDestinationPictures,
) => {
  if (!hasSectionDestination) {
    return '';
  }

  const { pictures, description } = destination;

  const descriptionTemplate = hasDestinationDescription
    ? `<p class="event__destination-description">${description}</p>`
    : '';

  const containerPhotosTemplate = createContainerPhotosTemplate(hasDestinationPictures, pictures);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${descriptionTemplate}
      ${containerPhotosTemplate}
    </section>`
  );
};

const createSectionDetailsTemplate = (
  hasDetails,
  hasSectionOffers,
  type,
  offers,
  hasSectionDestination,
  destination,
  hasDestinationDescription,
  hasDestinationPictures,
) => {
  if (!hasDetails) {
    return '';
  }

  const sectionOffersTemplate = createSectionOffersTemplate(
    hasSectionOffers,
    type,
    offers
  );

  const sectionDestinationTemplate = createSectionDestinationTemplate(
    hasSectionDestination,
    destination,
    hasDestinationDescription,
    hasDestinationPictures,
  );

  return (
    `<section class="event__details">
      ${sectionOffersTemplate}
      ${sectionDestinationTemplate}
    </section>`
  );
};

const createRollupButtonTemplate = (isNewEvent) => {
  if (!isNewEvent) {
    return (
      `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    );
  }

  return '';
};

const createEventItemEditTemplate = (
  state,
  availableDestination,
  availableOffers
) => {
  const {
    dateEnd,
    dateStart,
    destination,
    hasDestinationDescription,
    hasDestinationName,
    hasDestinationPictures,
    hasDetails,
    hasSectionDestination,
    hasSectionOffers,
    id,
    isDeleting,
    isDisabled,
    isSaving,
    isNewEvent,
    isSubmitDisabled,
    offers,
    price,
    type,
  } = state;

  const eventTypeListTemplate = createEventTypeListTemplate(
    type,
    id,
    availableOffers
  );

  const eventDestinationListTemplate = createEventDestinationListTemplate(
    availableDestination
  );

  const sectionDetailsTemplate = createSectionDetailsTemplate(
    hasDetails,
    hasSectionOffers,
    type,
    offers,
    hasSectionDestination,
    destination,
    hasDestinationDescription,
    hasDestinationPictures,
  );

  const rollupButtonTemplate = createRollupButtonTemplate(isNewEvent);

  const destinationValue = hasDestinationName ? destination.name : '';
  const destinationDisableStatus = isDisabled ? 'disabled' : '';
  const typeDisableStatus = isDisabled ? 'disabled' : '';
  const timeDisableStatus = isDisabled ? 'disabled' : '';
  const priceDisableStatus = isDisabled ? 'disabled' : '';
  const submitButtonDisableStatus = isDisabled || isSubmitDisabled ? 'disabled' : '';
  const submitButtonText = isSaving ? 'Saving...' : 'Save';
  const newEventOrEditEvent = isNewEvent ? ResetButtonText.ADD : ResetButtonText.EDIT;
  const resetButtonDisableStatus = isDisabled ? 'disabled' : '';
  const resetButtonText = isDeleting ? 'Deleting...' : newEventOrEditEvent;

  const humanizedDateStart = humanizeDate(dateStart, DateTimeFormats.FULL_DATE_AND_TIME);
  const humanizedDateEnd = humanizeDate(dateEnd, DateTimeFormats.FULL_DATE_AND_TIME);


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon"
                width="17"
                height="17"
                src="img/icons/${type}.png"
                alt="Event ${type} icon">
            </label>
            <input
              class="event__type-toggle  visually-hidden"
              id="event-type-toggle-${id}"
              type="checkbox"
              ${typeDisableStatus}
            />

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypeListTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${id}"
              type="text"
              name="event-destination"
              value="${destinationValue}"
              list="destination-list-${id}"
              ${destinationDisableStatus}
            />
            <datalist id="destination-list-${id}">
              ${eventDestinationListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-${id}"
              type="text"
              name="event-start-time"
              value="${humanizedDateStart}}"
              ${timeDisableStatus}
            >
            —
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${id}"
              type="text"
              name="event-end-time"
              value="${humanizedDateEnd}}"
              ${timeDisableStatus}
            />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-${id}"
              type="text"
              name="event-price"
              value="${price}"
              ${priceDisableStatus}
            />
          </div>

          <button
            class="event__save-btn  btn  btn--blue"
            type="submit"
            ${submitButtonDisableStatus}
          >
            ${submitButtonText}
          </button>
          <button
            class="event__reset-btn"
            type="reset"
            ${resetButtonDisableStatus}
          >
            ${resetButtonText}
          </button>
          ${rollupButtonTemplate}
        </header>

        ${sectionDetailsTemplate}
      </form>
    </li>`
  );
};

export class EventItemEditView extends AbstractStatefulView {
  #availableDestination = DataStore.getDestinations;
  #availableOffers = DataStore.getOffers;
  #startDatePicker = null;
  #endDatePicker = null;

  constructor(event = DEFAULT_EVENT) {
    super();

    this._state = EventItemEditView.parseEventToState(event, DataStore.getOffers);

    this.#setInnerHandlers();
    this.#setStartDatePicker();
    this.#setEndDatePicker();
  }

  get template() {
    return createEventItemEditTemplate(
      this._state,
      this.#availableDestination,
      this.#availableOffers
    );
  }

  removeElement = () => {
    super.removeElement();

    this.#removeStartDatePicker();
    this.#removeEndDatePicker();
  };

  reset = (event) => {
    this.updateState(EventItemEditView.parseEventToState(
      event,
      this.#availableOffers
    ));
  };

  setSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;

    this
      .element
      .querySelector('form')
      .addEventListener('submit', this.#submitHandler);
  };

  setRollupClickHandler = (callback) => {
    const rollupElement = this.element.querySelector('.event__rollup-btn');

    if (rollupElement) {
      this._callback.rollupClick = callback;

      rollupElement.addEventListener('click', this.#rollupClickHandler);
    }
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;

    this
      .element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
  };

  _restoreHandlers = () => {
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setSubmitHandler(this._callback.formSubmit);
    this.setRollupClickHandler(this._callback.rollupClick);
    this.#setStartDatePicker();
    this.#setEndDatePicker();
    this.#setInnerHandlers();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventItemEditView.parseStateToEvent(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EventItemEditView.parseStateToEvent(this._state));
  };

  #setStartDatePicker = () => {
    this.#removeStartDatePicker();

    this.#startDatePicker = flatpickr(
      this.element.querySelector('.event__field-group--time input[name=event-start-time]'),
      {
        ...DATEPICKER_BASIC_SETTINGS,
        minDate: Date.now(),
        defaultDate: this._state.dateStart,
        onClose: this.#startDateChangeHandler,
      },
    );
  };

  #setEndDatePicker = () => {
    const isDateStartOver = compareDates(this._state.dateStart, this._state.dateEnd);

    this.#removeEndDatePicker();

    this.#endDatePicker = flatpickr(
      this.element.querySelector('.event__field-group--time input[name=event-end-time]'),
      {
        ...DATEPICKER_BASIC_SETTINGS,
        minDate: this._state.dateStart,
        defaultDate: isDateStartOver ? this._state.dateStart : this._state.dateEnd,
        onClose: this.#endDateChangeHandler,
      },
    );
  };

  #removeStartDatePicker = () => {
    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }
  };

  #removeEndDatePicker = () => {
    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateState({
      dateStart: userDate,
      dateEnd: userDate,
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateState({
      dateEnd: userDate,
    });
  };

  #setInnerHandlers = () => {
    this
      .element
      .querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationInputHandler);

    if (this._state.hasSectionOffers) {
      this
        .element
        .querySelector('.event__available-offers')
        .addEventListener('change', this.#offerChangeHandler);
    }

    this
      .element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this
      .element
      .querySelector('.event__type-list')
      .addEventListener('change', this.#typeChangeHandler);
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#availableDestination
      .find(({ name }) => name === evt.target.value);

    if (!destination) {
      evt.target.setCustomValidity('The destination is unavailable');
      evt.target.reportValidity();
      return;
    }

    const hasDestinationName = destination.name !== 0;
    const hasDestinationDescription = destination.description.length !== 0;
    const hasDestinationPictures = destination.pictures.length !== 0;
    const hasSectionDestination = hasDestinationDescription || hasDestinationPictures;

    this.updateState({
      destination,
      hasDestinationDescription,
      hasDestinationName,
      hasDestinationPictures,
      hasSectionDestination,
      hasDetails: this._state.hasSectionOffers || hasSectionDestination,
      isSubmitDisabled: !hasDestinationName,
    });
  };

  #offerChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    const currentOfferId = evt.target.dataset.eventOfferId;

    const offers = cloneArrayOfObjects(this._state.offers);

    for (const offer of offers) {
      if (offer.id === currentOfferId) {
        offer.isChecked = !offer.isChecked;
        break;
      }
    }

    this._setState({ offers });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const price = Number(evt.target.value);

    if (Number.isNaN(price) || price < 0) {
      evt.target.setCustomValidity('Invalid price value');
      evt.target.reportValidity();
      return;
    }

    evt.target.setCustomValidity('');

    this._setState({ price });
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    const eventType = evt.target.value;
    const offers = EventItemEditView.getOfferWithStatus(eventType, [], this.#availableOffers);

    const hasSectionOffers = !offers.length;

    this.updateState({
      offers,
      hasSectionOffers,
      type: eventType,
      hasDetails: hasSectionOffers || this._state.hasSectionDestination,
    });
  };

  static parseEventToState(event, availableOffers) {
    const availableOffersWithType = availableOffers.find((item) => item.type === event.type);
    const availableOffersByType = availableOffersWithType.offers;

    const hasDestinationDescription = event.destination.description.length;
    const hasDestinationName = event.destination.name.length;
    const hasDestinationPictures = event.destination.pictures.length;
    const hasSectionDestination = hasDestinationDescription || hasDestinationPictures;
    const hasSectionOffers = availableOffersByType.length;

    return {
      ...event,
      hasDestinationDescription,
      hasDestinationName,
      hasDestinationPictures,
      hasSectionDestination,
      hasSectionOffers,
      hasDetails: hasSectionOffers || hasSectionDestination,
      isDeleting: false,
      isDisabled: false,
      isSaving: false,
      isNewEvent: event === DEFAULT_EVENT,
      isSubmitDisabled: !hasDestinationName,
      offers: EventItemEditView.getOfferWithStatus(event.type, event.offers, availableOffers),
    };
  }

  // TODO: what is this?
  static getOfferWithStatus(userType, userOffers, availableOffers) {
    const availableOffersWithType = availableOffers.find(({ type }) => type === userType);
    const availableOffersByType = availableOffersWithType.offers;

    return availableOffersByType.reduce((resultArray, availableOfferByType) => {
      const hasOffer = userOffers.find(({ title }) => title === availableOfferByType.title);

      resultArray.push({
        ...availableOfferByType,
        // TODO: do we need nanoid?
        id: nanoid(),
        isChecked: Boolean(hasOffer),
      });

      return resultArray;
    }, []);
  }

  static parseStateToEvent(state) {
    state = { ...state };

    state.offers = state.offers.filter((offer) => {
      if (offer.isChecked) {
        delete offer.isChecked;
        delete offer.id;

        return offer;
      }
    });

    delete state.hasDestinationDescription;
    delete state.hasDestinationName;
    delete state.hasDestinationPictures;
    delete state.hasSectionDestination;
    delete state.hasSectionOffers;
    delete state.hasDetails;
    delete state.isDeleting;
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isNewEvent;
    delete state.isSubmitDisabled;

    return state;
  }

}
