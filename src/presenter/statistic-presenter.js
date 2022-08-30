import { remove, render } from '../framework';
import { StatisticView } from '../view';

export class StatisticPresenter {
  #statisticContainer = null;
  #eventsModel = null;
  #statisticComponent = null;

  constructor(statisticContainer, eventsModel) {
    this.#statisticContainer = statisticContainer;
    this.#eventsModel = eventsModel;
  }

  init = () => {
    this.#renderStatistic();
  };

  destroy = () => {
    if (this.#statisticComponent) {
      remove(this.#statisticComponent);
      this.#statisticComponent = null;
    }
  };

  #renderStatistic = () => {
    const events = this.#eventsModel.getEvents();
    this.#statisticComponent = new StatisticView(events);
    render(this.#statisticComponent, this.#statisticContainer);
  };
}
