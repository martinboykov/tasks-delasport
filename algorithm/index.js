const db = require('./data.js');

// Task 1
const keys = getKeys(db.marketCategories.rules);
const marketEntries = getEntries(db.markets)
const marketsFilteredByKey = filterMarketsByKey(marketEntries, keys);
const outputTask1 = getOutput(marketsFilteredByKey);
console.log('outputTask1: ', outputTask1);

// Task 2
const sortedMarkets = sortMarkets(marketsFilteredByKey);
const outputTask2 = getOutput(sortedMarkets);
console.log('outputTask2: ', outputTask2);

// Functions
function getKeys(data) {
  return data
    .reduce((acc, curr) => {
      acc = { ...acc, [curr.key]: true }
      return acc;
    }, {}); // O(n)
}
function getEntries(markets) {
  return Object.entries(markets); // O(n)
}
function filterMarketsByKey(markets, keys) {
  return markets.filter((market) => {
    const marketKey = market[0];
    return keys[marketKey]; // check if current market key exist as key in marketCategories
  }) // O(n*1) ==> O(n)
}
function sortMarkets(markets) {
  return markets.sort(compare); // O(n log(n)) for big arrays (>10 length) V8 JavaScript engine that powers Chrome and Node.js. according to https://v8.dev/blog/array-sort
}
function compare(a, b) {
  return (a[1].info.order > b[1].info.order) ? 1 : -1;
}
function getOutput(sortedMarkets) {
  return Object.fromEntries(sortedMarkets);
}

// Task 1 and 2 combined
// const marketCategoriesKeys = getKeys(db);
// const output =
//   Object.fromEntries(
//     Object.entries(db.markets)   // O(n)
//       .filter((market) => marketCategoriesKeys[market[0]]) // O(n*1) ==> O(n)
//       .sort((a, b) => ((a[1].info.order > b[1].info.order) ? 1 : -1)) // O(n log(n)) for big arrays (>10 length) V8 JavaScript engine that powers Chrome and Node.js.
//   )
// Total time complexity: average O(n.logn), worst O(n^2)
// console.log(output);
