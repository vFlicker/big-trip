import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getCountOfUses, getEventTypes, getSumPriceByType, getDurationInMs, getHumanizeDuration } from './../utils/statistic';
import { StatiscticsTitles, STATISTICS_SETTINGS } from './../utils/const';

const renderMoneyChart = (moneyCtx, events) => {
  const uniqTypes = getEventTypes(events).map((type) => type.toUpperCase());
  const priceByType = getSumPriceByType(events);

  moneyCtx.height = STATISTICS_SETTINGS.barHeight * uniqTypes.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: STATISTICS_SETTINGS.type,
    data: {
      labels: uniqTypes,
      datasets: [{
        data: priceByType,
        backgroundColor: STATISTICS_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTICS_SETTINGS.hoverBackgroundColor,
        anchor: STATISTICS_SETTINGS.dataAnchor,
        minBarLength: STATISTICS_SETTINGS.minBarLength,
        barThickness: STATISTICS_SETTINGS.barThickness,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTICS_SETTINGS.basicFontSize,
          },
          color: STATISTICS_SETTINGS.datalabelsColor,
          anchor: STATISTICS_SETTINGS.datalabelsAnchor,
          align: STATISTICS_SETTINGS.datalabelsAlign,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: StatiscticsTitles.MONEY,
        fontColor: STATISTICS_SETTINGS.fontColor,
        fontSize: STATISTICS_SETTINGS.titleFontSize,
        position: STATISTICS_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTICS_SETTINGS.fontColor,
            padding: STATISTICS_SETTINGS.padding,
            fontSize: STATISTICS_SETTINGS.basicFontSize,
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

  typeCtx.height = STATISTICS_SETTINGS.barHeight * uniqTypes.length;

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: STATISTICS_SETTINGS.type,
    data: {
      labels: uniqTypes,
      datasets: [{
        data: countOfUses,
        backgroundColor: STATISTICS_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTICS_SETTINGS.hoverBackgroundColor,
        anchor: STATISTICS_SETTINGS.dataAnchor,
        minBarLength: STATISTICS_SETTINGS.minBarLength,
        barThickness: STATISTICS_SETTINGS.barThickness,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTICS_SETTINGS.basicFontSize,
          },
          color: STATISTICS_SETTINGS.datalabelsColor,
          anchor: STATISTICS_SETTINGS.datalabelsAnchor,
          align: STATISTICS_SETTINGS.datalabelsAlign,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: StatiscticsTitles.TYPE,
        fontColor: STATISTICS_SETTINGS.fontColor,
        fontSize: STATISTICS_SETTINGS.titleFontSize,
        position: STATISTICS_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTICS_SETTINGS.fontColor,
            padding: STATISTICS_SETTINGS.padding,
            fontSize: STATISTICS_SETTINGS.basicFontSize,
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

  timeSpendCtx.height = STATISTICS_SETTINGS.barHeight * uniqTypes.length;

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypes,
      datasets: [{
        data: durationInMs,
        backgroundColor: STATISTICS_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTICS_SETTINGS.hoverBackgroundColor,
        anchor: STATISTICS_SETTINGS.dataAnchor,
        minBarLength: STATISTICS_SETTINGS.minBarLength,
        barThickness: STATISTICS_SETTINGS.barThickness,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTICS_SETTINGS.basicFontSize,
          },
          color: STATISTICS_SETTINGS.datalabelsColor,
          anchor: STATISTICS_SETTINGS.datalabelsAnchor,
          align: STATISTICS_SETTINGS.datalabelsAlign,
          formatter: (val) => `${(getHumanizeDuration(val))}`,
        },
      },
      title: {
        display: true,
        text: StatiscticsTitles.TIME_SPENT,
        fontColor: STATISTICS_SETTINGS.fontColor,
        fontSize: STATISTICS_SETTINGS.titleFontSize,
        position: STATISTICS_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTICS_SETTINGS.fontColor,
            padding: STATISTICS_SETTINGS.padding,
            fontSize: STATISTICS_SETTINGS.basicFontSize,
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

const createStatisticsTemplate = () => {
  return (
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
};

export default class Statistics extends SmartView {
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
