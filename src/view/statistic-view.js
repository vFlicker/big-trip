import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';

import {STATISTIC_SETTINGS, StatisticTitles} from '../const';
import {
  getCountOfUses,
  getDurationInMs,
  getEventTypes,
  getHumanizeDuration,
  getSumPriceByType
} from '../utils';
import SmartView from './smart-view';


const renderMoneyChart = (moneyCtx, events) => {
  const uniqTypes = getEventTypes(events).map((type) => type.toUpperCase());
  const priceByType = getSumPriceByType(events);

  moneyCtx.height = STATISTIC_SETTINGS.barHeight * uniqTypes.length;

  // TODO: put it in a separate file?
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: STATISTIC_SETTINGS.type,
    data: {
      labels: uniqTypes,
      datasets: [{
        data: priceByType,
        backgroundColor: STATISTIC_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTIC_SETTINGS.hoverBackgroundColor,
        anchor: STATISTIC_SETTINGS.dataAnchor,
        minBarLength: STATISTIC_SETTINGS.minBarLength,
        barThickness: STATISTIC_SETTINGS.barThickness,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTIC_SETTINGS.basicFontSize,
          },
          color: STATISTIC_SETTINGS.dataLabelsColor,
          anchor: STATISTIC_SETTINGS.dataLabelsAnchor,
          align: STATISTIC_SETTINGS.dataLabelsAlign,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: StatisticTitles.MONEY,
        fontColor: STATISTIC_SETTINGS.fontColor,
        fontSize: STATISTIC_SETTINGS.titleFontSize,
        position: STATISTIC_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTIC_SETTINGS.fontColor,
            padding: STATISTIC_SETTINGS.padding,
            fontSize: STATISTIC_SETTINGS.basicFontSize,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, events) => {
  const uniqTypes = getEventTypes(events).map((type) => type.toUpperCase());
  const countOfUses = getCountOfUses(events);

  typeCtx.height = STATISTIC_SETTINGS.barHeight * uniqTypes.length;

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: STATISTIC_SETTINGS.type,
    data: {
      labels: uniqTypes,
      datasets: [{
        data: countOfUses,
        backgroundColor: STATISTIC_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTIC_SETTINGS.hoverBackgroundColor,
        anchor: STATISTIC_SETTINGS.dataAnchor,
        minBarLength: STATISTIC_SETTINGS.minBarLength,
        barThickness: STATISTIC_SETTINGS.barThickness,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTIC_SETTINGS.basicFontSize,
          },
          color: STATISTIC_SETTINGS.dataLabelsColor,
          anchor: STATISTIC_SETTINGS.dataLabelsAnchor,
          align: STATISTIC_SETTINGS.dataLabelsAlign,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: StatisticTitles.TYPE,
        fontColor: STATISTIC_SETTINGS.fontColor,
        fontSize: STATISTIC_SETTINGS.titleFontSize,
        position: STATISTIC_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTIC_SETTINGS.fontColor,
            padding: STATISTIC_SETTINGS.padding,
            fontSize: STATISTIC_SETTINGS.basicFontSize,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpendChart = (timeSpendCtx, events) => {
  const uniqTypes = getEventTypes(events).map((type) => type.toUpperCase());
  const durationInMs = getDurationInMs(events);

  timeSpendCtx.height = STATISTIC_SETTINGS.barHeight * uniqTypes.length;

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypes,
      datasets: [{
        data: durationInMs,
        backgroundColor: STATISTIC_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTIC_SETTINGS.hoverBackgroundColor,
        anchor: STATISTIC_SETTINGS.dataAnchor,
        minBarLength: STATISTIC_SETTINGS.minBarLength,
        barThickness: STATISTIC_SETTINGS.barThickness,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTIC_SETTINGS.basicFontSize,
          },
          color: STATISTIC_SETTINGS.dataLabelsColor,
          anchor: STATISTIC_SETTINGS.dataLabelsAnchor,
          align: STATISTIC_SETTINGS.dataLabelsAlign,
          formatter: (val) => `${(getHumanizeDuration(val))}`,
        },
      },
      title: {
        display: true,
        text: StatisticTitles.TIME_SPENT,
        fontColor: STATISTIC_SETTINGS.fontColor,
        fontSize: STATISTIC_SETTINGS.titleFontSize,
        position: STATISTIC_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTIC_SETTINGS.fontColor,
            padding: STATISTIC_SETTINGS.padding,
            fontSize: STATISTIC_SETTINGS.basicFontSize,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

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

export default class StatisticView extends SmartView {
  constructor(events) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null, this._typeChart !== null, this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null, this._typeChart !== null, this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeSpendCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyChart = renderMoneyChart(moneyCtx, this._events);
    this._typeChart = renderTypeChart(typeCtx, this._events);
    this._timeChart = renderTimeSpendChart(timeSpendCtx, this._events);
  }
}
