export default function Bullet(bulletSpeed) {
    return {
        Extends: Phaser.GameObjects.Image,
        initialize:
            function Bullet(scene) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

                this.dx = 0;
                this.dy = 0;
                //壽命
                this.lifespan = 0;
                //計算在給定時間內跨越一定距離所需的速度(移動距離,時間)
                // this.speed = Phaser.Math.GetSpeed(bulletSpeed.bulletSpeed, 1);
            },

        fire: function (x, y, angle) {
            this.setActive(true);
            this.setVisible(true);

            //子彈從屏幕中間發射到給定的x / y
            this.setPosition(x, y);

            //我們不需要旋轉子彈，因為它們是圓形的
            //  this.setRotation(angle);

            //朝偵測到敵人的位置飛過去
            //餘弦值
            this.dx = Math.cos(angle);
            //正弦值
            this.dy = Math.sin(angle);

            //子彈速度越快、子彈存活時間越長就可以達到越遠的敵人
            this.lifespan = 600;
        },

        update: function (time, delta) {
            this.speed = Phaser.Math.GetSpeed(bulletSpeed.bulletSpeed, 1);
            this.lifespan -= delta;

            this.x += this.dx * (this.speed * delta);
            this.y += this.dy * (this.speed * delta);

            if (this.lifespan <= 0) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    }
};
