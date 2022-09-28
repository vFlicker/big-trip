import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import { getDurationInMs, getEventTypes, getHumanizeDuration } from './common';

const STATISTIC_SETTINGS = {
  backgroundColor: '#ffffff',
  barHeight: 55,
  barThickness: 44,
  basicFontSize: 13,
  dataAnchor: 'start',
  dataLabelsAlign: 'start',
  dataLabelsAnchor: 'end',
  dataLabelsColor: '#000000',
  fontColor: '#000000',
  hoverBackgroundColor: '#ffffff',
  minBarLength: 50,
  padding: 5,
  titleFontSize: 23,
  titlePosition: 'left',
  type: 'horizontalBar',
};

const StatisticTitles = {
  TYPE: 'TYPE',
  MONEY: 'MONEY',
  TIME_SPENT: 'TIME-SPENT',
};

export const renderMoneyChart = (moneyCtx, events) => {
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

export const renderTypeChart = (typeCtx, events) => {
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

export const renderTimeSpendChart = (timeSpendCtx, events) => {
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
