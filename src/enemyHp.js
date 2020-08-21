export default class enemyHp {
  constructor(enemyHp) {
    this.enemyHp = enemyHp;
  }
  getHp() {
    return this.enemyHp;
  }
  earnHp(enemyHp) {
    this.enemyHp += enemyHp;
  }
  costHp(enemyHp) {
    this.enemyHp -= enemyHp;
  }
  reset() {
    this.enemyHp = 200;
  }
}