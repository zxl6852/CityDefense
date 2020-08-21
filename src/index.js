import Phaser from "phaser";
import Enemy from './Enemy.js';
import Turret from './Turret.js';
import Bullet from './Bullet.js';
import Money from './Money';
import HP from './HP';
import enemyHps from './enemyHp';
import EnemyDie from './ENEMYDIE';
import bulletSpeeds from './bulletSpeed';
import restoreUps from './restoreUp';


let BULLET_DAMAGE = 50;
let bulletSpeed = new bulletSpeeds(600);
let restoreUp = new restoreUps(5);
let pathGrap;
let path;
let enemySpeed = 1 / 10000;
let hp = new HP(100);
let enemyHp = new enemyHps(200);
let hpText;
let timePM = 0;
let enemies;
let grid;
let turrets;
let bullets;
let money = new Money(200);
let moneyText;
let hit;
let grounds;
let bgm, btm, boomM;
let polv = 1, splv = 1, dilv = 1;
let polvT, splvT, dilvT;
let poM = 50, spM = 40, diM = 30, tuM = 50;
let poMT, spMT, diMT, tuMT;
let enemyDieText;
let enemyDie = new EnemyDie(0);
let chapter = 1;
let hsv, textTint = 0;
let downBar1, downBar2, downBar3, downBar4;

//-1是路線
let map = [
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0]
];

//遊戲開始
class Openstate extends Phaser.Scene {

  constructor() {
    super('Openstate');
  }

  preload() {
    const imPath = 'assets/images/';
    const muPath = 'assets/musics/';
    this.load.image('start', imPath + 'start.jpg');
    this.load.image('citydefend', imPath + 'citydefend.png');
    this.load.image('go', imPath + 'go.png');
    this.load.audio('op', muPath + 'op.mp3');
    this.load.audio('click', muPath + 'click.wav');
  }

  create() {
    const op = this.sound.add('op');
    op.setLoop(true);
    op.play();

    this.add.image(320, 288, 'start');
    this.add.image(320, 120, 'citydefend');

    //文字閃爍
    const go = this.add.image(320, 420, 'go');
    // const go = this.add.sprite(320, 420, 'go');
    const frame = this.textures.getFrame('go');

    let graphicss = this.add.graphics({
      x: go.x - go.width / 2,
      y: go.y - go.height / 2
    })
      .fillStyle(0xffff00, 0.75)
      .setTexture('go', undefined, 1)
      .fillRect(frame.x, frame.y, frame.cutWidth, frame.cutHeight);

    this.tweens.add({
      targets: graphicss,
      alpha: 0,
      ease: 'Cubic.easeOut',
      duration: 500,
      repeat: -1,
      yoyo: true
    })

    go.setInteractive({ cursor: 'pointer' });

    go.on('pointerover', function () {
      go.setAlpha(0.5);
      go.setTint(0xff0000);
    }, this);
    go.on('pointerout', function () {
      go.setAlpha(1);
      go.clearTint();
    }, this);
    go.on('pointerdown', function () {
      go.setAlpha(0.3);

    }, this);
    go.once('pointerup', function () {
      go.setAlpha(1);
      graphicss.setTexture(undefined);
      op.stop();
      this.sound.add('click').play();
      const flash = setInterval(() => {
        this.cameras.main.flash();
      }, 100);
      setTimeout(() => {
        clearInterval(flash);
      }, 500);
      setTimeout(() => {
        this.scene.start('Startstate');
      }, 1000);
    }, this);
  }
}

//遊戲中
class Startstate extends Phaser.Scene {

  constructor() {
    super('Startstate');
  }

  preload() {
    const imPath = 'assets/images/';
    const muPath = 'assets/musics/';

    this.load.image('enemy', imPath + 'enemy.png');
    this.load.image('Turrets', imPath + 'Turret.png');
    //子彈
    this.load.image('bullet', imPath + 'bullet.png');
    //綠地
    this.load.image('greenGround', imPath + 'greenGround.jpg');
    //石地
    this.load.image('stoneFloor', imPath + 'stoneFloor.png');
    this.load.image('boom', imPath + 'boom.png');
    this.load.image('downBar1', imPath + 'downBar1.jpg');
    this.load.image('downBar2', imPath + 'downBar2.jpg');
    this.load.image('downBar3', imPath + 'downBar3.jpg');
    this.load.image('downBar4', imPath + 'downBar4.jpg');
    this.load.image('upup', imPath + 'upup.png');

    //背景音樂
    this.load.audio('bgm', muPath + 'bg.mp3');
    //子彈
    this.load.audio('btm', muPath + 'bullet.mp3');
    //敵人死亡
    this.load.audio('boom', muPath + 'boom.wav');
    this.load.audio('upEffect', muPath + 'upEffect.mp3');
    this.load.audio('hit', muPath + 'hit.mp3');


  }
  create() {
    //背景音樂
    bgm = this.sound.add('bgm');
    btm = this.sound.add('btm');
    boomM = this.sound.add('boom');
    this.upEffect = this.sound.add('upEffect');
    hit = this.sound.add('hit');

    bgm.play();
    bgm.setLoop(true);

    btm.setVolume(0.2);
    boomM.setVolume(0.3);

    grounds = this.physics.add.staticGroup();
    grounds.create(300, 200, 'greenGround');
    grounds.create(96, 96, 'stoneFloor');

    //石路
    for (let i = 1; i <= 6; i++) {
      if (i <= 3) {
        grounds.create(96, 96 + 64 * i, 'stoneFloor');
      } else {
        grounds.create(480, 96 + 64 * i, 'stoneFloor');
      }
      grounds.create(96 + 64 * i, 288, 'stoneFloor');
    }

    //網格
    grid = this.add.graphics();
    drawGrid(grid);


    pathGrap = this.add.graphics();
    //路線
    path = this.add.path(96, 64);
    path.lineTo(96, 288);
    path.lineTo(480, 288);
    path.lineTo(480, 544);
    pathGrap.lineStyle(3, 0xffffff, 1);
    path.draw(pathGrap);
    pathGrap.setVisible(false);

    // 下面四個
    downBar1 = this.add.image(80, 542, 'downBar1').setDepth(2);
    downBar2 = this.add.image(240, 542, 'downBar2').setDepth(2);
    downBar3 = this.add.image(400, 542, 'downBar3').setDepth(2);
    downBar4 = this.add.image(560, 542, 'downBar4').setDepth(2);
    //lv
    polvT = this.add.text(115, 513, polv, { font: "20px Arial Black", fill: "#fff" }).setDepth(2);
    splvT = this.add.text(275, 513, splv, { font: "20px Arial Black", fill: "#fff" }).setDepth(2);
    dilvT = this.add.text(435, 513, dilv, { font: "20px Arial Black", fill: "#fff" }).setDepth(2);
    //錢
    poMT = this.add.text(105, 545, poM, { font: "20px Arial Black", fill: "#fff" }).setDepth(2);
    spMT = this.add.text(265, 545, spM, { font: "20px Arial Black", fill: "#fff" }).setDepth(2);
    diMT = this.add.text(425, 545, diM, { font: "20px Arial Black", fill: "#fff" }).setDepth(2);
    tuMT = this.add.text(583, 530, tuM, { font: "20px Arial Black", fill: "#fff" }).setDepth(2);

    this.upup = this.add.image(320, 290, 'upup').setVisible(false);

    downBar1.addListener('pointerup', function () {
      polv++;
      BULLET_DAMAGE += 5;
      money.money -= poM;
      this.upEffect.play();
      let t = setInterval(() => {
        this.upup.setVisible(true);
      }, 100);
      setTimeout(() => {
        clearInterval(t);
        this.upup.setVisible(false);
      }, 800);
    }, this);

    downBar2.addListener('pointerup', function () {
      splv++;
      bulletSpeed.earn(50);
      money.money -= spM;
      this.upEffect.play();
      let t = setInterval(() => {
        this.upup.setVisible(true);
      }, 100);
      setTimeout(() => {
        clearInterval(t);
        this.upup.setVisible(false);
      }, 800);
    }, this);

    downBar3.addListener('pointerup', function () {
      dilv++;
      restoreUp.earn(1);
      money.money -= diM;
      this.upEffect.play();
      let t = setInterval(() => {
        this.upup.setVisible(true);
      }, 100);
      setTimeout(() => {
        clearInterval(t);
        this.upup.setVisible(false);
      }, 800);
    }, this);


    //煥彩
    hsv = Phaser.Display.Color.HSVColorWheel();

    //血量
    hpText = this.add.text(10, 10, 'HP: ${hp.getHp()}', { font: "32px Arial Black", fill: "#fff" });
    // hpText.setStroke('#00f', 10);
    hpText.setShadow(2, 2, "#333333", 2, true, true);

    //關卡
    this.chapter = this.add.text(150, 10, '關卡:${chapter}', { font: "32px Arial Black", fill: "#fff" });
    // this.chapter.setStroke('#00f', 10);
    this.chapter.setShadow(2, 2, "#333333", 2, true, true);

    //殺敵數
    enemyDieText = this.add.text(280, 10, '殺敵數:${enemyDie}', { font: "32px Arial Black", fill: "#fff" });
    // enemyDieText.setStroke('#00f', 10);
    enemyDieText.setShadow(2, 2, "#333333", 2, true, true);

    //錢
    moneyText = this.add.text(470, 10, '$:${money.getMoney()}', { font: "32px Arial Black", fill: "#fff" });
    // moneyText.setStroke('#00f', 10);
    moneyText.setShadow(2, 2, "#333333", 2, true, true);

    //敵人
    let myEnemy = new Phaser.Class(Enemy(path, enemySpeed, enemyHp, money, boomM, hp, enemyDie, restoreUp, hit));
    enemies = this.physics.add.group({ classType: myEnemy, runChildUpdate: true });
    this.nextEnemy = 0;

    //子彈
    let myBullets = new Phaser.Class(Bullet(bulletSpeed));
    bullets = this.physics.add.group({ classType: myBullets, runChildUpdate: true });

    //砲塔
    let myTurrets = new Phaser.Class(Turret(enemies, bullets, map, btm));
    turrets = this.add.group({ classType: myTurrets, runChildUpdate: true });

    //滑鼠按下
    this.input.on('pointerdown', placeTurret);

    //子彈碰到敵人
    this.physics.add.overlap(enemies, bullets, damageEnemy.bind(this));

  }
  update(time, delta) {
    if (timePM === 0) {
      timePM = 1;
      setTimeout(() => {
        money.earnMoney(10);
        timePM = 0;
      }, 1000);
    }

    //錢夠時炫彩
    let top = hsv[textTint].color;
    let bottom = hsv[359 - textTint].color;
    if (poM <= money.money) {
      downBar1.setTint(top, top, bottom, bottom);
      downBar1.setInteractive({ cursor: 'pointer' });
    } else {
      downBar1.clearTint();
      downBar1.disableInteractive();
    }
    if (spM <= money.money) {
      downBar2.setTint(top, bottom, top, bottom);
      downBar2.setInteractive({ cursor: 'pointer' });
    } else {
      downBar2.clearTint();
      downBar2.disableInteractive();
    }
    if (diM <= money.money) {
      downBar3.setTint(bottom, bottom, top, bottom);
      downBar3.setInteractive({ cursor: 'pointer' });
    } else {
      downBar3.clearTint();
      downBar3.disableInteractive();
    }
    if (tuM <= money.money) {
      downBar4.setTint(top, bottom, top, top);
    } else {
      downBar4.clearTint();
    }

    textTint++;
    if (textTint === 360) {
      textTint = 0;
    }

    //每殺3隻+一關
    if (enemyDie.enemyDie === 3) {
      chapter++;
      enemyDie.enemyDie = 0;
      poM += 5, spM += 5, diM += 5, tuM += 5;
      enemyHp.earnHp(50);
    }

    //如果是下一個敵人的時間
    if (time > this.nextEnemy) {
      let enemy = enemies.get();
      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);

        //將敵人放在道路的起點
        enemy.startOnPath();

        //控制敵人距離
        this.nextEnemy = time + 2000;
      }
    }
    moneyText.setText(`$:${money.getMoney()}`);
    if (hp.hp <= 100) hpText.setText(`HP:${hp.getHp()}`);
    if (hp.hp > 100) hpText.setText(`HP:${100}`);
    enemyDieText.setText(`殺敵數:${enemyDie.get()}`);
    this.chapter.setText(`關卡:${chapter}`);

    polvT.setText(polv);
    splvT.setText(splv);
    dilvT.setText(dilv);

    poMT.setText(poM);
    spMT.setText(spM);
    diMT.setText(diM);
    tuMT.setText(tuM);


    if (hp.hp <= 0) {
      this.scene.start('Endstate');
    }
  }


};

function drawGrid(graphics) {
  graphics.lineStyle(1, 0x0000ff, 0.8);
  //橫線
  for (let i = 2; i < 8; i++) {
    graphics.moveTo(0, i * 64);
    graphics.lineTo(640, i * 64);
  }
  //直線
  for (let j = 0; j < 10; j++) {
    graphics.moveTo(j * 64, 64);
    graphics.lineTo(j * 64, 512);
  }
  graphics.strokePath();
  graphics.alpha = 0.4;
}

function placeTurret(pointer) {
  //取得位置
  if (pointer.y >= 64) {
    let i = Math.floor(pointer.y / 64);
    let j = Math.floor(pointer.x / 64);


    if (map[i][j] === 0 && money.getMoney() >= tuM) {
      let turret = turrets.get();
      if (turret) {
        money.costMoney(tuM);
        turret.place(i, j);
        turret.setActive(true);
        turret.setVisible(true);
      }
    }
  }
}

function damageEnemy(enemy, bullet) {
  if (enemy.active === true && bullet.active === true) {
    bullet.setActive(false);
    bullet.setVisible(false);

    const boom = this.add.image(bullet.x, bullet.y, 'boom');
    const boomTime = setTimeout(function () {
      boom.setActive(false);
      boom.setVisible(false);
      boom.destroy();
      clearTimeout(boomTime);
    }, 100)

    enemy.receiveDamage(BULLET_DAMAGE);
  }
}

//初始化數據
function init() {
  hp.reset();
  chapter = 1;
  enemyDie.reset();
  money.reset();
  BULLET_DAMAGE = 50;
  bulletSpeed.reset();
  restoreUp.reset();
  poM = 50, spM = 40, diM = 30, tuM = 50;
  enemyHp.reset();
  map = [
    [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0]
  ];
}

//遊戲結束
class Endstate extends Phaser.Scene {

  constructor() {
    super('Endstate');
  }

  preload() {
    const imPath = 'assets/images/';
    const muPath = 'assets/musics/';
    this.load.image('GameOver', imPath + 'GameOver.png');
    this.load.image('btAgain', imPath + 'button_again.png');
    this.load.image('btEnd', imPath + 'button_end.png');
    this.load.image('endBg', imPath + 'end.jpg');
    this.load.audio('end', muPath + 'end.mp3');
  }
  create() {
    bgm.stop();
    this.end = this.sound.add('end');
    this.end.setVolume(0.3);
    this.end.play();
    this.add.image(320, 288, 'endBg');
    this.add.image(320, 200, 'GameOver');


    //關卡
    this.chapter = this.add.text(90, 30, `關卡: ${chapter}`, { font: "40px Arial Black", fill: "#fff" });
    this.chapter.setShadow(2, 2, "#333333", 2, true, true);

    //殺敵數
    enemyDieText = this.add.text(300, 30, `殺敵數: ${enemyDie.get()}`, { font: "40px Arial Black", fill: "#fff" });
    enemyDieText.setShadow(2, 2, "#333333", 2, true, true);

    let btAgain = this.add.image(220, 330, 'btAgain');
    let btEnd = this.add.image(420, 330, 'btEnd');
    btAgain.setInteractive({ cursor: 'pointer' });
    btAgain.once('pointerup', function () {
      init();
      this.scene.start('Startstate');
    }, this);
    btAgain.addListener('pointermove', function () {
      btAgain.setAlpha(0.8);
      btAgain.setTint(0xffff00);
    }, this);
    btAgain.addListener('pointerout', function () {
      btAgain.setAlpha(1);
      btAgain.clearTint();
    }, this);
    btAgain.addListener('pointerdown', function () {
      btAgain.setAlpha(0.5);
    }, this);

    btEnd.setInteractive({ cursor: 'pointer' });
    btEnd.once('pointerup', function () {
      window.location.reload();
    }, this);
    btEnd.addListener('pointermove', function () {
      btEnd.setAlpha(0.8);
      btEnd.setTint(0xff0000);
    }, this);
    btEnd.addListener('pointerout', function () {
      btEnd.setAlpha(1);
      btEnd.clearTint();
    }, this);
    btEnd.addListener('pointerdown', function () {
      btEnd.setAlpha(0.5);
    }, this);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "content",
  width: 640,
  // height: 512,
  height: 576,
  physics: {
    default: 'arcade'
  },
  scale: {
    // mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    Openstate,
    Startstate,
    Endstate,
  ],
};

const game = new Phaser.Game(config);