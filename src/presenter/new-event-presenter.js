import { EscKeyEvent , UpdateType, UserAction } from '../const';
import { remove, render, RenderPosition } from '../framework';
import { EventItemEditView } from '../view';

export class NewEventPresenter {
  #eventListContainer = null;
  #changeData = null;

  #eventItemEditComponent = null;

  #destroyCallback = null;

  constructor(eventListContainer, changeData) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
  }

  init = (callback, destinations, offers) => {
    this.#destroyCallback = callback;

    if (this.#eventItemEditComponent !== null) {
      return;
    }

    this.#eventItemEditComponent = new EventItemEditView(destinations, offers);
    this.#eventItemEditComponent.setSubmitHandler(this.#handleItemEditSubmit);
    this.#eventItemEditComponent.setRollupClickHandler(this.#handleItemEditRollupClick);
    this.#eventItemEditComponent.setDeleteClickHandler(this.#handleItemEditDeleteClick);

    render(this.#eventItemEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#eventItemEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#eventItemEditComponent);
    this.#eventItemEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#eventItemEditComponent.updateState({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#eventItemEditComponent.shake(resetFormState);
  };

  setSaving = () => {
    this.#eventItemEditComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === EscKeyEvent.ESCAPE || evt.key === EscKeyEvent.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleItemEditDeleteClick = () => {
    this.destroy();
  };

  #handleItemEditRollupClick = () => {
    this.destroy();
  };

  #handleItemEditSubmit = (event) => {
    this.#changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  };
}
