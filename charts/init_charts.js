import createComparisonProductsSoldChart from './comparison_products_sold.js';
import processRatingVsSold from './rating_vs_products_sold.js';
import processPriceVsSold from './price_vs_products_sold.js';
import createPopularChart from './popular_brands.js';
import createAverageBrandPriceChart from './average_brand_price.js';

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function initCharts() {
  const data = await fetchData('../scrape_skincare_tokopedia/tokopedia_data_with_brand.json');

  await createComparisonProductsSoldChart(data);

  processRatingVsSold(data, 1000, 4.0, 'ratingVSProductsSoldChart1', 'ratingVSProductsSoldChart2');
  processPriceVsSold(data, 100000, 0, 1000000, 'priceVSProductsSoldChart1', 'priceVSProductsSoldChart2');

  const acneTopBrands = await createPopularChart(data, 'Acne', 'popularityAcneChart');
  const antiAgingTopBrands = await createPopularChart(data, 'Anti Aging', 'popularityAntiAgingChart');
  const brighteningTopBrands = await createPopularChart(data, 'Brightening', 'popularityBrighteningChart');

  await createAverageBrandPriceChart(data, 'Acne', 'averagePriceAcneChart', acneTopBrands);
  await createAverageBrandPriceChart(data, 'Anti Aging', 'averagePriceAntiAgingChart', antiAgingTopBrands);
  await createAverageBrandPriceChart(data, 'Brightening', 'averagePriceBrighteningChart', brighteningTopBrands);
}

initCharts();
