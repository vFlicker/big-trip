import BoardView from '../view/board';
import NoEventView from '../view/no-event';
import SortView from '../view/sort';
import EventListView from '../view/event-list';
import EventPresenter from './event';
import { render, RenderPosition } from '../utils/render';
import { updateItem } from './../utils/common';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._eventPresenter = {};

    this._boardComponent = new BoardView();
    this._noEventComponent = new NoEventView();
    this._sortComponent = new SortView();
    this._eventListComponent = new EventListView();

    this._handleEventChange = this._handleEventChange.bind(this);
  }

  init(boardEvents) {
    this._boardEvents = boardEvents.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleEventChange(updateEvent) {
    this._boardEvents = updateItem(this._boardEvents, updateEvent);
    this._eventPresenter[updateEvent.id].init(updateEvent);
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
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
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

  _clearTaskList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};
  }
}
