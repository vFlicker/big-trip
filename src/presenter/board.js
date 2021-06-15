import BoardView from '../view/board';
import NoEventView from '../view/no-event';
import SortView from '../view/sort';
import EventListView from '../view/event-list';
import EventPresenter from './event';
import {remove, render, RenderPosition} from '../utils/render';
import {SortType} from '../utils/const';
import {sortByPrice, sortByTime} from '../utils/event';
import { updateItem } from '../utils/common';

export default class Board {
  constructor(boardContainer, eventsModel) {
    this._boardContainer = boardContainer;
    this._eventsModel = eventsModel;

    this._currentSortType = SortType.DAY;
    this._eventPresenter = {};

    this._boardComponent = new BoardView();
    this._noEventComponent = new NoEventView();
    this._sortComponent = null;
    this._eventListComponent = new EventListView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(boardEvents, availableDestination, availableTypes, availableOffers) {
    this._boardEvents = boardEvents.slice();
    this._sourcedBoardEvents = boardEvents.slice();
    this._availableDestination = availableDestination;
    this._availableTypes = availableTypes;
    this._availableOffers = availableOffers;

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._eventsModel.getEvents().slice().sort(sortByTime);
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort(sortByPrice);
    }

    return this._eventsModel.getEvents();
  }

  _clearEventList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};

    remove(this._sortComponent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEventList();
    this._renderBoard();
  }

  _handleEventChange(updateEvent) {
    this._boardEvents = updateItem(this._boardEvents, updateEvent);
    this._eventPresenter[updateEvent.id].init(updateEvent, this._availableDestination, this._availableTypes, this._availableOffers);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderNoEvent() {
    render(this._boardComponent, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEventList() {
    render(this._boardComponent, this._eventListComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event, this._availableDestination, this._availableTypes, this._availableOffers);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _renderBoard() {
    const events = this._getEvents();
    const eventCount = events.length;

    if (eventCount === 0) {
      this._renderNoEvent();
      return;
    }

    this._renderSort();
    this._renderEventList();
    this._renderEvents(events);
  }
}
