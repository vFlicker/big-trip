import { getRandomValueFromArray, getRandomItems, getRandomInteger } from './utils';

const getName = () => {
  const destantionNames = new Set(['Amsterdam', 'Geneva', 'Chamonix', 'Saint Petersburg', 'Salzburg', 'Washington', 'Cairo', 'Galway', 'Bonn', 'La Paz', 'Kochi', 'Vancouver', 'Dubai', 'Denver']);
  const name = getRandomValueFromArray(Array.from(destantionNames));

  destantionNames.delete(name);
  return name;
};

const getDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  ];

  return getRandomItems(description).join(' ');
};

const generatePhotos = () => {
  const randomSize = getRandomInteger(1, 3);

  return new Array(randomSize)
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

export const getDestantions = () => {
  return {
    name: getName(),
    description: getDescription(),
    photos: generatePhotos(),
  };
};
