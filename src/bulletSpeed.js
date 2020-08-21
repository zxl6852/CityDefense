export default class bulletSpeed {
  constructor(bulletSpeed) {
    this.bulletSpeed = bulletSpeed;
  }
  get() {
    return this.bulletSpeed;
  }
  earn(bulletSpeed) {
    this.bulletSpeed += bulletSpeed;
  }
  reset() {
    this.bulletSpeed = 600;
  }
}