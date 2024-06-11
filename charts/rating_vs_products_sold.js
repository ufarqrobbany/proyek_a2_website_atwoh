import { getCategoryColor, getCategoryPointStyle } from "./utils.js";
import { createScatterPlot, createMultiLineChart } from "./charts.js";

function processRatingVsSold(data, maxsold, ratingThreshold, scatterChartId, lineChartId) {
  let categoryData = {
    "Acne": { ratings: [], sold: [] },
    "Brightening": { ratings: [], sold: [] },
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

  let scatterData = [];
  Object.keys(categoryData).forEach(category => {
    scatterData.push({
      label: category,
      data: categoryData[category].ratings.map((rating, index) => ({ x: rating, y: categoryData[category].sold[index] })),
      backgroundColor: getCategoryColor(category),
      pointStyle: getCategoryPointStyle(category)
    });
  });

  createScatterPlot(scatterChartId, scatterData, 'Rating');
  createMultiLineChart(lineChartId, categoryData, 'Rating', 'Mean Sold', 4.0, 5.0, 0.1, 'Rating');
}

export default processRatingVsSold;