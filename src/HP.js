export default class HP {
  constructor(hp) {
    this.hp = hp;
  }
  getHp() {
    return this.hp;
  }
  earnHp(hp) {
    this.hp += hp;
  }
  costHp(hp) {
    this.hp -= hp;
  }
  reset() {
    this.hp = 100;
  }
}