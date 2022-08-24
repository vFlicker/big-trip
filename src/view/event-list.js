import AbstractView from './abstract';

const createEventListTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class EventListView extends AbstractView {
  getTemplate() {
    return createEventListTemplate();
  }
}
