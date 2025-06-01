const canvas = document.getElementById("viewport");
const ctx = canvas.getContext("2d");

// Tile size
const TILE_SIZE = 32;

// Map dimensions
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;

// Load the initial map
let mapData = map1;

// Load tileset (assuming you have a tileset image named 'tileset.png')
const tileset = new Image();
tileset.src = "images/tiles.png";

tileset.onload = () => {
    drawMap();
};

var scaled_size = 32;
var sprite_size = 16; // tile size 16*16px
var columns = 20;
var rows = 16;
var columns2 = 20;
var rows2 = 16;

let character = {
    img: new Image(src="images/007.png", width=100, height=200),
    prevX: 100,
    prevY: 100,
    x: 100,
    y: 100,
    frameWidth: 32,
    frameHeight: 32,
    frameIndex: 0, 
    lastDirection: 0,

    health: 100,
    maxHealth: 100,
    attackDamage: 50,
    invincible: false,
    invincibleTimer: 0,
    invincibleCooldown: 30,
    damageReduction: 0,
    vampiric: false,
    hasShieldBubble:false,
    shieldCooldown:0,
    weaponCritChance: 0.1,
    weaponStunChance: 0,

    speed: 0.4,
    frameIndex: 0, // Current frame for animation
    frameCount: 8, // Total frames in sprite sheet
    frameWidth: 16,
    frameHeight: 18,
    frameDelay: 20, // Animation speed
    frameTimer: 10,
    moving: true,
    lastDirection: 0, // 0 = down, 1 = up, 2 = left, 3 = right

    level: 1,
    xp: 0,
    xpToNextLevel: 100,

    // Function to update XP and check for level up
    addXP: function (amount) {
        this.xp += amount;
        console.log(`Gained ${amount} XP! Current XP: ${this.xp}`);
        console.log("current level:" + level);

        // Check if player leveled up
        if (this.xp >= this.xpToNextLevel) {
            console.log("leveld up!");
            this.levelUp();
        }
    },

    // Handle level up
    levelUp: function () {
        this.level++;
        this.xp = 0;  // Reset XP to 0 after leveling up
        this.xpToNextLevel = this.level * 100;  // Increase XP required for next level

        console.log(`Level Up! You are now level ${this.level}!`);

        // Show upgrade cards UI
        showUpgradeCards();
    }
};

// Function to show the class selection screen
function ShowClassSelection() {
    document.getElementById("class-selection").style.display = "block";
    document.getElementById("container").style.display = "none";
}

const weapons = {
    regularBow: {
        name: "Regular Bow",
        speed: 3,
        damage: 20,
        heatSeeking: false,
        type: "regular",
        weaponStunChance: 0,
        weaponCritChance:0.1,
    },
    heatSeekingBow: {
        name: "Heat-Seeking Bow",
        speed: 2,
        damage: 15,
        heatSeeking: true,
        type: "heatSeeking",
        weaponStunChance:0,
        weaponCritChance:0.1,
    },
    thunderBow: {
        name: "Thunder Bow",
        speed: 2.5,
        damage: 12,
        heatSeeking: false,
        type: "thunder",
        weaponStunChance:0,
        weaponCritChance:0.1,
    },
    flameSword: {
        name: "Flame Sword",
        speed: 1,
        damage: 40,
        heatSeeking: false,
        type: "fire",
        weaponStunChance:0,
        weaponCritChance:0.5,
        melee: true
    },
    lightningBlade: {
        name: "Lightning Blade",
        speed: 2.5,
        damage: 12,
        heatSeeking: false,
        type: "lightning",
        weaponStunChance:0,
        weaponCritChance:0.1,
        melee: true
    }
};

const playerClasses = {
    archer: {
        name: "Archer",
        health: 100,
        maxHealth: 100,
        speed: 0.6,
        damage: 10,
        weapon: weapons.regularBow,
        currentWeapon: weapons.regularBow,
        imgSrc: "images/green-guy.png",
        width: 40,
        height: 40,
        prevX: 100,
        prevY: 100,
        x:100,
        y:100,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        img: new Image(),  // Add this to hold the Image object

        addXP: function (amount) {
            this.xp += amount;
            console.log(`Gained ${amount} XP! Current XP: ${this.xp}`);
    
            // Check if player leveled up
            if (this.xp >= this.xpToNextLevel) {
                this.levelUp();
            }
        },

        levelUp: function() {
            this.level++;
            this.xp = 0;  // Reset XP to 0 after leveling up
            this.xpToNextLevel = this.level * 100;  // Increase XP required for next level
    
            console.log(`Level Up! You are now level ${this.level}!`);
            // Trigger your card selection here (UI for upgrade options)
            showUpgradeCards();
        }
    },
    mage: {
        name: "Mage",
        health: 80,
        maxHealth: 80,
        speed: 0.5,
        damage: 150,
        weapon: weapons.thunderBow,
        currentWeapon: weapons.thunderBow,
        imgSrc: "images/wizard.png",
        width: 40,
        height: 40,
        prevX: 100,
        prevY: 100,
        x:100,
        y:100,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        img: new Image(),  // Add this to hold the Image object

        addXP: function (amount) {
            this.xp += amount;
            console.log(`Gained ${amount} XP! Current XP: ${this.xp}`);
            console.log("current level:" + character.level);
            // Check if player leveled up
            if (this.xp >= this.xpToNextLevel) {
                this.levelUp();
            }
        },

        levelUp: function() {
            this.level++;
            this.xp = 0;  // Reset XP to 0 after leveling up
            this.xpToNextLevel = this.level * 100;  // Increase XP required for next level
    
            console.log(`Level Up! You are now level ${this.level}!`);
            // Trigger your card selection here (UI for upgrade options)
            showUpgradeCards();
        }
    },
};

// Character setup based on selected class
function selectClass(className) {
    character = { ...playerClasses[className] };

    character.img = new Image();
    character.img.src = character.imgSrc;

    character.img.onload = () => {
        // Image is now loaded — safe to initialize and draw
        console.log("Image loaded:", character.img.src);
        drawCharacter();

        document.getElementById("class-selection").style.display = "none";
        document.getElementById("container").style.display = "block";

        initGame(className); // This sets dimensions, etc.
        requestAnimationFrame(gameLoop); // Start the game loop AFTER image loads
    };

}


// Function to initialize the game (for now, you can add the player setup here)
function initGame(className) {
    // Initialize the player with the selected character class
    console.log("Initializing game for class:", character.name);

        character.img.src = character.imgSrc;
        character.img.width = 10;
        character.img.height = 10;
        character.health = character.health;
        character.frameWidth = 16; // Example frame size
        character.frameHeight = 18;
        character.frameIndex = 0;
        character.frameCount = 8;
        character.frameDelay = 20;
        character.frameTimer = 10;
        character.moving = false;
        character.lastDirection = 0;
        character.x = 100;
        character.y = 100;
        character.prevX = 100;
        character.prevY = 100;

        console.log(character.imgSrc)

}

// Main game loop (you can expand this as needed)
function gameLoop() {
    // Update the game state (move characters, check collisions, etc.)
    updateGame();

    // Re-render the game every frame
    requestAnimationFrame(gameLoop);
}

// Function to update game state
function updateGame() {
    // For now, just log the character stats for testing
    console.log(`Character: ${character.name} Health: ${character.health}`);
    // You could add movement, animations, etc. here
}

// Function to draw the map
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            let tileId = mapData[y * MAP_WIDTH + x];
            drawTile(tileId, x, y);
        }
    }
}

// Function to draw a tile
function drawTile(tileId, x, y) {
    const tilesPerRow = tileset.width / TILE_SIZE;
    const srcX = (tileId % tilesPerRow) * TILE_SIZE;
    const srcY = Math.floor(tileId / tilesPerRow) * TILE_SIZE;
    
    ctx.drawImage(
        tileset,
        srcX, srcY, TILE_SIZE, TILE_SIZE, 
        x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
    );
}

// Ensure canvas scales properly
function resizeCanvas() {
    canvas.width = MAP_WIDTH * TILE_SIZE;
    canvas.height = MAP_HEIGHT * TILE_SIZE;
    drawMap();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
