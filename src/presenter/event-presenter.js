import {EscKeyEvent , Mode, UpdateType, UserAction} from '../const';
import { EventItemView, EventItemEditView } from '../view';
import { remove, render, RenderPosition, replace } from '../utils';

export default class EventPresenter {
  constructor(eventListContainer, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventItemComponent = null;
    this._eventItemEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleItemEditDeleteClick = this._handleItemEditDeleteClick.bind(this);
    this._handleItemEditRollupClick = this._handleItemEditRollupClick.bind(this);
    this._handleItemEditSubmit = this._handleItemEditSubmit.bind(this);
    this._handleItemFavoriteClick = this._handleItemFavoriteClick.bind(this);
    this._handleItemRollupClick = this._handleItemRollupClick.bind(this);
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
    this._eventItemEditComponent.setSubmitHandler(this._handleItemEditSubmit);
    this._eventItemEditComponent.setDeleteClickHandler(this._handleItemEditDeleteClick);

    if (prevEventItemComponent === null || prevEventItemEditComponent === null) {
      render(this._eventListContainer, this._eventItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventItemComponent, prevEventItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventItemComponent, prevEventItemEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventItemComponent);
    remove(prevEventItemEditComponent);
  }

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventItemEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  setAborting() {
    const resetFormState = () => {
      this._eventItemEditComponent.updateState({
        isDisabled: false,
        isDeleting: false,
        isSaving: false,
      });
    };

    this._eventItemComponent.shake(resetFormState);
    this._eventItemEditComponent.shake(resetFormState);
  }

  setSaving() {
    this._eventItemEditComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    this._eventItemEditComponent.updateState({
      isDisabled: true,
      isDeleting: true,
    });
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

  _escKeyDownHandler(evt) {
    if (evt.key === EscKeyEvent .ESCAPE || evt.key === EscKeyEvent .ESC) {
      evt.preventDefault();
      this._eventItemEditComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _handleItemEditDeleteClick(event) {
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
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

  _handleItemRollupClick() {
    this._replaceEventToForm();
  }
}
