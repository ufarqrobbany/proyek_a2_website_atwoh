import { getCategoryColor, getCategoryPointStyle } from "./utils.js";
import { createScatterPlot, createMultiLineChart } from "./charts.js";

function processPriceVsSold(data, maxsold, minPrice, maxPrice, scatterChartId, lineChartId) {
  let categoryPriceData = {
    "Acne": { prices: [], sold: [] },
    "Brightening": { prices: [], sold: [] },
    "Anti Aging": { prices: [], sold: [] }
  };

  data.forEach(category => {
    category.items.forEach(item => {
      if (item.price && item.sold && item.sold < maxsold && item.price >= minPrice && item.price <= maxPrice) {
        categoryPriceData[category.label].prices.push(item.price);
        categoryPriceData[category.label].sold.push(item.sold);
      }
    });
  });

  let scatterPriceData = [];
  Object.keys(categoryPriceData).forEach(category => {
    scatterPriceData.push({
      label: category,
      data: categoryPriceData[category].prices.map((price, index) => ({ x: price, y: categoryPriceData[category].sold[index] })),
      backgroundColor: getCategoryColor(category),
      pointStyle: getCategoryPointStyle(category)
    });
  });

  createScatterPlot(scatterChartId, scatterPriceData, 'Price');
  createMultiLineChart(lineChartId, categoryPriceData, 'Price (IDR)', 'Mean Sold', 0, 1000000, 50000, 'Price');
}

export default processPriceVsSold;