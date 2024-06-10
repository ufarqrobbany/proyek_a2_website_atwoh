// Fetch and process data from tokopedia.json
fetch('../scrape_skincare_tokopedia/tokopedia_data_with_brand.json')
  .then(response => response.json())
  .then(data => {
    const maxsold = 1000;
    const ratingThreshold = 4.0;

    let categoryData = {
      Acne: { ratings: [], sold: [] },
      Brightening: { ratings: [], sold: [] },
      "Anti Aging": { ratings: [], sold: [] }
    };

    data.forEach(category => {
      category.items.forEach(item => {
        if (item.rating && item.sold && item.sold < maxsold && item.rating >= ratingThreshold) {
          categoryData[category.label].ratings.push(item.rating);
          categoryData[category.label].sold.push(item.sold);
        }
      });
    });

    // Combine data for scatter plot
    let scatterData = [];
    Object.keys(categoryData).forEach(category => {
      scatterData.push({
        label: category,
        data: categoryData[category].ratings.map((rating, index) => ({ x: rating, y: categoryData[category].sold[index] })),
        backgroundColor: getCategoryColor(category),
        pointStyle: getCategoryPointStyle(category)
      });
    });
    createScatterPlot('ratingVSProductsSoldChart1', scatterData);

    // Create multi-line chart for all categories
    createMultiLineChart(categoryData);
  })
  .catch(error => console.error('Error fetching data:', error));

function getCategoryColor(category) {
  const colors = {
    Acne: 'rgba(75, 192, 192, 1)',
    Brightening: 'rgba(255, 159, 64, 1)',
    "Anti Aging": 'rgba(153, 102, 255, 1)'
  };
  return colors[category];
}

function getCategoryPointStyle(category) {
  const styles = {
    Acne: 'circle',
    Brightening: 'triangle',
    "Anti Aging": 'rect'
  };
  return styles[category];
}

function createScatterPlot(canvasId, scatterData) {
  const ctx = document.getElementById(canvasId).getContext('2d');
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
            text: 'Rating'
          },
          min: 4.0,
          max: 5.0,
          ticks: {
            stepSize: 0.1
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

function createMultiLineChart(categoryData) {
  const ctx = document.getElementById('ratingVSProductsSoldChart2').getContext('2d');
  const listRating = Array.from({ length: 11 }, (_, i) => 4.0 + i * 0.1);

  const datasets = Object.keys(categoryData).map(category => {
    const soldBin = listRating.map(r => {
      const bin = [];
      categoryData[category].ratings.forEach((rate, index) => {
        if (rate.toFixed(1) == r.toFixed(1)) {
          bin.push(categoryData[category].sold[index]);
        }
      });
      const mean = bin.length ? bin.reduce((a, b) => a + b, 0) / bin.length : 0;
      return mean;
    });

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
      labels: listRating,
      datasets: datasets
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Rating'
          },
          min: 4.0,
          max: 5.0,
          ticks: {
            stepSize: 0.1
          }
        },
        y: {
          title: {
            display: true,
            text: 'Mean Sold'
          }
        }
      }
    }
  });
}
