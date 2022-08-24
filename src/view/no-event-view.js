import AbstractView from './abstract-view';

const createNoEventTemplate = () => (
  `<p class="trip-events__msg">
      Click New Event to create your first point
    </p>`
);

export default class NoEventView extends AbstractView {
  getTemplate() {
    return createNoEventTemplate();
  }
}
