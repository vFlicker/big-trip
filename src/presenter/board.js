import BoardView from '../view/board';
import NoEventView from '../view/no-event';
import SortView from '../view/sort';
import EventListView from '../view/event-list';
import EventItemView from '../view/event-item';
import EventItemEditView from '../view/event-item-edit';
import { render, RenderPosition, replace } from '../utils/render';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardComponent = new BoardView();
    this._noEventComponent = new NoEventView();
    this._sortComponent = new SortView();
    this._eventListComponent = new EventListView();
  }

  init(boardEvents) {
    this._boardEvents = boardEvents.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderNoEvent() {
    render(this._boardComponent, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEventList() {
    render(this._boardComponent, this._eventListComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventItemComponent = new EventItemView(event);
    const eventItemEditComponent = new EventItemEditView(event);

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

    render(this._eventListComponent, eventItemComponent, RenderPosition.BEFOREEND);
  }

  _renderEvents() {
    this._boardEvents.forEach((event) => this._renderEvent(event));
  }

  _renderBoard() {
    if (this._boardEvents.length === 0) {
      this._renderNoEvent();
      return;
    }

    this._renderSort();
    this._renderEventList();
    this._renderEvents();
  }
}
