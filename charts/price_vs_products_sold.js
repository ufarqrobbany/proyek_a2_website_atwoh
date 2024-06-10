
  // Fetch and process data from tokopedia.json
  fetch('../scrape_skincare_tokopedia/tokopedia_data.json')
    .then(response => response.json())
    .then(data => {
      const maxTerjual = 100000;
      const minPrice = 0;
      const maxPrice = 800000;

      let categoryPriceData = {
        Acne: { prices: [], sold: [] },
        Brightening: { prices: [], sold: [] },
        "Anti Aging": { prices: [], sold: [] }
      };

      data.forEach(category => {
        category.items.forEach(item => {
          if (item.price && item.terjual && item.terjual < maxTerjual && item.price >= minPrice && item.price <= maxPrice) {
            categoryPriceData[category.label].prices.push(item.price);
            categoryPriceData[category.label].sold.push(item.terjual);
          }
        });
      });

      // Combine data for scatter plot
      let scatterPriceData = [];
      Object.keys(categoryPriceData).forEach(category => {
        scatterPriceData.push({
          label: category,
          data: categoryPriceData[category].prices.map((price, index) => ({ x: price, y: categoryPriceData[category].sold[index] })),
          backgroundColor: getPriceCategoryColor(category),
          pointStyle: getPriceCategoryPointStyle(category)
        });
      });
      createPriceScatterPlot('priceVSProductsSoldChart1', scatterPriceData);

      // Create multi-line chart for all categories
      createPriceMultiLineChart(categoryPriceData);
    })
    .catch(error => console.error('Error fetching data:', error));

  function getPriceCategoryColor(category) {
    const colors = {
      Acne: 'rgba(75, 192, 192, 1)',
      Brightening: 'rgba(255, 159, 64, 1)',
      "Anti Aging": 'rgba(153, 102, 255, 1)'
    };
    return colors[category];
  }

  function getPriceCategoryPointStyle(category) {
    const styles = {
      Acne: 'circle',
      Brightening: 'triangle',
      "Anti Aging": 'rect'
    };
    return styles[category];
  }

  function createPriceScatterPlot(canvasId, scatterData) {
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
              text: 'Price (IDR)'
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

  function createPriceMultiLineChart(categoryData) {
    const ctx = document.getElementById('priceVSProductsSoldChart2').getContext('2d');
    const listPrices = Array.from({ length: 21 }, (_, i) => (i * 50000));

    const datasets = Object.keys(categoryData).map(category => {
      const soldBin = listPrices.map(price => {
        const bin = [];
        categoryData[category].prices.forEach((p, index) => {
          if (Math.floor(p / 50000) * 50000 == price) {
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
        borderColor: getPriceCategoryColor(category),
        tension: 0.1
      };
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: listPrices,
        datasets: datasets
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Price (IDR)'
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