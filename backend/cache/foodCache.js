// Simple in-memory cache for food data
let foodData = [];
let foodCategory = [];

function setFoodData(items, categories) {
  foodData = Array.isArray(items) ? items : [];
  foodCategory = Array.isArray(categories) ? categories : [];
}

function getFoodData() {
  return { items: foodData, categories: foodCategory };
}

module.exports = { setFoodData, getFoodData };
