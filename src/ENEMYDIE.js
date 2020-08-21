export default class ENEMYDIE {
  constructor(enemyDie) {
    this.enemyDies = enemyDie;
    this.enemyDie = enemyDie;
  }
  get() {
    return this.enemyDies;
  }
  earn(enemyDie) {
    this.enemyDies += enemyDie;
    this.enemyDie++;
  }
  reset() {
    this.enemyDies = 0;
    this.enemyDie = 0;
  }
}