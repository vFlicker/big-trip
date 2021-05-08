import EventItemView from '../view/event-item';
import EventItemEditView from '../view/event-item-edit';
import { render, RenderPosition, replace, remove } from '../utils/render';

export default class Event {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventItemComponent = null;
    this._eventItemEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleItemRollupClick = this._handleItemRollupClick.bind(this);
    this._handleItemFavoriteClick = this._handleItemFavoriteClick.bind(this);
    this._handleItemEditRollupClick = this._handleItemEditRollupClick.bind(this);
    this._handleItmeEditSubmit = this._handleItmeEditSubmit.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventItemComponent = this._eventItemComponent;
    const prevEventItemEditComponent = this._eventItemEditComponent;

    this._eventItemComponent = new EventItemView(event);
    this._eventItemEditComponent = new EventItemEditView(event);

    this._eventItemComponent.setRollupClickHandler(this._handleItemRollupClick);
    this._eventItemComponent.setFavoriteClickHandler(this._handleItemFavoriteClick);
    this._eventItemEditComponent.setRollupClickHandler(this._handleItemEditRollupClick);
    this._eventItemEditComponent.setFormSubmitHandler(this._handleItmeEditSubmit);

    if (prevEventItemComponent === null || prevEventItemEditComponent === null) {
      render(this._eventListContainer, this._eventItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._eventListContainer.getElement().contains(prevEventItemComponent.getElement())) {
      replace(this._eventItemComponent, prevEventItemComponent);
    }

    if (this._eventListContainer.getElement().contains(prevEventItemEditComponent.getElement())) {
      replace(this._eventItemEditComponent, prevEventItemEditComponent);
    }

    remove(prevEventItemComponent);
    remove(prevEventItemEditComponent);
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

  _handleItemFavoriteClick() {
    this._changeData(
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
