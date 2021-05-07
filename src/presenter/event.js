import EventItemView from '../view/event-item';
import EventItemEditView from '../view/event-item-edit';
import { render, RenderPosition, replace, remove } from '../utils/render';

export default class Event {
  constructor(eventListContainer) {
    this._eventListContainer = eventListContainer;

    this._eventItemComponent = null;
    this._eventItemEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleItemRollupClick = this._handleItemRollupClick.bind(this);
    this._handleItemEditRollupClick = this._handleItemEditRollupClick.bind(this);
    this._handleItmeEditSubmit = this._handleItmeEditSubmit.bind(this);
  }

  init(event) {
    this._event = event;

    this._eventItemComponent = new EventItemView(event);
    this._eventItemEditComponent = new EventItemEditView(event);

    this._eventItemComponent.setRollupClickHandler(this._handleItemRollupClick);
    this._eventItemEditComponent.setRollupClickHandler(this._handleItemEditRollupClick);
    this._eventItemEditComponent.setFormSubmitHandler(this._handleItmeEditSubmit);

    render(this._eventListContainer, this._eventItemComponent, RenderPosition.BEFOREEND);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.replaceFormToEvent();
    }
  }

  replaceEventToForm() {
    replace(this._eventItemEditComponent, this._eventItemComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  replaceFormToEvent() {
    replace(this._eventItemComponent, this._eventItemEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleItemRollupClick() {
    this.replaceEventToForm();
  }

  _handleItemEditRollupClick() {
    this.replaceFormToEvent();
  }

  _handleItmeEditSubmit() {
    this.replaceFormToEvent();
  }

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventItemEditComponent);
  }
}
