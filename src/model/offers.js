export default class Offers {
  constructor() {
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }
}
