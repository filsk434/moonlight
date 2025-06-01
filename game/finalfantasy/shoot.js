function getAngle() {
    let angle = 0;
    if (player.RightFacing) {
        angle = 0;
    } else if (player.UpFacing) {
        angle = 270;
    } else if (player.LeftFacing) {
        angle = 180;
    } else if (player.DownFacing) {
        angle = 90;
    }
    return angle;
}

// Unit shoot
function shootArrow() {
    // Set angle based on the player's facing direction
    let angle = getAngle();
    drawBullet(player.x, player.y, angle);
}

function newBullet(x, y, speed, angle) {
    this.x = x + player.width / 2;
    this.y = y + player.height / 2;
    this.speed = speed;
    this.angle = angle;
    this.radians = angle * Math.PI / 180;
    this.height = 4;
    this.width = 30;
    this.moveBullet = moveBullet;
}

function moveBullet() {
    // Move bullet based on calculated angle
    this.x += Math.cos(this.radians) * this.speed;
    this.y += Math.sin(this.radians) * this.speed;

    // Draw bullet based on angle
    if (this.angle === 270) {
        context.drawImage(bulletImg_north, this.x, this.y);
    } else if (this.angle === 0) {
        context.drawImage(bulletImg_east, this.x, this.y);
    } else if (this.angle === 90) {
        context.drawImage(bulletImg_south, this.x, this.y);
    } else if (this.angle === 180) {
        context.drawImage(bulletImg_west, this.x, this.y);
    }
}

function drawBullet(unitX, unitY, angle) {
    let bullet = new newBullet(unitX, unitY, 10, angle);
    bullets.push(bullet);
    setInterval(() => bullet.moveBullet(), 25);
}

function arrowHit() {
    if (arrow_flying) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            let bullet = bullets[i];
            let arrow_index = Math.floor((bullet.y + scaled_size * 0.5) / scaled_size) * columns + Math.floor((bullet.x + scaled_size * 0.5) / scaled_size);

            if (bullet.x < 0 || bullet.x >= width || bullet.y < 0 || bullet.y >= height) {
                popBullet(i);
                continue;
            }

            if (currentMap[arrow_index] != 3) {
                context.drawImage(bulletImg, bullet.x, bullet.y - 16);
            } else {
                popBullet(i);
            }

            if (isCollide(bullet, enemy) && !enemyHit) {
                enemy.hp -= 5;
                popBullet(i);
                enemyHit = true;
                continue;
            }
            if (isCollide(bullet, enemy3) && !enemyHit) {
                enemy3.hp -= 5;
                popBullet(i);
                enemyHit = true;
                continue;
            }

            enemyHit = false;
        }
    }
}

function popBullet(index) {
    bullets.splice(index, 1);
}
