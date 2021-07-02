import AbstractView from './abstract';
import { MenuItem } from '../const';

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    if (
      evt.target.tagName !== 'A' ||
      evt.target.classList.contains('trip-tabs__btn--active')
    ) {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;

    this
      .getElement()
      .addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const items = this
      .getElement()
      .querySelectorAll('.trip-tabs__btn');

    items.forEach((item) => {
      if (item.dataset.menuItem === menuItem) {
        item.classList.add('trip-tabs__btn--active');
      } else {
        item.classList.remove('trip-tabs__btn--active');
      }
    });
  }
}
