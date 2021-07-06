import StatisticView from '../view/statistic';
import {remove, render, RenderPosition} from '../utils/render';

export default class Statistic {
  constructor(statisticContainer, eventsModel) {
    this._statisticContainer = statisticContainer;
    this._eventsModel = eventsModel;

    this._statisticComponent = null;
  }

  init() {
    this._renderStatistic();
  }

  destroy() {
    if (this._statisticComponent) {
      remove(this._statisticComponent);
      this._statisticComponent = null;
    }
  }

  _renderStatistic() {
    const events = this._eventsModel.getEvents();
    this._statisticComponent = new StatisticView(events);
    render(this._statisticContainer, this._statisticComponent, RenderPosition.BEFOREEND);
  }
}
