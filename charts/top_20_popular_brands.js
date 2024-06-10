function getTopBrandsByAverageSold(data, label) {
  const labelData = data.find(item => item.label === label);
  const brands = {};

  // Menghitung total terjual untuk setiap merek dan jumlah item merek tersebut
  labelData.items.forEach(item => {
      const brand = item.brand;
      const sold = item.terjual;
      if (brands[brand]) {
          brands[brand].totalSold += sold;
          brands[brand].count++;
      } else {
          brands[brand] = { totalSold: sold, count: 1 };
      }
  });

  // Menghitung rata-rata terjual untuk setiap merek
  const brandAverages = {};
  Object.keys(brands).forEach(brand => {
      brandAverages[brand] = brands[brand].totalSold / brands[brand].count;
  });

  // Mengurutkan merek berdasarkan rata-rata terjual
  const sortedBrands = Object.keys(brandAverages).sort((a, b) => brandAverages[b] - brandAverages[a]);
  return sortedBrands.slice(0, 20);
}

// Fungsi untuk membuat chart
async function createChartPopular(label, chartId) {
    const data = await fetchDataPopular();
    const brands = getTopBrandsByAverageSold(data, label);
    const brandAverageSold = brands.map(brand => {
        const totalSold = data.find(item => item.label === label).items
            .filter(item => item.brand === brand)
            .reduce((acc, curr) => acc + curr.terjual, 0);
        const itemCount = data.find(item => item.label === label).items
            .filter(item => item.brand === brand).length;
        return totalSold / itemCount;
    });

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
            labels: brands,
            datasets: [{
                label: `${label}`,
                data: brandAverageSold,
                backgroundColor: categoryColors[label],
                borderColor: borderColors[label],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

// Ambil data dari file JSON menggunakan fetch
async function fetchDataPopular() {
    const response = await fetch('../scrape_skincare_tokopedia/tokopedia_data_with_brand.json');
    const data = await response.json();
    return data;
}

// Panggil fungsi untuk membuat chart
createChartPopular("Acne", "popularityAcneChart");
createChartPopular("Brightening", "popularityBrighteningChart");
createChartPopular("Anti Aging", "popularityAntiAgingChart");