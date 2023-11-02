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
const character = new Image(20, 20);
const projectile = new Image(10, 10);
const meteor = new Image(30, 30);
const explosion = new Image();

character.src = "images/Character.png";
projectile.src = "images/Bullet.png";
meteor.src = "images/Enemy.png";
explosion.src = "images/Explode.png"

var spritePosition = 0;

// Event Listeners
change.addEventListener("click", assignDifficulty);
pauseGame.addEventListener("click", pause);
restart.addEventListener("click", reStart);

// Main player class

class Player {
    constructor() {
        this.initialize();
    }
    initialize() {
        this.xPos = 200;
        this.yPos = 400;
        this.height = 20;
        this.width = 20;
        this.goLeft = false;
        this.goRight = false;
        this.goUp = false;
        this.goDown = false;
        this.shooting = false;
        this.canShoot = true;
        this.die = false;
    }
    move() {
        if (this.goLeft && this.xPos > 0) {
            this.xPos -= 7;
        }
        if (this.goRight && this.xPos < mycanvas.width - 20) {
            this.xPos += 7
        }
        if (this.goUp && this.yPos > 400) {
            this.yPos -= 7;
        }
        if (this.goDown && this.yPos < 400) {
            this.yPos += 7;
        }
    }
    shoot() {
        if (this.shooting && this.canShoot) {
            bullets.push(new Bullet(this.xPos, this.yPos));
            setTimeout(() => {this.canShoot = true;}, 300);
            this.canShoot = false;
        }
    }
    draw() {
        ctx.drawImage(character, this.xPos, this.yPos);
        ctx.stroke();
    }
}

const mainCharacter = new Player();

// Bullet Constructor

class Bullet {
    constructor(xPos, yPos) {
        this.xPos = xPos + 4;
        this.yPos = yPos;
        this.height = 10;
        this.width = 2;
        this.toRemove = false;
    }
    draw() {
        ctx.drawImage(projectile, this.xPos, this.yPos);
        ctx.stroke();
    }
    move() {
        this.yPos -= 10;
        if (this.yPos < -5) {
            this.toRemove = true;
        }
    }
}

// Enemy Constructor
// Originally used function but updated to class

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
        if (this.yPos > mycanvas.height - 20) {
            this.toRemove = true;
            gameOver = true;    // game ends if enemy reaches the bottom
        }
    }
}


// Keystroke actions

// What happens when a key is pressed
// This needs to be updated since keyCodes are outdated (according to VSCode) but it works for now
document.addEventListener("keydown", function(evt) {
    if (evt.key === "ArrowLeft" && gameOver === false) {	// K_LEFT
        mainCharacter.goLeft = true;
    }
    if (evt.key === "ArrowUp" && gameOver === false) {	// K_UP
        mainCharacter.goUp = true;
    }
    if (evt.key === "ArrowRight" && gameOver === false) {	// K_RIGHT
        mainCharacter.goRight = true;
    }
    if (evt.key === "ArrowDown" && gameOver === false) {	// K_DOWN
        mainCharacter.goDown = true;
    }
    if (evt.key === " " && gameOver === false) {	// K_SPACE
        mainCharacter.shooting = true;
    }
    if (evt.key === 'p'){	// P (PAUSE)
	    pause();
    }
    if (evt.key === 'r') {	// R (RESTART)
        reStart();
    }
});

// What happens when a key is released
document.addEventListener("keyup", function(evt) {
    if (evt.key === "ArrowLeft") {	// K_LEFT
        mainCharacter.goLeft = false;
    }
    if (evt.key === "ArrowUp") {	// K_UP
        mainCharacter.goUp = false;
    }
    if (evt.key === "ArrowRight") {	// K_RIGHT
        mainCharacter.goRight = false;
    }
    if (evt.key === "ArrowDown") {	// K_DOWN
        mainCharacter.goDown = false;
    }
    if (evt.key === " ") {	// K_SPACE
        mainCharacter.shooting = false;
    }
});


// Pause function
// If game is already paused, pause button will resume the game
// Otherwise it pauses the game until button is pressed again
function pause() {
    console.log(gamePaused)
    switch (gamePaused) {
        case true:
            wave1 = setInterval(enemySpawn, spawn);
            requestId = window.requestAnimationFrame(gameLoop);
            pauseGame.value = "pause";
            break;
        case false:
            clearInterval(wave1);
            window.cancelAnimationFrame(requestId);
            pauseGame.value = "resume";
            break;
    }
    gamePaused = !gamePaused;
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
    switch (dropdown.value) {
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
function enemySpawn() {
    var tempRand = (Math.random() * mycanvas.width) % (mycanvas.width - 20);
    enemies.push(new Enemy(tempRand, 0));
}


// Removes garbage bullets and enemies
function garbagecollector() {
    for (var i = 0; i < bullets.length; i++) {
        if (bullets[i].toRemove) {
            bullets.splice(i, 1);
        }
    }
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].toRemove) {
            animate(enemies[i].xPos, enemies[i].yPos);
            enemies.splice(i, 1);
        }
    }
}

// Collision detection
function isColliding(thing1, thing2){
    var isLeft = thing2.xPos + thing2.width < thing1.xPos;
    var isRight = thing2.xPos > thing1.xPos + thing1.width;
    var isBelow = thing2.yPos + thing2.height < thing1.yPos;
    var isAbove = thing2.yPos > thing1.yPos + thing1.height;
    return !(isRight||isLeft||isAbove||isBelow);
}

// Animation function that doesn't work yet
function animate(x, y) {

    let startTime = Date.now();
    let lastFrame = startTime;
    let previousSpritePosition = spritePosition;

    function drawFrame() {
        if (spritePosition >= 90) {
            spritePosition = 0;
        }

        let currentTime = Date.now();
        let elapsedTime = currentTime - lastFrame;

        ctx.clearRect(x, y, 30, 30);
        ctx.drawImage(explosion, previousSpritePosition, 0, 30, 30, x, y, 30, 30);

        if (elapsedTime >= 75) {
            ctx.drawImage(explosion, spritePosition, 0, 30, 30, x, y, 30, 30);
            previousSpritePosition = spritePosition;
            spritePosition += 30;
            lastFrame = currentTime;
        }

        let totalElapsed = currentTime - startTime;

        if (totalElapsed < 500) {
            requestAnimationFrame(drawFrame);
        }
    }

    drawFrame();
}

// Removes ALL enemies and bullets regardless of if they're garbage
// Gets called when player collides with bullet
function clearScreen() {
    enemies = [];
    bullets = [];
}

// This gets called whenever we re/start a game.
function initialSettings() {
    score = 0;
    gameOver = false;
    gamePaused = false;
    clearScreen();
    mainCharacter.initialize();
}

// Draws bullets & enemies, handles collisions
function updateGame() {
    bullets.forEach(bullet => {
        bullet.move();
        bullet.draw();
        enemies.forEach(enemy => {
            if (isColliding(enemy, bullet)) {
                enemy.toRemove = true;
                bullet.toRemove = true;
                score += 100;
            }
        });
    });

    enemies.forEach(enemy => {
        enemy.move();
        enemy.draw();
        if (isColliding(enemy, mainCharacter)) {
            gameOver = true;
        }
    });
}


// main game loop
function gameLoop() {
    ctx.beginPath();
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
    mainCharacter.move();
    mainCharacter.draw();
    mainCharacter.shoot();
   
    requestId = window.requestAnimationFrame(gameLoop);
    if (gameOver) {
        clearScreen();
        clearInterval(wave1);
        return;
    }

    updateGame();
    
    garbagecollector();
    scoredisplay.innerHTML = "score: " + score;
}


initialSettings();
var wave1 = setInterval(enemySpawn, spawn);
gameLoop();
