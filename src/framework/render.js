import { AbstractView } from './view';

/**
 * @enum {string} list of possible render positions
 */
export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 * Function for creating an element based on markup
 * @param {string} template markup as a string
 * @returns {HTMLElement} created element
 */
export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

/**
 * Function for drawing an element
 * @param {AbstractView} component component that should have been rendered
 * @param {HTMLElement} container element in which the component will be rendered
 * @param {string} place position of the component relative to the container. Default - `beforeend`
 */
export const render = (component, container, place = RenderPosition.BEFOREEND) => {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can render only components');
  }

  if (container === null) {
    throw new Error('Container element doesn\'t exist');
  }

  container.insertAdjacentElement(place, component.element);
};

/**
 * Function to replace one component with another
 * @param {AbstractView} newComponent component to show
 * @param {AbstractView} oldComponent component to hide
 */
export const replace = (newComponent, oldComponent) => {
  if (!(newComponent instanceof AbstractView && oldComponent instanceof AbstractView)) {
    throw new Error('Can replace only components');
  }

  const newElement = newComponent.element;
  const oldElement = oldComponent.element;

  const parent = oldElement.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newElement, oldElement);
};

/**
 * Function to remove a component
 * @param {AbstractView} component - component that should be removed
 */
export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};
