var context, controller, player, enemy, circle, loop;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 600;
context.canvas.width = 800;

var angle = 0;
var radius = 80;
var x= radius*Math.sin(Math.PI*2*angle/360);
var y= radius*Math.cos(Math.PI*2*angle/360);
var score = 0;
var highscore = localStorage.getItem("highscore");
var audio = new Audio('explosion.wav');
audio.volume = 0.2;

document.addEventListener("DOMContentLoaded", function () {
  function addTouchSupport(id, callback) {
      let button = document.getElementById(id);
      button.addEventListener("click", callback);
      button.addEventListener("touchstart", (e) => {
          e.preventDefault(); // Prevent scrolling
          callback();
      }, { passive: false });
  }

  addTouchSupport("up", moveUp);
  addTouchSupport("left", moveLeft);
  addTouchSupport("right", moveRight);
  addTouchSupport("down", moveDown);
  addTouchSupport("action", action);
});

player = {
  height:30,
  jumping:true,
  width:30,
  x:350, // center of the canvas
  x_velocity:0,
  y:100,
  y_velocity:0
};

enemy = {
  height:30,
  jumping:true,
  width:30,
  x:350, // center of the canvas
  x_velocity:0,
  y:150,
  y_velocity:0.5
};

car = {
  height:30,
  jumping:true,
  width:30,
  x:350, // center of the canvas
  x_velocity:0,
  y:250,
  y_velocity:0.5
};


circle = {
  x: context.canvas.width/2,
  y: context.canvas.height/2,
  r: 80,
  d: 160
}

circle_boundary = {
  x: 400*Math.cos(Math.PI*2*angle/360),
  y: 300*Math.cos(Math.PI*2*angle/360), 
  r: 120,
  d: 240
}

goal_line = {
  x: 400,
  y: 60,
  width: 2,
  height: 160
}

square = {
  height: 500,
  width: 500,
  x: 150,
  y: 50
}

controller = {
  left:false,
  right:false,
  up:false,
  down:false,
  key_up:false,
  keyListener:function(event) {
    var key_down = (event.type == "keydown")?true:false;
    if(event.type == "keyup") {
        controller.jumped = false;
    }
    switch(event.keyCode) {
      case 37:// left key
        controller.left = key_down;
      break;
      case 38:// up key
        controller.up = key_down;
      break;
      case 39:// right key
        controller.right = key_down;
      break;
      case 40:// down key
        controller.down = key_down;
      break;
      case 36:// Space
        controller.space = key_down;
    }
  }
};

function isCollide(a,b) {
  return !(
    ((a.y + a.height) < (b.y)) ||
    (a.y > (b.y + b.height)) ||
    ((a.x + a.width) < b.x) ||
    (a.x > (b.x + b.width))
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

function RectCircleColliding(circle,player){
  var distX = Math.abs(circle.x - player.x-player.width/2);
  var distY = Math.abs(circle.y - player.y-player.height/2);

  if (distX > (player.width/2 + circle.r)) { return false; }
  if (distY > (player.height/2 + circle.r)) { return false; }

  if (distX <= (player.width/2)) { return true; } 
  if (distY <= (player.height/2)) { return true; }

  var dx=distX-player.width/2;
  var dy=distY-player.height/2;
  return (dx*dx+dy*dy<=(circle.r*circle.r));
}

var img = new Image();
var scrollSpeed = 1;
img.src = "track.jpg";
var imgHeight = 0;

loop = function() {
  
  context.drawImage(img, imgHeight,0);
  context.drawImage(img, imgHeight - context.canvas.height,0);
  if (imgHeight == imgHeight - context.canvas.height)
  imgHeight = 0;
  
  if(highscore !== null){
    if (score > highscore) {
        localStorage.setItem("highscore", score);      
    }
}
else{
    localStorage.setItem("highscore", score);
}

  if(isCollideCircle(circle,player)) {
    gameOver();
  }

  if(isCollide(player,enemy)) {
    gameOver();
  }

  if(!isCollide(player,goal_line) && player.x_velocity>0){
    score += 1;
  }

  //Enemy movement
  if(enemy.x >= 0 && enemy.x != 500 && enemy.y == 150) {
    enemy.x += 0.5;
  }
  if(enemy.x == 500 && enemy.y != 417) {
    enemy.y += 0.5;
  }
  if(enemy.y == 417 && enemy.x != 230) {
    enemy.x -=0.5
  }
  if(enemy.x == 230 && enemy.y != 150) {
    enemy.y -=0.5
  }
  
//Player movement
  if (controller.up) {
    player.y_velocity -= 0.5;
  }
  if (controller.left) {
    player.x_velocity -= 0.5;
  }
  if (controller.right) {
    console.log("x:", player.x)
    console.log("y", player.y)
    console.log("circle y: ", circle_boundary.y)
    console.log("circle x", circle_boundary.x)
    console.log("circle d", circle_boundary.d)
    player.x_velocity += 0.5;
    }
  if(controller.down) {
    player.y_velocity += 0.5;
  }
  if(controller.space) {
    player.rotate(deg * Math.PI/180);
    player.rotate(20 * Math.PI/180)
  }

  player.x += player.x_velocity;
  player.y += player.y_velocity;
  player.x_velocity *= 0.9;// friction
  player.y_velocity *= 0.9;// friction

  // if rectangle is out of bounds
  if (player.y > context.canvas.height - player.height) {
    player.y = context.canvas.height - player.height
  }
  if(player.x > context.canvas.width - player.width) {
    player.x = context.canvas.width - player.width
  }

  if(player.y < 0 ) {
    player.y = 0 
  }
  if(player.x < 0 ) {
    player.x = 0
  }

  function gameOver() {
    audio.play()
    player.y = 100;
    player.x = 350;
    player.y_velocity = 0;
    player.x_velocity = 0;
    window.alert("Score: "+ score+ '\n'+ "high score: " + highscore);
    location.reload();
  }

  // if crash in pink rectangle
  if ( player.y< square.y || player.x<square.x ) {
    gameOver();
  }

  if (player.y > square.height +square.y - player.height) {
    gameOver();
  }
  if(player.x > square.width + square.x - player.width) {
    gameOver();
  }

  var carImg = new Image();   // Create new img element
  var carImgTwo = new Image();
  carImg.src = 'car1.png'; // Set source path
  carImgTwo.src = 'car2.png';
 
 //Draw out graphics
  context.fillStyle = "#202020"; //Background
  context.fillRect(0, 0, 800, 600);// x, y, width, height

//Player
  context.beginPath();
  context.drawImage(carImg, player.x,player.y,player.width, player.height);
  context.fill();
  
//Enemy
  context.beginPath();
  context.drawImage(carImgTwo, enemy.x, enemy.y, enemy.width, enemy.height);
  context.fill();

//Line  
  context.beginPath();
  context.rect(goal_line.x,goal_line.y,goal_line.width,goal_line.height);
  context.lineWidth = goal_line.width;
  context.strokeStyle = 'ff9800';
  context.stroke();

//inner Circle
  context.beginPath();
  context.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
  context.lineWidth = 3;
  context.strokeStyle = '#FF0000';
  context.stroke();

//outer square
context.beginPath();
context.rect(square.x,square.y,square.height,square.width)
context.lineWidth = 8;
context.strokeStyle = '#DEB0DE';
context.stroke();

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);
};

window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);
window.addEventListener("keypress", controller.keyListener);
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);