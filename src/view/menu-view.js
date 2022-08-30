import { AbstractView } from '../framework';
import { MenuItem } from '../const';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
    </nav>`
);

export default class MenuView extends AbstractView {
  get template() {
    return createMenuTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.menuClick = callback;

    this
      .element
      .addEventListener('click', this.#clickHandler);
  };

  setItem = (menuItem) => {
    const items = this.#getMenuItems();

    items.forEach((item) => {
      if (item.dataset.menuItem === menuItem) {
        item.classList.add('trip-tabs__btn--active');
      } else {
        item.classList.remove('trip-tabs__btn--active');
      }
    });
  };

  enable = () => {
    const menuItems = this.#getMenuItems();

    menuItems.forEach((menuItem) => {
      menuItem.classList.remove('trip-tabs__btn--disabled');
    });
  };

  disable = () => {
    const menuItems = this.#getMenuItems();

    menuItems.forEach((menuItem) => {
      menuItem.classList.add('trip-tabs__btn--disabled');
    });
  };

  #clickHandler = (evt) => {
    if (
      evt.target.tagName !== 'A' ||
      evt.target.classList.contains('trip-tabs__btn--active')
    ) {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  };

  #getMenuItems = () => this.element.querySelectorAll('.trip-tabs__btn');
}
