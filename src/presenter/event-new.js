import EventItemEditView from '../view/event-item-edit';
import { render, RenderPosition, remove } from '../utils/render';
import { UpdateType, UserAction } from './../utils/const';
import { nanoid } from 'nanoid';

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventItemEditComponent = null;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleItemEditRollupClick = this._handleItemEditRollupClick.bind(this);
    this._handleItemEditSubmit = this._handleItemEditSubmit.bind(this);
    this._handleItemEditDeleteClick = this._handleItemEditDeleteClick.bind(this);
  }

  init(availableDestination, availableTypes, availableOffers) {
    if (this._eventItemEditComponent !== null) {
      return;
    }

    this._eventItemEditComponent = new EventItemEditView(undefined, availableDestination, availableTypes, availableOffers);
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
