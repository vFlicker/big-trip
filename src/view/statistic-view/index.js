import { AbstractView } from '../../framework';
import { renderMoneyChart, renderTimeSpendChart, renderTypeChart } from './utils';

const createStatisticsTemplate = () => (
  `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
);

export class StatisticView extends AbstractView {
  #events = null;
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  constructor(events) {
    super();

    this.#events = events;

    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate();
  }

  removeElement = () => {
    super.removeElement();

    if (
      this.#moneyChart !== null,
      this.#typeChart !== null,
      this.#timeChart !== null
    ) {
      this.#moneyChart = null;
      this.#typeChart = null;
      this.#timeChart = null;
    }
  };

  restoreHandlers = () => {
    this.#setCharts();
  };

  #setCharts = () => {
    if (
      this.#moneyChart !== null,
      this.#typeChart !== null,
      this.#timeChart !== null
    ) {
      this.#moneyChart = null;
      this.#typeChart = null;
      this.#timeChart = null;
    }

    const moneyCtx = this.element.querySelector('.statistics__chart--money');
    const typeCtx = this.element.querySelector('.statistics__chart--transport');
    const timeSpendCtx = this.element.querySelector('.statistics__chart--time');

    this.#moneyChart = renderMoneyChart(moneyCtx, this.#events);
    this.#typeChart = renderTypeChart(typeCtx, this.#events);
    this.#timeChart = renderTimeSpendChart(timeSpendCtx, this.#events);
  };
}
