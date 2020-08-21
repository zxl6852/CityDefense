export default class Money {
  constructor(money) {
    this.money = money;
  }
  getMoney() {
    return this.money;
  }
  earnMoney(money) {
    this.money += money;
  }
  costMoney(money) {
    this.money -= money;
  }
  reset() {
    this.money = 200;
  }
}