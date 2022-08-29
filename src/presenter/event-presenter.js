import { EscKeyEvent , Mode, UpdateType, UserAction } from '../const';
import { EventItemView, EventItemEditView } from '../view';
import { remove, render, replace } from '../utils';

export default class EventPresenter {
  #eventListContainer = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #event = null;
  #eventItemComponent = null;
  #eventItemEditComponent = null;

  constructor(eventListContainer, changeData, changeMode) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (event) => {
    this.#event = event;

    const prevEventItemComponent = this.#eventItemComponent;
    const prevEventItemEditComponent = this.#eventItemEditComponent;

    this.#eventItemComponent = new EventItemView(event);
    this.#eventItemEditComponent = new EventItemEditView(event);

    this.#eventItemComponent.setRollupClickHandler(this.#handleItemRollupClick);
    this.#eventItemComponent.setFavoriteClickHandler(this.#handleItemFavoriteClick);
    this.#eventItemEditComponent.setRollupClickHandler(this.#handleItemEditRollupClick);
    this.#eventItemEditComponent.setSubmitHandler(this.#handleItemEditSubmit);
    this.#eventItemEditComponent.setDeleteClickHandler(this.#handleItemEditDeleteClick);

    if (prevEventItemComponent === null || prevEventItemEditComponent === null) {
      render(this.#eventItemComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventItemComponent, prevEventItemComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventItemComponent, prevEventItemEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventItemComponent);
    remove(prevEventItemEditComponent);
  };

  destroy = () => {
    remove(this.#eventItemComponent);
    remove(this.#eventItemEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEvent();
    }
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#eventItemEditComponent.updateState({
        isDisabled: false,
        isDeleting: false,
        isSaving: false,
      });
    };

    this.#eventItemComponent.shake(resetFormState);
    this.#eventItemEditComponent.shake(resetFormState);
  };

  setSaving = () => {
    this.#eventItemEditComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  };

  setDeleting = () => {
    this.#eventItemEditComponent.updateState({
      isDisabled: true,
      isDeleting: true,
    });
  };

  #replaceEventToForm = () => {
    replace(this.#eventItemEditComponent, this.#eventItemComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToEvent = () => {
    replace(this.#eventItemComponent, this.#eventItemEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === EscKeyEvent .ESCAPE || evt.key === EscKeyEvent .ESC) {
      evt.preventDefault();
      this.#eventItemEditComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  };

  #handleItemEditDeleteClick = (event) => {
    this.#changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #handleItemEditRollupClick = () => {
    this.#eventItemEditComponent.reset(this.#event);
    this.#replaceFormToEvent();
  };

  #handleItemEditSubmit = (event) => {
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #handleItemFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      {
        ...this.#event,
        isFavorite: !this.#event.isFavorite
      },
    );
  };

  #handleItemRollupClick = () => {
    this.#replaceEventToForm();
  };
}
