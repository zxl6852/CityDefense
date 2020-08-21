

export default function Turret(enemies, bullets, map, btm) {
    return {
        Extends: Phaser.GameObjects.Image,
        initialize:
            function Turret(scene) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Turrets');
                this.nextTic = 0;
            },
        //根據網格放置砲塔
        place: function (i, j) {
            map[i][j] = 1;  //這個要放第一行才能執行，目前找不到原因
            this.y = i * 64 + 64 / 2;
            this.x = j * 64 + 64 / 2;
        },
        fire: function () {

            //偵測敵人是否到半徑的範圍(第三個參數)
            let enemy = getEnemy(this.x, this.y, 500)
            if (enemy) {
                btm.play();
                let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                addBullet(this.x, this.y, angle);
                //砲塔轉角度 PI 圓的周長與其直徑之比，RAD_TO_DEG 用於將弧度轉換為度數（180 / PI）
                this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
            }
        },
        update: function (time, delta) {
            //每秒射擊
            if (time > this.nextTic) {
                this.fire();
                this.nextTic = time + 1000;
            }
        }
    }

    //敵人半徑
    function getEnemy(x, y, distance) {
        let enemyUnits = enemies.getChildren();
        //看每個敵人有沒有<=塔的半徑內
        for (let i = 0; i < enemyUnits.length; i++) {
            if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
                return enemyUnits[i];
        }
        return false;
    }

    //發射子彈
    function addBullet(x, y, angle) {
        let bullet = bullets.get();
        if (bullet) {
            bullet.fire(x, y, angle);
        }
    }
};

