// Fungsi untuk mengambil data dari file JSON
async function fetchData() {
  const response = await fetch('../scrape_skincare_tokopedia/tokopedia_data.json');
  const data = await response.json();
  return data;
}

function getTotalPenjualan(data, keywords) {
  let total = 0;

  for (let d of data) {
    if (d.label === keywords) {
      for (let h of d.items) {
        total = total + h.terjual;
      }
    }
  }
  console.log("Total penjualan " + keywords + ": " + total)
  return total;
}

// Fungsi untuk membuat chart
async function createChart() {
  const rawData = await fetchData();

  const acneSales = getTotalPenjualan(rawData, "Acne");
  const antiAgingSales = getTotalPenjualan(rawData, "Anti Aging");
  const brighteningSales = getTotalPenjualan(rawData, "Brightening");

  const labels = ['Acne', 'Anti Aging', 'Brightening'];
  const salesData = [acneSales, antiAgingSales, brighteningSales];

  const ctx = document.getElementById('comparisonProductsSoldByCategoryChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Penjualan',
        data: salesData,
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
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Panggil fungsi createChart untuk menampilkan chart
createChart();
