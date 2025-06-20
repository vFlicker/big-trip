import { FilterType, SortType, UpdateType, UserAction } from '../const';
import { Observer, remove, render, UiBlocker } from '../framework';
import { sort, filter } from '../utils';
import {
  BoardView,
  EventListView,
  LoaderView,
  NoEventView,
  SortView,
} from '../view';
import { EventPresenter } from './event-presenter';
import { NewEventPresenter } from './new-event-presenter';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export class BoardPresenter extends Observer {
  #boardContainer = null;
  #eventsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #loaderComponent = new LoaderView();
  #noEventComponent = new NoEventView();
  #sortComponent = null;

  #eventNewPresenter = null;

  #eventPresenter = new Map();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #currentSortType = SortType.DAY;
  #isLoading = true;

  constructor(boardContainer, eventsModel, filterModel) {
    super();

    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventNewPresenter = new NewEventPresenter(
      this.#eventListComponent.element,
      this.#handleViewAction,
    );
  }

  get events() {
    const filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[filterType](events);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sort.byTime);
      case SortType.PRICE:
        return filteredEvents.sort(sort.byPrice);
      case SortType.DAY:
        return filteredEvents.sort(sort.byDate);
      default:
        return filteredEvents;
    }
  }

  get destinations() {
    return this.#eventsModel.destinations;
  }

  get offers() {
    return this.#eventsModel.offers;
  }

  init = (isCreateEvent = false) => {
    this.#eventsModel.subscribe(this);
    this.#filterModel.subscribe(this);

    this.#renderBoard(isCreateEvent);
  };

  createEvent = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#eventNewPresenter.init(callback, this.destinations, this.offers);
  };

  destroy = () => {
    this.#clearBoard({ resetSortType: true });

    remove(this.#boardComponent);

    this.#eventsModel.unsubscribe(this);
    this.#filterModel.unsubscribe(this);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenter.get(update.id).setSaving();

        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch (err) {
          this.#eventPresenter.get(update.id).setAborting();
        }

        break;
      case UserAction.ADD_EVENT:
        this.#eventNewPresenter.setSaving();

        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch (err) {
          this.#eventNewPresenter.setAborting();
        }

        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenter.get(update.id).setDeleting();

        try {
          this.#eventsModel.deleteEvent(updateType, update);
        } catch (error) {
          this.#eventPresenter.get(update.id).setAborting();
        }

        break;
    }

    this.#uiBlocker.unblock();
  };

  update = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenter.get(data.id).init(this.destinations, this.offers, data);
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
        remove(this.#loaderComponent);
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

  #renderBoard = (isCreateEvent) => {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoader();
      return;
    }

    if (!this.events.length && !isCreateEvent) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
    this.#renderEvents();
  };

  #renderEventList = () => {
    render(this.#eventListComponent, this.#boardComponent.element);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventListComponent.element,
      this.#handleViewAction,
      this.#handleModeChange,
    );

    eventPresenter.init(this.destinations, this.offers, event);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #renderEvents = () => {
    this.events.forEach((event) => this.#renderEvent(event));
  };

  #renderLoader = () => {
    render(this.#loaderComponent, this.#boardComponent.element);
  };

  #renderNoEvent = () => {
    render(this.#noEventComponent, this.#boardComponent.element);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#boardComponent.element);
  };
}
