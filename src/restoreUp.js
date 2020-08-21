export default class restoreUp {
  constructor(restoreUp) {
    this.restoreUp = restoreUp;
  }
  get() {
    return this.restoreUp;
  }
  earn(restoreUp) {
    this.restoreUp += restoreUp;
  }
  reset() {
    this.restoreUp = 5;
  }
}