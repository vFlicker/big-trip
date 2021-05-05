import { humanizeDate } from '../utils/date';

const createEventTypeListTemplate = (availableTypes, activeType) => {
  const getTemplate = ([typeName, typeText]) => {
    const typeInputStatus = typeName === activeType
      ? 'checked'
      : '';

    return (
      `<div class="event__type-item">
        <input id="event-type-${typeName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeName}" ${typeInputStatus}>
        <label class="event__type-label  event__type-label--${typeName}" for="event-type-${typeName}-1">${typeText}</label>
      </div>`
    );
  };

  return Object
    .entries(availableTypes)
    .map(getTemplate)
    .join('');
};

const createEventDestinationListTemplate = (destantionName) => {
  return (
    `<option value="${destantionName}"></option>`
  );
};

const createEventOfferListTemplate = (offer) => {
  const offerCheckboxStatus = offer.isChecked
    ? 'checked'
    : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-${offer.id}" type="checkbox" name="event-offer-${offer.type}" ${offerCheckboxStatus}>
      <label class="event__offer-label" for="event-offer-${offer.type}-${offer.id}">
        <span class="event__offer-title">Add ${offer.title}</span>
        +€&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createSectionOffersTemplate = (offers) => {
  const eventOfferListTemplate = offers
    .map(createEventOfferListTemplate)
    .join('');

  if (offers.length > 0) {
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

const createEventPhotoListTemplate = (photo) => {
  return (
    `<img class="event__photo" src="${photo}" alt="Event photo">`
  );
};

const createSectionDestinationTemplate = (destantion) => {
  const eventPhotoListTemplate = destantion.photos
    .map(createEventPhotoListTemplate)
    .join('');

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destantion.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventPhotoListTemplate}
        </div>
      </div>
    </section>`
  );
};

export const createEventItemEditTemplate = (event) => {
  const {availableDestantion, availableTypes, destantion, type, date, price, offers} = event;

  const eventTypeListTemplate = createEventTypeListTemplate(availableTypes, type);

  const eventDestinationListTemplate = availableDestantion
    .map(createEventDestinationListTemplate)
    .join('');

  const sectionOffersTemplate = createSectionOffersTemplate(offers);

  const sectionDestinationTemplate = createSectionDestinationTemplate(destantion);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destantion.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${eventDestinationListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(date.start, 'YY/MM/DD HH:mm')}">
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(date.end, 'YY/MM/DD HH:mm')}">
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
