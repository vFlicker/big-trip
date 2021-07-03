import BoardView from '../view/board';
import EventListView from '../view/event-list';
import LoadingView from '../view/loading';
import NoEventView from '../view/no-event';
import SortView from '../view/sort';
import EventPresenter from './event';
import EventNewPresenter from './event-new';
import {sortByPrice, sortByTime, sortByDate} from '../utils/event';
import {filter} from '../utils/filter';
import {remove, render, RenderPosition} from '../utils/render';
import {FilterType, SortType, UpdateType, UserAction} from '../const';


export default class Board {
  constructor(boardContainer, eventsModel, filterModel, destinationModel, offersModel, api) {
    this._boardContainer = boardContainer;
    this._destinationModel = destinationModel;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._api = api;

    this._currentSortType = SortType.DAY;
    this._eventPresenter = {};
    this._isLoading = true;

    this._sortComponent = null;
    this._boardComponent = new BoardView();
    this._eventListComponent = new EventListView();
    this._loadingComponent = new LoadingView();
    this._noEventComponent = new NoEventView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._renderEventList = this._renderEventList.bind(this);
    this._renderNoEvent = this._renderNoEvent.bind(this);

    this._eventNewPresenter = new EventNewPresenter(
      this._eventListComponent,
      this._destinationModel,
      this._offersModel,
      this._handleViewAction,
    );
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  createEvent(callback) {
    const events = this._getEvents();
    const eventCount = events.length;

    if (eventCount === 0) {
      remove(this._noEventComponent);
      this._eventNewPresenter.init(callback, this._renderEventList, this._renderNoEvent);
      return;
    }

    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init(callback);
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._eventListComponent);
    remove(this._boardComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
      case SortType.DAY:
        return filteredEvents.sort(sortByDate);
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[update.id].setSaving();
        this._api
          .updateEvent(update)
          .then((event) => this._eventsModel.updateEvent(updateType, event))
          .catch(() => this._eventPresenter[update.id].setAborting());
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api
          .addEvent(update)
          .then((event) => this._eventsModel.addEvent(updateType, event))
          .catch(() => this._eventNewPresenter.setAborting());
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setDeleting();
        this._api
          .deleteEvent(update)
          .then(() => this._eventsModel.deleteEvent(updateType, update))
          .catch(() => this._eventPresenter[update.id].setAborting());
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderNoEvent() {
    render(this._boardComponent, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderEventList() {
    render(this._boardComponent, this._eventListComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._destinationModel, this._offersModel, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _clearBoard({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};

    remove(this._sortComponent);
    remove(this._loadingComponent);
    remove(this._noEventComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
