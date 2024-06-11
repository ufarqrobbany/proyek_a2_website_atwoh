export function getUnique(data) {
  return [...new Set(data)];
}

export function getMeans(labels, values, brands) {
  const sums = new Array(labels.length).fill(0);
  const counts = new Array(labels.length).fill(0);

  values.forEach((value, index) => {
    const brandIndex = labels.indexOf(brands[index]);
    sums[brandIndex] += value;
    counts[brandIndex] += 1;
  });

  return sums.map((sum, index) => sum / counts[index]);
}

export function getData(data, category) {
  const values = [];
  const brands = [];

  data.forEach(cat => {
    if (cat.label === category) {
      cat.items.forEach(item => {
        values.push(item.price);
        brands.push(item.brand);
      });
    }
  });

  return { values, brands };
}

export function getTotalSales(data, category) {
  let total = 0;
  data.forEach(cat => {
    if (cat.label === category) {
      cat.items.forEach(item => {
        total += item.sold;
      });
    }
  });
  return total;
}

export function getCategoryColor(category) {
  const colors = {
    Acne: 'rgba(75, 192, 192, 1)',
    Brightening: 'rgba(255, 159, 64, 1)',
    "Anti Aging": 'rgba(153, 102, 255, 1)'
  };
  return colors[category];
}

export function getCategoryPointStyle(category) {
  const styles = {
    Acne: 'circle',
    Brightening: 'triangle',
    "Anti Aging": 'rect'
  };
  return styles[category];
}