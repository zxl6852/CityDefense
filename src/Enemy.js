export default function Enemy(path, enemySpeed, enemyHp, money, boomM, hp, enemyDie, restoreUp, hit) {
    return {
        Extends: Phaser.GameObjects.Image,
        initialize:

            function Enemy(scene) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy');


                //跟隨者對象 ， t 爲相對於路線 0~1 的數字 、 vec 則是各個時間點的座標
                this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            },
        //將敵人放置在我們路徑的第一點
        startOnPath: function () {
            //在路徑的開頭設置t參數
            this.follower.t = 0;
            //得到給定t點的x和y
            path.getPoint(this.follower.t, this.follower.vec);
            //將敵人的x和y設置為上一步接收到的的
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            //血量
            this.hp = enemyHp.getHp();
        },
        receiveDamage: function (damage) {
            this.hp -= damage;

            if (this.hp <= 0) {
                this.setActive(false);
                this.setVisible(false);
                //獲得錢
                money.earnMoney(10);
                boomM.play();
                if (hp.hp <= 100) hp.earnHp(restoreUp.get());
                enemyDie.earn(1);
            }

        },
        update: function (time, delta) {
            //沿路徑移動t點，0為起點，1為終點
            this.follower.t += enemySpeed * delta;
            //在vec中獲取新的x和y坐標
            path.getPoint(this.follower.t, this.follower.vec);
            //將敵人x和y更新為新獲得的x和y
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            //如果我們已經走到了盡頭，請移走敵人
            if (this.follower.t >= 1) {
                this.setActive(false);
                this.setVisible(false);
                hp.costHp(10);
                hit.play();
            }
        }
    }

};
