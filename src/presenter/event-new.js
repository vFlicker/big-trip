import EventItemEditView from '../view/event-item-edit';
import { render, RenderPosition, remove } from '../utils/render';
import { DEFAULT_EVENT, Mode, UpdateType, UserAction } from './../utils/const';
import { nanoid } from 'nanoid';

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._destroyCallback = null;
    this._renderEventList = null;
    this._renderNoEvents = null;
    this._eventItemEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleItemEditRollupClick = this._handleItemEditRollupClick.bind(this);
    this._handleItemEditSubmit = this._handleItemEditSubmit.bind(this);
    this._handleItemEditDeleteClick = this._handleItemEditDeleteClick.bind(this);
  }

  init(availableDestination, availableTypes, availableOffers, callback, renderEventList, renderNoEvents) {
    this._destroyCallback = callback;
    this._renderEventList = renderEventList;
    this._renderNoEvents = renderNoEvents;

    if (this._eventItemEditComponent !== null) {
      return;
    }

    if (this._renderEventList) {
      this._renderEventList();
      this._renderEventList = null;
    }

    this._eventItemEditComponent = new EventItemEditView(DEFAULT_EVENT, Mode.ADD, availableDestination, availableTypes, availableOffers);
    this._eventItemEditComponent.setFormSubmitHandler(this._handleItemEditSubmit);
    this._eventItemEditComponent.setRollupClickHandler(this._handleItemEditRollupClick);
    this._eventItemEditComponent.setDeleteClickHandler(this._handleItemEditDeleteClick);

    render(this._eventListContainer, this._eventItemEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventItemEditComponent === null) {
      return;
    }

    if (this._renderNoEvents) {
      this._renderNoEvents();
      this._renderNoEvents = null;
    }

    if (this._destroyCallback) {
      this._destroyCallback();
    }

    remove(this._eventItemEditComponent);
    this._eventItemEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleItemEditSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      Object.assign(
        {},
        event,
        {id: nanoid()},
      ),
    );
    this.destroy();
  }

  _handleItemEditRollupClick() {
    this.destroy();
  }

  _handleItemEditDeleteClick() {
    this.destroy();
  }
}
