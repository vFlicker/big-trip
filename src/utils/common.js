export const ucFirst = (string) => {
  if (!string) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
};

export const cloneArrayOfObjects = (array) => {
  return array.map((obj) => Object.assign({}, obj));
};
