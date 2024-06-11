import { createBarChart } from "./charts.js";

function getTopBrandsByAverageSold(data, label) {
    const labelData = data.find(item => item.label === label);
    const brands = {};
  
    labelData.items.forEach(item => {
      const brand = item.brand;
      const sold = item.sold;
      if (brands[brand]) {
        brands[brand].totalSold += sold;
        brands[brand].count++;
      } else {
        brands[brand] = { totalSold: sold, count: 1 };
      }
    });
  
    const brandAverages = {};
    Object.keys(brands).forEach(brand => {
      brandAverages[brand] = brands[brand].totalSold / brands[brand].count;
    });
  
    const sortedBrands = Object.keys(brandAverages).sort((a, b) => brandAverages[b] - brandAverages[a]);
    return sortedBrands.slice(0, 20);
}

async function createPopularChart(data, category, chartId) {
    const brands = getTopBrandsByAverageSold(data, category);
    const brandAverageSold = brands.map(brand => {
      const totalSold = data.find(item => item.label === category).items
        .filter(item => item.brand === brand)
        .reduce((acc, curr) => acc + curr.sold, 0);
      const itemCount = data.find(item => item.label === category).items
        .filter(item => item.brand === brand).length;
      return totalSold / itemCount;
    });
  
    createBarChart(chartId, brands, brandAverageSold, category, 'Mean Sold');
    return brands;
}  

export default createPopularChart;