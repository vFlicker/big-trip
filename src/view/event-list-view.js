import { AbstractView } from '../framework';


const createEventListTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export class EventListView extends AbstractView {
  get template() {
    return createEventListTemplate();
  }
}
