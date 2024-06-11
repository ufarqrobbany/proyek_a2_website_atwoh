import { getCategoryColor } from "./utils.js";

export function createPolarAreaChart(chartId, labels, data) {
  const ctx = document.getElementById(chartId).getContext('2d');
  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Sales',
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }]
    }
  });
}

export function createBarChart(chartId, labels, data, category, label) {
  const categoryColors = {
    'Acne': 'rgba(75, 192, 192, 0.5)',
    'Anti Aging': 'rgba(255, 159, 64, 0.5)',
    'Brightening': 'rgba(153, 102, 255, 0.5)'
  };
  const borderColors = {
    'Acne': 'rgba(75, 192, 192, 1)',
    'Anti Aging': 'rgba(255, 159, 64, 1)',
    'Brightening': 'rgba(153, 102, 255, 1)'
  };

  const ctx = document.getElementById(chartId).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: category,
        data: data,
        backgroundColor: categoryColors[category],
        borderColor: borderColors[category],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Brand'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: label
          }
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

export function createScatterPlot(chartId, scatterData, chartType) {
  const ctx = document.getElementById(chartId).getContext('2d');
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: scatterData
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: chartType == 'Price' ? 'Price (IDR)' : 'Rating'
          },
          min: chartType == 'Price' ? 0 : 4.0,
          max: chartType == 'Price' ? 1000000 : 5.0,
          ticks: {
            stepSize: chartType == 'Price' ? 50000 : 0.1
          }
        },
        y: {
          title: {
            display: true,
            text: 'Sold'
          }
        }
      }
    }
  });
}

export function createMultiLineChart(chartId, categoryData, xAxisTitle, yAxisTitle, xMin, xMax, xStepSize, chartType) {
  const ctx = document.getElementById(chartId).getContext('2d');
  const listPrices = Array.from({ length: 21 }, (_, i) => (i * 50000));
  const listRating = Array.from({ length: 11 }, (_, i) => 4.0 + i * 0.1);
  let soldBin = null;

  const datasets = Object.keys(categoryData).map(category => {
    if (chartType == 'Price') {
      soldBin = listPrices.map(price => {
        const bin = [];
        categoryData[category].prices.forEach((p, index) => {
          if (Math.floor(p / 50000) * 50000 == price) {
            bin.push(categoryData[category].sold[index]);
          }
        });
        const mean = bin.length ? bin.reduce((a, b) => a + b, 0) / bin.length : 0;
        return mean;
      });
    } else {
      soldBin = listRating.map(r => {
        const bin = [];
        categoryData[category].ratings.forEach((rate, index) => {
          if (rate.toFixed(1) == r.toFixed(1)) {
            bin.push(categoryData[category].sold[index]);
          }
        });
        const mean = bin.length ? bin.reduce((a, b) => a + b, 0) / bin.length : 0;
        return mean;
      });
    }

    return {
      label: category,
      data: soldBin,
      fill: false,
      borderColor: getCategoryColor(category),
      tension: 0.1
    };
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartType == 'Price' ? listPrices : listRating ,
      datasets: datasets
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: xAxisTitle
          },
          min: xMin,
          max: xMax,
          ticks: {
            stepSize: xStepSize
          }
        },
        y: {
          title: {
            display: true,
            text: yAxisTitle
          }
        }
      }
    }
  });
}