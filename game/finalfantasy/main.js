const Player = function(x,y,hp,maxHealth) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.stop = false;
    this.maxHealth = maxHealth;
    this.height = 40;
    this.width = 40;
    this.LeftFacing = false;
    this.UpFacing = false;
    this.DownFacing = true;
    this.RightFacing = false;
}

const Potion = function(x,y) {
    this.x = x;
    this.y = y;
}

const Enemy = function(x,y,hp,maxHealth) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.stop = false;
    this.maxHealth = maxHealth;
    this.height = 36;
    this.width = 30;
    this.radius = 10;
}

const Dog = function(x,y,hp,maxHealth) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.stop = false;
    this.maxHealth = maxHealth;
    this.height = 36;
    this.width = 30;
    this.radius = 10;
}

var scaled_size = 42;
var sprite_size = 16; //tile size 16*16px
var columns = 20;
var rows = 16;
var columns2 = 20;
var rows2 = 16;

const playerHeight = 40;
const playerWidth = 40;

const enemyHeight = 36;
const enemyWidth = 30;

const enemyRadius = 10;

var context = document.querySelector("canvas").getContext("2d");

var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;

var previousMap = map2;
var currentMap = map1;

var player = new Player(100,100,100,100);
var potion = new Potion(500,50);
let enemy = new Enemy(500,200,40,40);
var enemy2 = new Enemy(600,500,40,40);
var greenGuy = new Enemy(700,300,20,40); 
var dog = new Dog(400,400,80,40);
var dog2 = new Dog(300,50,80,40);
var dog3 = new Dog(210,100,80,40);
var dog4 = new Dog(350,150,80,40);
var dog5 = new Dog(100,200,80,40);

var pointer = { x:0, y:0};

controller = {
    KeyF:false,
    space:false,
    down:false,
    left:false,
    right:false,
    up:false,
    shot:false,
    key_up:false,
    keyListener:function(event) {
        var key_down = (event.type == "keydown")?true:false;
        if(event.type == "keyup") {
            controller.shot = false;
        }
        switch(event.keyCode) {
        
        case 32://space key
            controller.space = key_down;
            console.log('x: ',player.x);
            console.log('y: ',player.y);
        break;
        case 40:// down key
            controller.down = key_down;
        break;
        case 37:// left key
            controller.left = key_down;
        break;
        case 38:// up key
            controller.up = key_down;
        break;
        case 39:// right key
            controller.right = key_down;
        break;
        case 70://F key
            controller.KeyF = key_down;
        break;
        }
    }
};

/* function drawFrame(frameX,frameY,canvasX,canvasY) {
    context.drawImage(img, frameX * width, frameY * height,width,height, canvasX, canvasY,scaledWidth,scaledHeight )
} */

var hpBar = {
    x: 20,
    y: 30,
    width: 100,
    height: 10
};

var health = 100;
var maxHealth = 100;
var percent = health / maxHealth;

function healthBar(x,y,person) {
    context.fillStyle = "black";
    context.fillRect(x, y -20, person.maxHealth/2, hpBar.height);

    context.fillStyle = "green";
    context.fillRect(x, y -20, person.hp/2, hpBar.height);
}

var bullets = [];
var bulletImg = new Image();
var arrow_flying = false;
var enemyHit = false;

var animateRight = 0;
var animateDown = 0;
var animateEnemyLR = 550;
var animateEnemyUD = 250; //250, 830
let animatePotion = 0;
let animateDogLR = 250; //250YelloDog
let animateDogUD = 150; //0 D, 50 L, 150R, 200 U
var dogWalk = [250,830];
let foundBow = false;

function isCollide(a,b) {
    return !(
      ((a.y + a.height) < (b.y)) ||
      (a.y > (b.y + b.height)) ||
      ((a.x + a.width) < b.x) ||
      (a.x > (b.x + b.width))
  );
  }

  function isInAggroRange(a,b) {
    return !(
        ((a.y + a.height + 100) < (b.y)) ||
        (a.y > (b.y + b.height) + 100) ||
        ((a.x + a.width + 100) < b.x) ||
        (a.x > (b.x + b.width + 100))
    );
  }

  function isCollideCircle(circle,rect) {
    circleDistanceX = Math.abs(circle.x - rect.x);
    circleDistanceY = Math.abs(circle.y - rect.y);
  
      if (circleDistanceX > (rect.width/2 + circle.r)) { return false; }
      if (circleDistanceY > (rect.height/2 + circle.r)) { return false; }
  
      if (circleDistanceX <= (rect.width/2)) { return true; } 
      if (circleDistanceY <= (rect.height/2)) { return true; }
  
      cornerDistance_sq = (circleDistanceX - rect.width/2)^2 +
                           (circleDistanceY - rect.height/2)^2;
  
      return (cornerDistance_sq <= (circle.r^2));
  }

  function magnetice(target,who) {
    if (who.x -40 < target.x) {
        who.x += 0.1;
        animateDogUD = 150;
    }
    if (who.x +40> target.x) {
        who.x -= 0.1;
        animateDogUD = 50;
    }
    if (who.y -40 < target.y) {
        who.y += 0.1;
        animateDogUD = 0;
    }
    if (who.y +40 > target.y) {
        who.y -= 0.1;
    }
}

faceLeft = true;
faceRight = false;

var fps = 60;   /// NTSC

function moveLeft() {
    player.x -= 2;
        animateDown = 36; //first row
        player.LeftFacing = true;
        player.RightFacing = false;
        player.UpFacing = false;
        player.DownFacing = false;

        if(animateRight >= 32) {
            animateRight = 0;
        }
        else {
            animateRight += 16;
        }
}

function moveRight() {
    player.x += 2;
        animateDown = 54; //first row
        player.LeftFacing = false;
        player.RightFacing = true;
        player.UpFacing = false;
        player.DownFacing = false;
        
        if(animateRight >= 32) {
            animateRight = 0;
        }
        else {
            animateRight += 16;
        }
}

function moveUp() {
    player.y -= 2;
        animateDown = 18; //first row
        player.LeftFacing = false;
        player.RightFacing = false;
        player.UpFacing = true;
        player.DownFacing = false;
        
        if(animateRight >= 32) {
            animateRight = 0;
        }
        else {
            animateRight += 16;
        }
}

function moveDown() {
    player.y += 2;
        animateDown = 0; //first row
        player.LeftFacing = false;
        player.RightFacing = false;
        player.UpFacing = false;
        player.DownFacing = true;
        
        if(animateRight >= 32) {
            animateRight = 0;
        }
        else {
            animateRight += 16;
        }
}

function action() {
    if(!controller.shot) {
        shootArrow(player.x, player.y);
    }
    controller.shot = true
}

/*
 * ******************************************************
 * //START OF GAME LOOP
 * ******************************************************
 */
function loop() {

setTimeout(() => {
    requestAnimationFrame(loop);
    }, 1000 / fps);


var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;

context.canvas.height = height;
context.canvas.width = width;

//make everything less pixelated
context.imageSmoothingEnabled = false;

let mapIndex = 0;
let sourceX = 0;
let sourceY = 0;
for(let x = 0; x < columns2; x++) {
    for(let y=0; y< rows2; y++) {
        let tileVal = currentMap[y*columns +x];
        sourceY = Math.floor(tileVal/columns2) * 32;
        sourceX = (tileVal % columns2) * 32;
        context.drawImage(tile_sheet5,sourceX,sourceY, 32, 32, x*42,y*42, scaled_size,scaled_size);
    }
}
//20 * 8

/* //player black box
context.fillStyle = "black";
context.fillRect(player.x,player.y,playerWidth,playerHeight); */

/* //enemy yellow box
context.fillStyle = "yellow";
context.fillRect(enemy.x,enemy.y,enemyWidth,enemyHeight); */

 //enemy aggro range
context.arc(enemy3.x+enemyWidth/2, enemy3.y+enemyHeight/2, 100, 0, Math.PI * 2, true);
context.stroke();

//if exit right
if(player.x == 818 && player.y >315 && player.y < 356) { //can do if in tile later on
    if(currentMap != map2) { //can do swap function later on
        previousMap = map1; //save prev
        currentMap = map2; //swap map
        player.x = 0; 
    }
    else if(currentMap = map2) {
        currentMap = previousMap;
        previousMap = map2
        player.x = 0;
    }
}

//if exit left
if(player.x == 0 && player.y>315 && player.y < 356 && controller.left) {
    if(currentMap != map2) { //can do swap function later on
        previousMap = map1; //save prev
        currentMap = map2; //swap map
        player.x = 780; 
    }
    else if(currentMap = map2) {
        currentMap = previousMap;
        previousMap = map2
        player.x = 780;
    }
}

    //draw healthbar
    healthBar(player.x,player.y,player);
    
    //draw potion
    if(!chugged && currentMap == map3) {
        
         if(animatePotion >= 204) {
            animatePotion = 0;
        }
        else {
            animatePotion += 51;
        }
        context.drawImage(tile_sheet2,animatePotion,0, sprite_size*3, sprite_size*4, potion.x,potion.y, scaled_size,scaled_size);
    } //0, 51, 102, 153, 204, 
    
    //potion interact
    if(player.x > 478 && player.x < 529 && player.y > 21 && player.y <68 && !chugged && currentMap == map3) {
        player.hp += 50;
        chugged = true;
   }

    if(!foundBow && currentMap == map3) {
        
        context.drawImage(tile_sheet7,0,0,60,60, 200,20, scaled_size*2,scaled_size*2);
        } //0, 51, 102, 153, 204, 
    
    if(player.x > 200 && player.x < 220 && player.y > 20 && player.y <28 && !foundBow && currentMap == map3) {
        foundBow = true;
    }


    //draw enemy
    if(enemy.hp>0 && currentMap == map1) {
        healthBar(enemy.x, enemy.y,enemy)
        context.drawImage(tile_sheet3,animateEnemyLR,40,200,500,enemy.x,enemy.y,30,50);
        //550
        //1150
    }

    //draw enemy2
    if(enemy2.hp>0 && currentMap == map1) {
        healthBar(enemy2.x, enemy2.y,enemy2)
        context.drawImage(tile_sheet3,animateEnemyUD,40,200,500,enemy2.x,enemy2.y,30,50);
    }

    //draw enemy3
    if(enemy3.hp>0 && currentMap == map2) {
        healthBar(enemy3.x, enemy3.y,enemy3)
        context.drawImage(tile_sheet5,32,0, 32, 32, enemy3.x,enemy3.y,scaled_size,scaled_size);
    }

    if(enemy4.hp>0 && currentMap == map2) {
        healthBar(enemy4.x, enemy4.y,enemy4)
        context.drawImage(tile_sheet5,32,0, 32, 32, enemy4.x,enemy4.y,scaled_size,scaled_size);
    }

    if(enemy5.hp>0 && currentMap == map2) {
        healthBar(enemy5.x, enemy5.y,enemy5)
        context.drawImage(tile_sheet5,32,0, 32, 32, enemy5.x,enemy5.y,scaled_size,scaled_size);
    }

    if(enemy6.hp>0 && currentMap == map2) {
        healthBar(enemy6.x, enemy6.y,enemy6)
        context.drawImage(tile_sheet5,32,0, 32, 32, enemy6.x,enemy6.y,scaled_size,scaled_size);
    }

    //draw dog
    if(dog.hp>0 && currentMap == map1) {
        healthBar(dog.x, dog.y,dog)
        context.drawImage(tile_sheet6,animateDogLR,animateDogUD,42,60,dog.x,dog.y,30,50);
        //550
        //1150
    }

    //draw player 
   context.drawImage(tile_sheet4,animateRight,animateDown,15,18,player.x,player.y,40,40);

    //dogs!
    if(currentMap == map3) {
        healthBar(dog2.x, dog2.y,dog2)
        context.drawImage(tile_sheet6,350,50,42,60,dog2.x,dog2.y,30,50);
        healthBar(dog3.x, dog3.y,dog3)
        context.drawImage(tile_sheet6,450,animateDogUD,60,60,dog3.x,dog3.y,30,50);
        healthBar(dog4.x, dog4.y,dog4)
        context.drawImage(tile_sheet6,0,animateDogUD,42,60,dog4.x,dog4.y,30,50);
        healthBar(dog5.x, dog5.y,dog5)
        context.drawImage(tile_sheet6,50,300,42,60,dog5.x,dog5.y,30,50);
    }

    //Player movement
    if (controller.left) {
        moveLeft();
        }
    if (controller.right) {
        moveRight();
        }
    if (controller.up) {
        moveUp();
        }
        
    if(controller.down) {
        moveDown();
        }
    if(controller.KeyF && foundBow) {
        action();
    }

    //enemy movement
    //walk left 600 -> 520
    if(enemy.x<600 && faceLeft) {
        //no longer walk left @ 520
        if(enemy.x < 420) {
            faceLeft = false;
            faceRight = true;
            animateEnemyLR = 1150;
        }
        enemy.x -=0.3;
    }
    if(faceRight){
        if(enemy.x > 500) {
            faceRight = false;
            faceLeft = true;
            animateEnemyLR = 550;
        }
        enemy.x += 0.3;
    }

    if(isInAggroRange(player,dog) && currentMap == map1) {
        console.log("wuff");
        magnetice(player,dog);
    }

    //run away from player
    if(isCollide(player,enemy) && currentMap == map1) {
        player.hp-= 0.1;
        console.log('collide');
        context.fillStyle = 'rgba(255, 0, 0, 0.5)';
        context.fillRect(player.x,player.y,player.width,player.height);
    }
    if(player.hp<0) {
        player.hp = 0;
    }

    //enemy2
    if(isCollide(player,enemy2)) {
        enemy2.y -= 0.2; 
        animateEnemyUD = 830;
    }
    else {
        animateEnemyUD = 250;
    }
    //enemy index on map
    var enemy_index = Math.floor((enemy.y + scaled_size * 0.5) / scaled_size) * columns + 
    Math.floor((enemy.x + scaled_size * 0.5) /scaled_size);
    
    //enemy stomp
    if(currentMap[enemy_index] == 2) {
        currentMap[enemy_index] = 1;
    }

    //players index on map
    var player_index = Math.floor((player.y + scaled_size * 0.5) / scaled_size) * columns + 
    Math.floor((player.x + scaled_size * 0.5) /scaled_size);
    
    //stomping plants
    if(currentMap[player_index] == 150){
        currentMap[player_index] = 151;
    }

    //enter door
    if(currentMap[player_index] == 59 && currentMap == map1) {
        currentMap = map3;
        player.x = 600;
        player.y = 320;
    }
    if(currentMap[player_index] == 59 && currentMap == map3) {
        currentMap = map1;
        player.y = 240;
        player.x += 20;
    }

    //go upstairs
    if(currentMap[player_index] == 9 && currentMap == map2) {
        currentMap = map4;
        player.x = 40;
        player.y = 560;
    }
    if(currentMap[player_index] == 9 && currentMap == map4) {
        currentMap = map2;
        player.y = 64;
        player.x = 42;
    }

     //colliding with wall
     for (let i = 0; i < solid.length; i++) {
        if(currentMap[player_index] == solid[i]) {
            //set player x&y value
            if(controller.right) {
                player.x = player.x-2;
            }
            if(controller.left) {
                player.x = player.x+2;
            }
            if(controller.up) {
                player.y = player.y +2;
            }
            if(controller.down) {
                player.y = player.y -2;
            }
        }
    }

    arrowHit();

    enemyAggro();
    
} //END OF LOOP

let enemy3 = new Enemy(670,90,40,40); 
let enemy4 = new Enemy(600,90,40,40); 
let enemy5 = new Enemy(610,90,40,40); 
let enemy6 = new Enemy(640,90,40,40); 

var tile_sheet = new Image(); //player and context
var tile_sheet2 = new Image(); //potion
var tile_sheet3 = new Image(); //enemy
var tile_sheet4 = new Image(); //green-guy
var tile_sheet5 = new Image(); //outdoors
var tile_sheet6 = new Image(); //doggos
var tile_sheet7 = new Image(); //bow

var chugged = false; //remove potion

tile_sheet.addEventListener("load", (event) => {
    loop();
});

tile_sheet2.addEventListener("load", (event) => {
    if(!chugged) {
        loop();
    }
});

tile_sheet3.addEventListener("load", (event) => {
    loop();
});

tile_sheet.src = "images/tile-scroll.png";
tile_sheet2.src = "images/sprite_animation.png";
tile_sheet3.src = "images/enemy.png";
tile_sheet4.src = "images/green-guy.png";
tile_sheet5.src = "images/tiles.png";
tile_sheet6.src = "images/dog.png";
tile_sheet7.src = "images/bow (2).png";
bulletImg.src = "images/arrow (1).png";

context.canvas.addEventListener("click", (event) => {
    pointer.x = event.pageX;
    pointer.y = event.pageY;
})
window.addEventListener("keypress", controller.keyListener);
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

function touchHandlerU(e) {
    if(e.touches) {
        moveUp();
        e.preventDefault();
    }
}
function touchHandlerD(e) {
    if(e.touches) {
        moveDown();
        e.preventDefault();
    }
}
function touchHandlerL(e) {
    if(e.touches) {
        moveLeft();
        e.preventDefault();
    }
}
function touchHandlerR(e) {
    if(e.touches) {
        moveRight();
        e.preventDefault();
    }
}
function touchHandlerA(e) {
    if(e.touches) {
        shootArrow();
        e.preventDefault();
    }
}

var upTouch = document.getElementById("up");
var downTouch = document.getElementById("down");
var leftTouch = document.getElementById("left");
var rightTouch = document.getElementById("right");
var actionTouch = document.getElementById("action");
upTouch.addEventListener("touchstart", touchHandlerU);
upTouch.addEventListener("touchmove", touchHandlerU);

downTouch.addEventListener("touchstart", touchHandlerD);
downTouch.addEventListener("touchmove", touchHandlerD);

leftTouch.addEventListener("touchstart", touchHandlerL);
leftTouch.addEventListener("touchmove", touchHandlerL);

rightTouch.addEventListener("touchstart", touchHandlerR);
rightTouch.addEventListener("touchmove", touchHandlerR);

actionTouch.addEventListener("touchstart", touchHandlerA);
actionTouch.addEventListener("touchmove", touchHandlerA);
