function getAngle() {
    if(player.RightFacing) {
        angle = 0;
    }
    if(player.UpFacing) {
        angle = 270; //it works..
    }
    if(player.LeftFacing) {
        angle = 180;
    }

    if(player.DownFacing) {
        angle = 90; //it works..
    }
    return angle;
}

//Unit shoot
function shootArrow(unitX,unitY) {
    console.log('pew');
    drawBullet(unitX,unitY);
}

function newBullet(x, y, speed, angle, id, type) {
    this.x = x + player.height /2;
    this.y = y + player.width/2;
    this.speed = speed;
    this.angle = angle;
    this.radians = this.angle * Math.PI / 180;
    this.id = id;
    this.type = type;
    this.height = 4;
    this.width = 30;
    this.drawBullet = drawBullet;
    this.moveBullet = moveBullet;
}

function moveBullet() {
    this.x = this.x + Math.cos(this.radians) * this.speed;
    this.y = this.y + Math.sin(this.radians) * this.speed;
    
    arrow_flying = true;
    
    context.drawImage(bulletImg, this.x, this.y);
}

function drawBullet(unitX,unitY) {
    var bullet = new newBullet(unitX, unitY, 10, getAngle(),2,1,1);
    bullets.push(bullet);
    setInterval(bullets[bullets.length - 1].moveBullet.bind(bullets[bullets.length -1]), 25);
}

function popBullet(index) {
    bullets.splice(index,1);
}

function arrowHit() {
    //player shoot arrow 
    if(arrow_flying) {
        for (let i = 0; i < bullets.length; i++) {
            var arrow_index = Math.floor((bullets[i].y + scaled_size * 0.5) / scaled_size)
         * columns + Math.floor((bullets[i].x + scaled_size * 0.5) /scaled_size);

            if(bullets[i].x < width && !enemyHit && currentMap[arrow_index] != 3) {
                context.drawImage(bulletImg, bullets[i].x, bullets[i].y-16)
            }
            if(bullets[i].x >=width - 186) {
                popBullet(i);
            }
            if(isCollide(bullets[i],enemy) && !enemyHit) { //arrow hit enemy
                enemy.hp -= 5;
                popBullet(i);
                enemyHit = true;
            }
            if(isCollide(bullets[i],enemy3) && !enemyHit) { //arrow hit enemy
                enemy3.hp -= 5;
                popBullet(i);
                enemyHit = true;
            }
           /*   if(isCollide(bullets[i],player)) { //arrow hit player
                player.hp -= 5;
                popBullet(i);
            } */
            else {
                enemyHit = false;
            }
        }
    }
}