// Define Canvas
const mycanvas = document.getElementById("mycanvas");
const ctx = mycanvas.getContext("2d");

// Elements from game.html
const restart = document.getElementById("restart");
const pauseGame = document.getElementById("pause");
const dropdown = document.getElementById("dropdown");
const change = document.getElementById("change");
const scoredisplay = document.getElementById("scoredisplay");

// Bullet and enemy arrays
var bullets = [];
var enemies = [];

// Booleans
var gameOver = false;
var gamePaused = false;

// Spawn rate and movement speed of enemies
var spawn = 1000;
var movementSpeed = 1;

// Player score
var score = 0;

var requestId;

// Character and enemy models
var character = new Image(20, 20);
character.src = "images/Character.png";
var projectile = new Image(10, 10);
projectile.src = "images/Bullet.png";
var meteor = new Image(30, 30);
meteor.src = "images/Enemy.png";
var explosion = new Image();
explosion.src = "images/Explode.png"

var spritePosition = 0;

// Event Listeners
change.addEventListener("click", assignDifficulty);
pauseGame.addEventListener("click", pause);
restart.addEventListener("click", reStart);

// Main player class (want to switch over to a real class soon)
var box = {
    xPos: 200,
    yPos: 400,
    height: 20,
    width: 20,
    goLeft: false,
    goRight: false,
    goUp: false,
    goDown: false,
    shooting: false,
    die: false,
    canShoot: true,
    
    move: function() {
        if (box.goLeft && box.xPos > 0) {
            box.xPos -= 7;
        }
        if (box.goRight && box.xPos < 380) {
            box.xPos += 7;
        }
        if (box.goUp && box.yPos > 400) {
            box.yPos -= 7;
        }
        if (box.goDown && box.yPos < 400) {
            box.yPos += 7;
        }
    },
    shoot: function() {
        if (box.shooting && box.canShoot) {
            bullets.push(new Bullet(box.xPos, box.yPos));
            setTimeout(function(){box.canShoot = true;}, 300);
            box.canShoot = false;
        }
    },
    draw: function() {
        ctx.drawImage(character, box.xPos, box.yPos);
        ctx.stroke();
    }
};


// class player {
//    constructor() {
//        this.xPos = 200;
//        this.yPos = 400;
//        this.height = 20;
//        this.width = 20;
//        this.goLeft = false;
//        this.goRight = false;
//        this.goUp = false;
//        this.goDown = false;
//        this.shooting = false;
//        this.die = false;
//        this.canShoot = false;
//    }
//    move() {
//        if (this.goLeft && this.xPos > 0) {
//            this.xPos -= 7;
//        }
//        if (this.goRight && this.xPos < 380) {
//            this.xPos += 7;
//        }
//        if (this.goUp && this.yPos > 400) {
//            this.yPos -= 7;
//        }
//        if (this.goDown && this.yPos < 400) {
//            this.yPos += 7;
//        }
//    }
//    shoot() {
//        if (this.shooting && this.canShoot) {
//            bullets.push(new Bullet(this.xPos, this.yPos));
//            setTimeout(function(){this.canShoot = true;}, 300);
//            this.canShoot = false;
//        }
//    }
//    draw() {
//        if (gameOver === false) {
//            ctx.drawImage(character, this.xPos, this.yPos);
//        }
//        ctx.stroke();
//    }
// }



// Object Constructors

// Bullet Constructor
// Will move this to a proper class but for whatever reason it's breaking

function Bullet(xPos, yPos) {
    this.xPos = xPos + 4;
    this.yPos = yPos;
    this.height = 10;
    this.width = 2;
    this.draw = function() {
        ctx.drawImage(projectile, this.xPos, this.yPos);
        ctx.stroke();
    };
    this.move = function() {
        this.yPos -= 10;
        if (this.yPos < -5) {
            this.toRemove = true;
        }
        if (this.yPos < 0) {
            return false;
        } else {
            return true;
        }
    };
    this.toRemove = false;
}


// class Bullet {
//     constructor(xPos, yPos) {
//         this.xPos = xPos + 4;
//         this.yPos = yPos;
//         this.height = 10;
//         this.width = 2;
//         this.toRemove = false;
//     }
//     static draw() {
//         ctx.drawImage(projectile, this.xPos, this.yPos);
//         ctx.stroke();
//     }
//     static move() {
//         this.yPos -= 10;
//         if (this.yPos < -5) {
//             this.toRemove = true;
//         }
//     }
// }


// Enemy Constructor
// Originally used function (below) but updated to class
// Keeping it just in case something goes wrong

// function Enemy(xPos, yPos) {
//     this.xPos = xPos;
//     this.yPos = yPos;
//     this.height = 30;
//     this.width = 30;
//     this.draw = function() {
//         ctx.drawImage(meteor, this.xPos, this.yPos);
//         ctx.stroke();
//     };
//     this.move = function() {
//         this.xPos -= 0;
//         this.yPos += movementSpeed;
//         if (this.yPos > 500){
//             this.toRemove = true;
//         }
//     };
// }

class Enemy {
    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.height = 30;
        this.width = 30;
        this.toRemove = false;
    }
    draw() {
        ctx.drawImage(meteor, this.xPos, this.yPos);
        ctx.stroke();
    }
    move() {
        this.xPos -= 0;
        this.yPos += movementSpeed;
        if (this.yPos > 480) {
            this.toRemove = true;
            gameOver = true;    // game ends if enemy reaches the bottom
        }
    }
}


// Keystroke actions

// What happens when a key is pressed
// This needs to be updated since keyCodes are outdated (according to VSCode) but it works for now
document.addEventListener("keydown", function(evt) {
    if (evt.keyCode === 37 && gameOver === false) {	// K_LEFT
        box.goLeft = true;
    }
    if (evt.keyCode === 38 && gameOver === false) {	// K_UP
        box.goUp = true;
    }
    if (evt.keyCode === 39 && gameOver === false) {	// K_RIGHT
        box.goRight = true;
    }
    if (evt.keyCode === 40 && gameOver === false) {	// K_DOWN
        box.goDown = true;
    }
    if (evt.keyCode === 32 && gameOver === false) {	// K_SPACE
        box.shooting = true;
    }
    if (evt.keyCode === 80){	// P (PAUSE)
	    pause();
    }
    if (evt.keyCode === 82) {	// R (RESTART)
        reStart();
    }
});

// What happens when a key is released
document.addEventListener("keyup", function(evt) {
    if (evt.keyCode === 37) {	// K_LEFT
        box.goLeft = false;
    }
    if (evt.keyCode === 38) {	// K_UP
        box.goUp = false;
    }
    if (evt.keyCode === 39) {	// K_RIGHT
        box.goRight = false;
    }
    if (evt.keyCode === 40) {	// K_DOWN
        box.goDown = false;
    }
    if (evt.keyCode === 32) {	// K_SPACE
        box.shooting = false;
    } 
});


// Pause function
// If game is already paused, pause button will resume the game
// Otherwise it pauses the game until button is pressed again
function pause() {
    if (gamePaused === true) {
        gamePaused = false;
        wave1 = setInterval(enemySpawn, spawn);
        requestId = window.requestAnimationFrame(gameLoop);
        pauseGame.value = "pause";
    } else {
        gamePaused = true;
        clearInterval(wave1);
        window.cancelAnimationFrame(requestId);
        pauseGame.value = "resume";
    }
}

// Restart function
function reStart() {
    clearInterval(wave1);
    window.cancelAnimationFrame(requestId);
    initialSettings();
    wave1 = setInterval(enemySpawn, spawn);
    gameLoop();
}

function assignDifficulty() {
    switch(dropdown.value) {
        case "SuperEasy":
            spawn = 1000;
            movementSpeed = 1;
            break;
        case "Easy":
            spawn = 100;
            movementSpeed = 1;
            break;
        case "Medium":
            spawn = 1;
            movementSpeed = 1;
            break;
        case "Hard":
            spawn = 1;
            movementSpeed = 10;
            break;
        case "Impossible":
            spawn = 1;
            movementSpeed = 100;
            break;
    }
    reStart();
}

// Spawns enemies
function enemySpawn(){
    var tempRand = (Math.random() * mycanvas.width) % (mycanvas.width - 20);
    enemies.push(new Enemy(tempRand, 0));
}


// Removes garbage bullets and enemies
function garbagecollector() {
    for (var i = 0; i < bullets.length; i++) {
        if (bullets[i].toRemove === true) {
            bullets.splice(i, 1);
        }
    }
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].toRemove === true) {
            enemies.splice(i, 1);
        }
    }
}

// Collision detection
function isColliding(thing1, thing2){
    console.log(thing1, thing2);
    var isLeft = thing2.xPos + thing2.width < thing1.xPos;
    var isRight = thing2.xPos > thing1.xPos + thing1.width;
    var isBelow = thing2.yPos + thing2.height < thing1.yPos;
    var isAbove = thing2.yPos > thing1.yPos + thing1.height;
    return !(isRight||isLeft||isAbove||isBelow);
}

// Animation function that doesn't work yet
function animate(x, y) {
    if (spritePosition >= 90) {
        spritePosition = 0;
    }
    setInterval(function() {
        ctx.drawImage(explosion, spritePosition, 0, 30, 30, x, y, 30, 30);
    }, 100);
    // ctx.drawImage(explosion, spritePosition, 0, 30, 30, x, y, 30, 30);
    spritePosition += 30;
}

// Removes ALL enemies and bullets regardless of if they're garbage
// Gets called when player collides with bullet
function clearScreen() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].splice(i, 1);
    }
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].splice(i, 1);
    }
}

// This gets called whenever we re/start a game.
function initialSettings() {
    score = 0;
    gameOver = false;
    enemies = [];
    bullets = [];
    box.xPos = 200;
    box.yPos = 400;
    box.shooting = false;
    box.canShoot = true;
    box.goLeft = false;
    box.goRight = false;
    box.die = false;
    gamePaused = false;
}


// main game loop
function gameLoop() {
    ctx.beginPath();
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
    box.move();
    box.draw();
    box.shoot();
   
    requestId = window.requestAnimationFrame(gameLoop);
    if (gameOver === true) {
        clearScreen();
        clearInterval(wave1);
    }

    // Draws bullets and handles collision detection with enemy
    for (var j = 0; j < bullets.length; j++) {
        bullets[j].move();
        bullets[j].draw();
        for (var k = 0; k < enemies.length; k++) {
            if (isColliding(bullets[j], enemies[k])) {
                enemies[k].toRemove = true;
                bullets[j].toRemove = true;
                score = score + 100;
            } 
        }   
    }

    // Draws enemies and handles collision detection with player
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();
        // Game over if statement
        // if (isColliding(box, enemies[i]) || isColliding(line, enemies[i])) {
        //     gameOver = true;
        //     // alert("Press R to Restart.");
        // }
        if (isColliding(box, enemies[i])) {
            gameOver = true;
        }
    }
    
    garbagecollector();
    scoredisplay.innerHTML = "score: " + score;
}


initialSettings();
var wave1 = setInterval(enemySpawn, spawn);
gameLoop();

// Ignore below, test code for stuff that I don't know will work

// var Player = new player();

// function testLoop() {
//     ctx.beginPath();
//     ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
//     Player.move();
//     Player.draw();
//     Player.shoot();
//     requestId = window.requestAnimationFrame(testLoop);

//     for (var j = 0; j < bullets.length; j++) {
//         bullets[j].move();
//         bullets[j].draw();
//         // for (var k = 0; k < enemies.length; k++) {
//         //     if (isColliding(bullets[j], enemies[k])) {
//         //         enemies[k].toRemove = true;
//         //         bullets[j].toRemove = true;
//         //         score = score + 100;
//         //     } 
//         // }   
//     }
// }

// testLoop();
