const MIN_PRICE = 100;
const MAX_PRICE = 500;

const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const shuffleArray = (items) => {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index--) {
    const randomIndex = getRandomInteger(0, index);
    const swap = shuffledItems[index];
    shuffledItems[index] = shuffledItems[randomIndex];
    shuffledItems[randomIndex] = swap;
  }

  return shuffledItems;
};

const getRandomValueFromArray = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

const getRandomItems = (items) => {
  const randomLength = getRandomInteger(1, items.length);
  const shuffledItems = shuffleArray(items);
  return shuffledItems.slice(0, randomLength);
};

export {
  MIN_PRICE,
  MAX_PRICE,
  getRandomInteger,
  shuffleArray,
  getRandomValueFromArray,
  getRandomItems
};
