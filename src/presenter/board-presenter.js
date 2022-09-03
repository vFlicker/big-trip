import { FilterType, SortType, UpdateType, UserAction } from '../const';
import { remove, render } from '../framework';
import {
  sortByPrice,
  sortByTime,
  sortByDate,
  filter
} from '../utils';
import {
  BoardView,
  EventListView,
  LoaderView,
  NoEventView,
  SortView,
} from '../view';
import { EventPresenter } from './event-presenter';
import { NewEventPresenter } from './new-event-presenter';

export class BoardPresenter {
  #boardContainer = null;
  #eventsModel = null;
  #filterModel = null;
  #api = null;

  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #loaderComponent = new LoaderView();
  #noEventComponent = new NoEventView();
  #sortComponent = null;

  #eventNewPresenter = null;

  #eventPresenter = new Map();
  #currentSortType = SortType.DAY;
  #isLoading = true;

  constructor(boardContainer, eventsModel, filterModel, api) {
    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#api = api;

    this.#eventNewPresenter = new NewEventPresenter(this.#eventListComponent, this.#handleViewAction);
  }

  get events() {
    const filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[filterType](events);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
      case SortType.DAY:
        return filteredEvents.sort(sortByDate);
      default:
        return filteredEvents;
    }
  }

  init = () => {
    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  };

  createEvent = (callback) => {
    if (!this.events.length) {
      remove(this.#noEventComponent);
      // TODO: remove 2 and 3 args
      this.#eventNewPresenter.init(callback, this.#renderEventList, this.#renderNoEvent);
      return;
    }

    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#eventNewPresenter.init(callback);
  };

  destroy = () => {
    this.#clearBoard({ resetSortType: true });

    remove(this.#eventListComponent);
    remove(this.#boardComponent);

    this.#eventsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenter.get(update.id).setSaving();
        this.#api
          .updateEvent(update)
          .then((event) => this.#eventsModel.updateEvent(updateType, event))
          .catch(() => this.#eventPresenter.get(update.id).setAborting());
        break;
      case UserAction.ADD_EVENT:
        this.#eventNewPresenter.setSaving();
        this.#api
          .addEvent(update)
          .then((event) => this.#eventsModel.addEvent(updateType, event))
          .catch(() => this.#eventNewPresenter.setAborting());
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenter.get(update.id).setDeleting();
        this.#api
          .deleteEvent(update)
          .then(() => this.#eventsModel.deleteEvent(updateType, update))
          .catch(() => this.#eventPresenter.get(update.id).setAborting());
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #clearBoard = ({ resetSortType = false } = {}) => {
    this.#eventNewPresenter.destroy();

    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loaderComponent);
    remove(this.#noEventComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoader();
      return;
    }

    if (!this.events.length) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
    this.#renderEvents();
  };

  #renderEventList = () => {
    render(this.#eventListComponent, this.#boardComponent);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventListComponent,
      this.#handleViewAction,
      this.#handleModeChange,
    );

    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #renderEvents = () => {
    this.events.forEach((event) => this.#renderEvent(event));
  };

  #renderLoader = () => {
    render(this.#loaderComponent, this.#boardComponent);
  };

  #renderNoEvent = () => {
    render(this.#noEventComponent, this.#boardComponent);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#boardComponent);
  };
}
