import { AbstractView } from '../framework';

const createLoadingTemplate = () => (
  `<p class="trip-events__msg">
      Loading...
    </p>`
);

export class LoaderView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
