import { getData, getMeans } from "./utils.js";
import { createBarChart } from "./charts.js";

async function createAverageBrandPriceChart(data, category, chartId, topBrands) {
  const { values, brands } = getData(data, category);
  const means = getMeans(topBrands, values, brands);

  const combined = topBrands.map((brand, index) => ({
    brand: brand,
    mean: means[index]
  }));

  combined.sort((a, b) => b.mean - a.mean);
  const top20 = combined.slice(0, 20);
  const top20Labels = top20.map(item => item.brand);
  const top20Means = top20.map(item => item.mean);

  createBarChart(chartId, top20Labels, top20Means, category, 'Mean Price');
}

export default createAverageBrandPriceChart;