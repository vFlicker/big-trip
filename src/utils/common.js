export const render = (container, block, position) => {
  container.insertAdjacentHTML(position, block);
};