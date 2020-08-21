let map = [
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0]
];

export default class Map {
  constructor(path, graphics) {
    this.path = path
    this.graphics = graphics
    this.drawGrid(graphics)
    this.drawRoute(path, graphics)
  }

  drawRoute(path, graphics) {
    //線的路徑
    path.lineTo(96, -32);
    path.lineTo(96, 164);
    path.lineTo(480, 164);
    path.lineTo(480, 544);
    //線的樣式
    graphics.lineStyle(3, 0xffffff, 1);
    //畫線
    path.draw(graphics);
  }
  drawGrid(graphics) {
    //畫格子的數量(數量決定可以放的炮塔)
    graphics.lineStyle(1, 0x000ff, 0.8)
    for (var i = 0; i < 8; i++) {
      //從座標(0,64)畫到(640,64)，以此類推
      graphics.moveTo(0, i * 64)
      graphics.lineTo(640, i * 64)
    }
    //從座標(64,0)畫到(64,512)，以此類推
    for (var j = 0; j < 10; j++) {
      graphics.moveTo(j * 64, 0)
      graphics.lineTo(j * 64, 512)
    }
    graphics.strokePath()
  }
  placeTurret(pointer, turrets, money, cost) {
    var i = Math.floor(pointer.y / 64)
    var j = Math.floor(pointer.x / 64)
    if (map[i][j] === 0 && money.getMoney() > cost) {
      var turret = turrets.get()
      if (turret) {
        turret.setActive(true);
        turret.setVisible(true);
        turret.place(i, j)
        map[i][j] = 1
        money.costMoney(cost)
      }
    }
  }
}