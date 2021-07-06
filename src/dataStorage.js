export default class DataStore {
  static set setDestinations(destinations) {
    this._destinations = destinations;
  }

  static set setOffers(offers) {
    this._offers = offers;
  }

  static get getDestinations() {
    return this._destinations;
  }

  static get getOffers() {
    return this._offers;
  }
}
