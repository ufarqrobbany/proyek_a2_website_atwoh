// Function to get unique elements from an array
function getUnique(data) {
  return [...new Set(data)];
}

// Function to calculate mean prices
function getMeans(labels, prices, brands) {
  const sums = new Array(labels.length).fill(0);
  const counts = new Array(labels.length).fill(0);

  prices.forEach((price, index) => {
    const brandIndex = labels.indexOf(brands[index]);
    sums[brandIndex] += price;
    counts[brandIndex] += 1;
  });

  return sums.map((sum, index) => sum / counts[index]);
}

// Function to get data from the JSON structure
function getData(data, kategori) {
  const prices = [];
  const brands = [];

  data.forEach(category => {
    if (category.label === kategori) {
      category.items.forEach(item => {
        prices.push(item.price);
        brands.push(item.brand);
      });
    }
  });

  return { prices, brands };
}

// Function to create a bar chart
function createBarChart(chartId, labels, data, category) {
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
            text: 'Mean Price'
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

// Fetch data from JSON file and create the charts
fetch('../scrape_skincare_tokopedia/tokopedia_data_with_brand.json')
  .then(response => response.json())
  .then(data => {
    const categories = ['Acne', 'Anti Aging', 'Brightening'];

    categories.forEach(category => {
      const { prices, brands } = getData(data, category);
      const labels = getUnique(brands);
      const means = getMeans(labels, prices, brands);

      // Combine labels and means into an array of objects
      const combined = labels.map((label, index) => ({
        brand: label,
        mean: means[index]
      }));

      // Sort the combined array by mean price in descending order
      combined.sort((a, b) => b.mean - a.mean);

      // Take the top 20 items
      const top20 = combined.slice(0, 20);

      // Extract the sorted labels and means for the top 20 items
      const top20Labels = top20.map(item => item.brand);
      const top20Means = top20.map(item => item.mean);

      if (category === 'Acne') {
        createBarChart('acneChart', top20Labels, top20Means, category);
      } else if (category === 'Anti Aging') {
        createBarChart('antiAgingChart', top20Labels, top20Means, category);
      } else if (category === 'Brightening') {
        createBarChart('brighteningChart', top20Labels, top20Means, category);
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));