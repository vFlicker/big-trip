import {DEFAULT_EVENT, EscKeyEvent , UpdateType, UserAction} from '../const';
import { EventItemEditView } from '../view';
import { remove, render, RenderPosition } from '../utils';

export default class NewEventPresenter {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._destroyCallback = null;
    this._renderEventList = null;
    this._renderNoEvents = null;
    this._eventItemEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleItemEditDeleteClick = this._handleItemEditDeleteClick.bind(this);
    this._handleItemEditRollupClick = this._handleItemEditRollupClick.bind(this);
    this._handleItemEditSubmit = this._handleItemEditSubmit.bind(this);
  }

  init(callback, renderEventList, renderNoEvents) {
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

    this._eventItemEditComponent = new EventItemEditView(DEFAULT_EVENT);
    this._eventItemEditComponent.setSubmitHandler(this._handleItemEditSubmit);
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

  setAborting() {
    const resetFormState = () => {
      this._eventItemEditComponent.updateState({
        isDisabled: false,
        isSaving: false,
      });
    };

    this._eventItemEditComponent.shake(resetFormState);
  }

  setSaving() {
    this._eventItemEditComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  }

  _escKeyDownHandler(evt) {
    if (evt.key === EscKeyEvent .ESCAPE || evt.key === EscKeyEvent .ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleItemEditDeleteClick() {
    this.destroy();
  }

  _handleItemEditRollupClick() {
    this.destroy();
  }

  _handleItemEditSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  }
}
