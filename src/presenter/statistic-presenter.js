import { StatisticView } from '../view';
import { remove, render, RenderPosition } from '../utils';

export default class StatisticPresenter {
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
    render(this.#statisticContainer, this.#statisticComponent, RenderPosition.BEFOREEND);
  };
}
