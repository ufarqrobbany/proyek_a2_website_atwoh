import { getTotalSales } from "./utils.js";
import { createPolarAreaChart } from "./charts.js";

async function createComparisonProductsSoldChart(data) {
  const acneSales = getTotalSales(data, 'Acne');
  const antiAgingSales = getTotalSales(data, 'Anti Aging');
  const brighteningSales = getTotalSales(data, 'Brightening');

  const labels = ['Acne', 'Anti Aging', 'Brightening'];
  const salesData = [acneSales, antiAgingSales, brighteningSales];

  createPolarAreaChart('comparisonProductsSoldByCategoryChart', labels, salesData);
}

export default createComparisonProductsSoldChart;