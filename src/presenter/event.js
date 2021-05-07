import EventItemView from '../view/event-item';
import EventItemEditView from '../view/event-item-edit';
import { render, RenderPosition, replace } from '../utils/render';

export default class Event {
  constructor(eventListContainer) {
    this._eventListContainer = eventListContainer;
  }

  init(event) {
    this._event = event;

    this._renderEvent();
  }

  _renderEvent() {
    const eventItemComponent = new EventItemView(this._event);
    const eventItemEditComponent = new EventItemEditView(this._event);

    const replaceEventToForm = () => {
      replace(eventItemEditComponent, eventItemComponent);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const replaceFormToEvent = () => {
      replace(eventItemComponent, eventItemEditComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        replaceFormToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventItemComponent.setEditClickHandler(replaceEventToForm);
    eventItemEditComponent.setEditClickHandler(replaceFormToEvent);
    eventItemEditComponent.setFormSubmitHandler(replaceFormToEvent);

    render(this._eventListContainer, eventItemComponent, RenderPosition.BEFOREEND);
  }
}
