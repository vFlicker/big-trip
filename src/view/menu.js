import AbstractView from './abstract';
import {MenuItem} from '../const';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
    </nav>`
);

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setClickHandler(callback) {
    this._callback.menuClick = callback;

    this
      .getElement()
      .addEventListener('click', this._clickHandler);
  }

  setItem(menuItem) {
    const items = this._getMenuItems();

    items.forEach((item) => {
      if (item.dataset.menuItem === menuItem) {
        item.classList.add('trip-tabs__btn--active');
      } else {
        item.classList.remove('trip-tabs__btn--active');
      }
    });
  }

  enable() {
    const menuItems = this._getMenuItems();

    menuItems.forEach((menuItem) => {
      menuItem.classList.remove('trip-tabs__btn--disabled');
    });
  }

  disable() {
    const menuItems = this._getMenuItems();

    menuItems.forEach((menuItem) => {
      menuItem.classList.add('trip-tabs__btn--disabled');
    });
  }

  _clickHandler(evt) {
    if (
      evt.target.tagName !== 'A' ||
      evt.target.classList.contains('trip-tabs__btn--active')
    ) {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  _getMenuItems() {
    return this.getElement().querySelectorAll('.trip-tabs__btn');
  }
}
