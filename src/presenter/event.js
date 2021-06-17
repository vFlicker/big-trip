import EventItemView from '../view/event-item';
import EventItemEditView from '../view/event-item-edit';
import { render, RenderPosition, replace, remove } from '../utils/render';
import {UpdateType, UserAction} from '../utils/const';

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

export default class Event {
  constructor(eventListContainer, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventItemComponent = null;
    this._eventItemEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleItemRollupClick = this._handleItemRollupClick.bind(this);
    this._handleItemFavoriteClick = this._handleItemFavoriteClick.bind(this);
    this._handleItemEditRollupClick = this._handleItemEditRollupClick.bind(this);
    this._handleItemEditSubmit = this._handleItemEditSubmit.bind(this);
    this._handleItemEditDeleteClick = this._handleItemEditDeleteClick.bind(this);
  }

  init(event, availableDestination, availableTypes, availableOffers) {
    this._event = event;

    const prevEventItemComponent = this._eventItemComponent;
    const prevEventItemEditComponent = this._eventItemEditComponent;

    this._eventItemComponent = new EventItemView(event, availableDestination, availableTypes, availableOffers);
    this._eventItemEditComponent = new EventItemEditView(event, availableDestination, availableTypes, availableOffers);

    this._eventItemComponent.setRollupClickHandler(this._handleItemRollupClick);
    this._eventItemComponent.setFavoriteClickHandler(this._handleItemFavoriteClick);
    this._eventItemEditComponent.setRollupClickHandler(this._handleItemEditRollupClick);
    this._eventItemEditComponent.setFormSubmitHandler(this._handleItemEditSubmit);
    this._eventItemEditComponent.setDeleteClickHandler(this._handleItemEditDeleteClick);

    if (prevEventItemComponent === null || prevEventItemEditComponent === null) {
      render(this._eventListContainer, this._eventItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventItemComponent, prevEventItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventItemEditComponent, prevEventItemEditComponent);
    }

    remove(prevEventItemComponent);
    remove(prevEventItemEditComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._eventItemEditComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventItemEditComponent, this._eventItemComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventItemComponent, this._eventItemEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _handleItemRollupClick() {
    this._replaceEventToForm();
  }

  _handleItemFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }

  _handleItemEditRollupClick() {
    this._eventItemEditComponent.reset(this._event);
    this._replaceFormToEvent();
  }

  _handleItemEditSubmit(event) {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      event,
    );
    this._replaceFormToEvent();
  }

  _handleItemEditDeleteClick(event) {
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  }

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventItemEditComponent);
  }
}
