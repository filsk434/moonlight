let enemies = [];
let keys = {};
let projectiles = [];
let waveNumber = 1;
let enemiesPerWave = 8;
let enemiesRemaining = enemiesPerWave;
let healingPotion = { x: Math.random() * canvas.width, y: Math.random() * canvas.height, active: true };
let potions = []; 
let potionImage = new Image();

const enemySizePresets = {
    small: {
        frameWidth: 22, frameHeight: 18,
        width: 30, height: 30,
        totalFrames: 16, frameDelay: 20,
        frameTimer: 10, frameDuration: 10,
        frameIndex: 0, frameElement: 0
    },
    middle: {
        frameWidth: 30, frameHeight: 30,
        width: 45, height: 45,
        totalFrames: 16, frameDelay: 20,
        frameTimer: 10, frameDuration: 10,
        frameIndex: 0, frameElement: 0
    },
    big: {
        frameWidth: 60, frameHeight: 60,
        width: 60, height: 60,
        totalFrames: 16, frameDelay: 50,
        frameTimer: 20, frameDuration: 10,
        frameIndex: 0, frameElement: 0
    },
    huge: {
        frameWidth: 80, frameHeight: 80,
        width: 100, height: 100,
        totalFrames: 16, frameDelay: 50,
        frameTimer: 20, frameDuration: 10,
        frameIndex: 0, frameElement: 0
    }
};


let enemyTypes = [
    {
        name: "Bulbasaur",
        size: "small",
        health: 25, maxHealth: 25,
        damage: 10, score: 10,
        imgSrc: "images/pokemon/001.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.small
    },
    {
        name: "Ivysaur",
        size: "middle",
        health: 75, maxHealth: 75,
        damage: 20, score: 20,
        imgSrc: "images/pokemon/002.png", speed: 0.12,
        attackCooldown: 0,
        ...enemySizePresets.middle
    },
    {
        name: "Venosaur",
        size: "big",
        health: 200, maxHealth: 200,
        damage: 40, score: 50,
        imgSrc: "images/pokemon/003.png", speed: 0.1,
        attackCooldown: 0,
        ...enemySizePresets.big
    },
    {
        name: "Charmander",
        size: "small",
        health: 20, maxHealth: 30,
        damage: 15, score: 10,
        imgSrc: "images/pokemon/004.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.small
    },
    {
        name: "Charmeleon",
        size: "middle",
        health: 70, maxHealth: 80,
        damage: 25, score: 20,
        imgSrc: "images/pokemon/005.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.middle
    },
    {
        name: "Charizard",
        size: "big",
        health: 180, maxHealth: 300,
        damage: 50, score: 50,
        imgSrc: "images/pokemon/006.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.big
    },
    {
        name: "Squirtle",
        size: "small",
        health: 25, maxHealth: 25,
        damage: 10, score: 10,
        imgSrc: "images/pokemon/007.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.small
    },
    {
        name: "Warturtle",
        size: "middle",
        health: 70, maxHealth: 70,
        damage: 10, score: 20,
        imgSrc: "images/pokemon/008.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.middle
    },
    {
        name: "Blastoise",
        size: "big",
        health: 200, maxHealth: 250,
        damage: 45, score: 50,
        imgSrc: "images/pokemon/009.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.big
    },
    {
        name: "Dugtrio",
        size: "middle",
        health: 200, maxHealth: 250,
        damage: 45, score: 50,
        imgSrc: "images/pokemon/051.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.middle
    },
    {
        name: "Snorlax",
        size: "huge",
        health: 200, maxHealth: 250,
        damage: 45, score: 50,
        imgSrc: "images/pokemon/143.png", speed: 0.08,
        attackCooldown: 0,
        ...enemySizePresets.huge
    },

];

let score = 0;
let gameOver = false;

let loadedImages = 0;
let totalImages = enemies.length + 1;

const projectileSpeed = 3;
const projectileSize = 5;
let isShooting = false;
let shootInterval = null;

let vines = [];

potionImage.src = "images/Potion.png"; // ✅ Make sure the path is correct!
potionImage.onload = () => console.log("Potion image loaded");

let potion = {
    x: Math.random() * (canvas.width - 32), // Ensure it's inside the canvas
    y: Math.random() * (canvas.height - 32),
    width: 32,
    height: 32,
    frameIndex: 5,
    frameTimer: 10,
    frameDelay: 100,
    frameWidth: 200,
    frameHeight: 180,
    image: potionImage
};

let highScore = localStorage.getItem("highScore") || 0;
console.log("High Score: " + highScore);

function selectClass(className) {
    if (playerClasses[className]) {  // Check if class exists
        character = { ...playerClasses[className] };

        document.getElementById("class-selection").style.display = "none";
        document.getElementById("container").style.display = "block";

        initGame();
    } else {
        console.error("Class not found:", className);
    }
}

function showUpgradeCards() {
    gamePaused = true;

    const upgradeCardsContainer = document.getElementById('upgrade-cards');
    upgradeCardsContainer.style.display = 'block';

    const allUpgrades = [
        { name: "Health Boost", effect: "Increase health by 20", image: "healthboost.png", upgradeType: "Health" },
        { name: "Speed Boost", effect: "Increase speed by 1", image: "speedboost.png", upgradeType: "Speed" },
        { name: "Flame Sword", effect: "New Weapon: Flame Sword (Damage: 20)", image: "007.png", upgradeType: "Weapon" },
        { name: "Iron Skin", effect: "Reduce all damage taken by 10%", image: "ironskin.png", upgradeType: "Defense" },
        { name: "Vampiric Aura", effect: "Restore 5% health on each enemy kill", image: "vampire.png", upgradeType: "Health" },
        { name: "Shield Bubble", effect: "Gain a temporary shield every 30 seconds", image: "shieldbubble.png", upgradeType: "Defense" },
        { name: "Lightning Blade", effect: "New Weapon: Lightning Blade (Chance to stun)", image: "lightningblade.png", upgradeType: "Weapon" },
        { name: "Critical Strike", effect: "10% chance to deal double damage", image: "critstrike.png", upgradeType: "Damage" },
    ];

    // Shuffle and select 3
    currentUpgradeChoices = allUpgrades.sort(() => 0.5 - Math.random()).slice(0, 3);

    const container = upgradeCardsContainer.querySelector('.upgrade-container');
    container.innerHTML = '';

    currentUpgradeChoices.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('upgrade-card');
        cardElement.onclick = () => selectUpgrade(index);

        cardElement.innerHTML = `
            <img src="images/${card.image}" alt="${card.name}">
            <h3>${card.name}</h3>
            <p>${card.effect}</p>
        `;

        container.appendChild(cardElement);
    });
}


let currentUpgradeChoices = [];


function selectUpgrade(index) {
    const selectedUpgrade = currentUpgradeChoices[index];

    switch (selectedUpgrade.name) {
        case "Health Boost":
            character.maxHealth += 20;
            character.health += 20;
            break;
        case "Speed Boost":
            character.speed += 1;
            break;
        case "Flame Sword":
            character.weapon = 'Flame Sword';
            character.currentWeapon = weapons.flameSword;
            break;
        case "Iron Skin":
            character.damageReduction = (character.damageReduction || 0) + 0.1;
            break;
        case "Vampiric Aura":
            character.vampiric = true;
            break;
        case "Shield Bubble":
            character.shieldCooldown = 30;
            character.hasShieldBubble = true;
            break;
        case "Lightning Blade":
            character.weapon = 'Lightning Blade';
            character.currentWeapon = weapons.lightningBlade;
            character.weaponStunChance = 0.25;
            break;
        case "Critical Strike":
            character.weaponCritChance += 0.1;
            break;
        default:
            console.warn("Unhandled upgrade:", selectedUpgrade.name);
    }

    document.getElementById('upgrade-cards').style.display = 'none';
    gamePaused = false;
    drawGameScreen();
}


function weightedRandomEnemy() {
    const weights = {
        small: 60,
        middle: 25,
        big: 10,
        huge: 5
    };

    const pool = enemyTypes.flatMap(type => Array(weights[type.size]).fill(type));

    return pool[Math.floor(Math.random() * pool.length)];
}


function handleUpgradeSelection(event) {
    if (gamePaused) {
        if (event.key === '1') {
            selectCard('Health Boost');
        } else if (event.key === '2') {
            selectCard('Speed Boost');
        } else if (event.key === '3') {
            selectCard('Flame Sword');
        }
    }
}

function selectCard(upgrade) {
    console.log(`Upgrade Selected: ${upgrade}`);
    
    // Apply the upgrade to the player character (this is just an example)
    if (upgrade === 'Health Boost') {
        character.health += 20;
    } else if (upgrade === 'Speed Boost') {
        character.speed += 1;
    } else if (upgrade === 'Flame Sword') {
        character.weapon = 'Flame Sword';
        character.weaponDamage = 20;
    }


}

function drawGameScreen() {
    console.log("paused?" + gamePaused);
    if (gamePaused) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(gameLoop);

    if (upgradeCardsVisible) {
        drawUpgradeCardsScreen();
    }
}

window.addEventListener('keydown', handleUpgradeSelection);



function defeatMob(xpDropped) {
    console.log("Mob defeated!");
    character.addXP(xpDropped);  // Add XP to player
}

function selectCard(cardName) {
    console.log(`Card selected: ${cardName}`);

    // Apply the effect based on the selected card
    switch (cardName) {
        case "Health Boost":
            character.health += 20;
            console.log("Health increased by 20!");
            break;
        case "Speed Boost":
            character.speed += 1;
            console.log("Speed increased by 1!");
            break;
        case "Flame Sword":
            character.currentWeapon = { name: "Flame Sword", damage: 20 };
            console.log("Equipped new weapon: Flame Sword!");
            break;
        default:
            console.log("No valid upgrade selected.");
            break;
    }

    // Hide the upgrade cards UI after selection
    document.getElementById("upgrade-cards").style.display = "none";

    console.log("have selected");
    // Hide the upgrade cards screen
    gamePaused = false; // Resume the game
    upgradeCardsVisible = false; // Hide upgrade cards

    console.log("draw game screen");
    // Clear the canvas (or redraw the game state)
    drawGameScreen(); // Assuming you have a draw function for your game screen
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function upgradeWeapon() {
    character.currentWeapon.speed += 1; // Shoot faster
    character.currentWeapon.damage += 2; // Hit harder
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Level: " + character.level, 20, 50);
}

function checkAllImagesLoaded() {
    loadedImages++;
    if (loadedImages === totalImages) {
        console.log("All images loaded. Starting game.");
        gameLoop();
    }
}

function shootVine(enemy) {
    let angle = Math.atan2(character.y - enemy.y, character.x - enemy.x); // ✅ Get angle to player
    let speed = 3; // ✅ Increase vine speed

    vines.push({
        x: enemy.x,
        y: enemy.y,
        dx: Math.cos(angle) * speed, // ✅ Use cosine for X direction
        dy: Math.sin(angle) * speed, // ✅ Use sine for Y direction
        width: 10,
        height: 5
    });
}


function updateVines() {
    vines.forEach((vine, index) => {
        vine.x += vine.dx; // ✅ Vine should move
        vine.y += vine.dy;

        // ✅ Check if it hits the player
        if (Math.abs(vine.x - character.x) < 10 && Math.abs(vine.y - character.y) < 10) {
            character.health -= 5; 
            vines.splice(index, 1);
        }

        // ✅ Remove if off-screen
        if (vine.x < 0 || vine.x > canvas.width || vine.y < 0 || vine.y > canvas.height) {
            vines.splice(index, 1);
        }
    });
}


function drawVines() {
    vines.forEach(vine => {
        ctx.fillStyle = "green";
        ctx.fillRect(vine.x, vine.y, vine.width, vine.height);
    });
}

function saveScore() {
    let highScore = localStorage.getItem("highScore") || 0;
    if (score > highScore) {
        localStorage.setItem("highScore", score);
    }
}

function spawnEnemies() {
    enemies = [];

    let bigExists = false;
    let hugeMode = false;

    for (let i = 0; i < enemiesPerWave; i++) {
        let type;

        // Repeat selection until a valid type is chosen under rules
        while (true) {
            type = weightedRandomEnemy();

            if (type.size === "big" && bigExists) continue;
            if (type.size === "huge") {
                hugeMode = true;
                break; // Only huge allowed now
            }
            break;
        }

        if (hugeMode) {
            enemies = []; // Clear all others
            i = 0;
        }

        // Spawn logic
        let enemy;
        let validSpawn = false;

        while (!validSpawn) {
            let spawnX = Math.floor(Math.random() * (MAP_WIDTH * TILE_SIZE - type.width));
            let spawnY = Math.floor(Math.random() * (MAP_HEIGHT * TILE_SIZE - type.height));

            spawnX = Math.max(0, Math.min(spawnX, canvas.width - type.width));
            spawnY = Math.max(0, Math.min(spawnY, canvas.height - type.height));

            let spawnIndex = Math.floor((spawnY + TILE_SIZE * 0.5) / TILE_SIZE) * columns +
                             Math.floor((spawnX + TILE_SIZE * 0.5) / TILE_SIZE);

            if (!solid.includes(currentMap[spawnIndex])) {
                validSpawn = true;

                enemy = {
                    name: type.name,
                    size: type.size,
                    x: spawnX,
                    y: spawnY,
                    width: type.width,
                    height: type.height,
                    speed: type.speed,
                    img: new Image(),
                    frameWidth: type.frameWidth,
                    frameHeight: type.frameHeight,
                    frameIndex: type.frameIndex,
                    frameTimer: type.frameTimer,
                    frameDelay: type.frameDelay,
                    totalFrames: type.totalFrames,
                    attackCooldown: type.attackCooldown,
                    health: type.health,
                    maxHealth: type.maxHealth,
                    damage: type.damage,
                    score: type.score
                };

                enemy.img.src = type.imgSrc;
                enemy.img.onload = checkAllImagesLoaded;

                if (type.size === "big") bigExists = true;
            }
        }

        enemies.push(enemy);

        if (hugeMode) break;
    }
}



spawnEnemies();

// character.img = new Image();
// character.img.onload = checkAllImagesLoaded;
// character.img.src = 'images/green-guy.png';
// character.health = 100;
// character.maxHealth = 100;
// character.attackDamage = 50;
// character.invincible = false;
// character.invincibleTimer = 0;
// character.invincibleCooldown = 30;

// Enemy stats
enemies.forEach(enemy => {
    enemy.health = 100; // Enemy HP
    enemy.maxHealth = 100;
});

var player_index = Math.floor((character.y + scaled_size * 0.5) / scaled_size) * columns + 
Math.floor((character.x + scaled_size * 0.5) /scaled_size);

function shootProjectile() {
    let weapon = character.currentWeapon;

    if (!weapon) {
        return;
    }

    let projectile = {
        x: character.x + character.frameWidth / 2,
        y: character.y + character.frameHeight / 2,
        speed: weapon.speed,
        damage: weapon.damage,
        heatSeeking: weapon.heatSeeking,
        direction: character.lastDirection,
        target: null, // For heat-seeking
        type: weapon.type, // ← Needed to differentiate visuals
        onHit: null     // ← Will be set below
    };

    // Assign special behavior based on weapon type
    switch (weapon.type) {
        case "thunder":
            projectile.onHit = applyThunderEffect;
            break;
        case "heatSeeking":
            // optional: add heat-seeking logic
            break;
        case "regular":
        default:
            // No special effect
            break;
    }

    // Handle heat-seeking targeting
    if (weapon.heatSeeking) {
        let closestEnemy = null;
        let minDistance = Infinity;

        enemies.forEach(enemy => {
            let dx = enemy.x - projectile.x;
            let dy = enemy.y - projectile.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                closestEnemy = enemy;
            }
        });

        projectile.target = closestEnemy;
    }

    projectiles.push(projectile);
}



function findClosestEnemy(projectile) {
    let closestEnemy = null;
    let minDistance = Infinity;

    enemies.forEach(enemy => {
        let dx = enemy.x - projectile.x;
        let dy = enemy.y - projectile.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
            minDistance = distance;
            closestEnemy = enemy;
        }
    });

    return closestEnemy;
}

function defeatMob(xpDropped) {
    console.log("Mob defeated!");
    character.addXP(xpDropped);  // Add XP to player
}

function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];

        // Movement logic
        if (projectile.heatSeeking && projectile.target) {
            let dx = projectile.target.x - projectile.x;
            let dy = projectile.target.y - projectile.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                projectile.x += (dx / distance) * projectile.speed;
                projectile.y += (dy / distance) * projectile.speed;
            }
        } else {
            if (projectile.direction === 0) projectile.y += projectile.speed; // Down
            if (projectile.direction === 1) projectile.y -= projectile.speed; // Up
            if (projectile.direction === 2) projectile.x -= projectile.speed; // Left
            if (projectile.direction === 3) projectile.x += projectile.speed; // Right
        }

        // Out-of-bounds check
        if (
            projectile.x < 0 || projectile.x > canvas.width ||
            projectile.y < 0 || projectile.y > canvas.height
        ) {
            projectiles.splice(i, 1);
            continue;
        }

        // Collision check
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (isColliding(projectile, enemy)) {
                // Apply base damage
                enemy.health -= projectile.damage;

                // Apply special effect if any
                if (typeof projectile.onHit === "function") {
                    projectile.onHit(projectile, enemy);
                }

                // Remove projectile after hit
                projectiles.splice(i, 1);

                // Check if enemy is dead
                if (enemy.health <= 0) {
                    defeatMob(enemy.score);
                    score += enemy.score;
                    enemies.splice(j, 1);
                }

                break; // No need to check more enemies
            }
        }
    }
}


function drawPotions() {
    potions.forEach(drawPotion);
}

function drawPotion(potion) {
    ctx.drawImage(potion.image, potion.x, potion.y, potion.width, potion.height);
}

function attack() {
    const weapon = character.currentWeapon;
    if (!weapon) return;

    if (weapon.name === "Flame Sword") {
        attackArc();
    } else if (weapon.name === "Lightning Blade") {
        attackAOE();
    } else {
        const isHeatSeeking = weapon.name === "Heat-Seeking Bow";
        shootProjectile(isHeatSeeking);
    }
}



// Function to draw projectiles
function drawProjectiles() {
    projectiles.forEach(projectile => {
        // Set the color based on the projectile's type
        if (projectile.type === "thunder") {
            ctx.fillStyle = "blue";  // Thunder Bow projectiles are blue
        } else if (projectile.type === "regular") {
            ctx.fillStyle = "white";  // Regular Bow projectiles are white
        } else if (projectile.type === "heatSeeking") {
            ctx.fillStyle = "red";  // Heat-Seeking Bow projectiles are red
        }

        // Draw the projectile
        ctx.fillRect(projectile.x, projectile.y, projectileSize, projectileSize);
    });
}

let swordArcs = [];

function attackArc() {
    const arcRange = 80; // attack distance
    const arcAngle = Math.PI / 2; // 90-degree arc
    const damage = character.currentWeapon.damage;

    // Map lastDirection to a facing angle
    let facingAngle;
    switch (character.lastDirection) {
        case 0: facingAngle = Math.PI / 2; break; // down
        case 1: facingAngle = -Math.PI / 2; break; // up
        case 2: facingAngle = Math.PI; break; // left
        case 3: facingAngle = 0; break; // right
        default: facingAngle = 0; break;
    }

    swordArcs.push({
        x: character.x,
        y: character.y,
        radius: 50,
        startAngle: facingAngle - arcAngle / 2,
        endAngle: facingAngle + arcAngle / 2,
        alpha: 1, // Start fully visible
    });

    enemies.forEach((enemy, index) => {
        const dx = enemy.x - character.x;
        const dy = enemy.y - character.y;
        const distance = Math.hypot(dx, dy);
    
        if (distance > arcRange) return;
    
        const angleToEnemy = Math.atan2(dy, dx);
        let angleDiff = Math.abs(angleToEnemy - facingAngle);
    
        // Normalize angle difference to [0, π]
        angleDiff = Math.min(angleDiff, Math.abs(2 * Math.PI - angleDiff));
    
        if (angleDiff <= arcAngle / 2) {
            // ✅ Hit detected
            enemy.health -= damage;
            enemy.hit = true;
    
            if (enemy.health <= 0) {
                defeatMob(enemy.score);
                score += enemy.score;
                enemies.splice(index, 1); // use `index`, not `enemy`
            }
        }
    });
    
}

function drawSwordArcs() {
    swordArcs.forEach((arc, index) => {
        ctx.save();
        ctx.globalAlpha = arc.alpha;
        ctx.beginPath();
        ctx.moveTo(arc.x, arc.y);
        ctx.arc(arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle);
        ctx.closePath();
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.restore();

        // Fade out the arc
        arc.alpha -= 0.05;
        if (arc.alpha <= 0) {
            swordArcs.splice(index, 1);
        }
    });
}

let lightningStrikes = [];

function attackAOE() {
    const aoeRadius = 70;
    const damage = character.currentWeapon.damage;

    ctx.beginPath();
    ctx.arc(character.x, character.y, aoeRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "cyan";
    ctx.stroke();

    enemies.forEach((enemy, index) => {
        const dx = enemy.x - character.x;
        const dy = enemy.y - character.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= aoeRadius) {
            enemy.health -= damage;
            enemy.hit = true;

            if (enemy.health <= 0) {
                defeatMob(enemy.score);
                score += enemy.score;
                enemies.splice(index, 1);
            }
        }
    });
}

function showLightningStrike() {
    const dir = character.lastDirection;
    let dx = 0, dy = 0;

    if (dir === 0) dy = 1;
    else if (dir === 1) dy = -1;
    else if (dir === 2) dx = -1;
    else if (dir === 3) dx = 1;

    lightningStrikes.push({
        x: character.x + dx * 30,
        y: character.y + dy * 30,
        dx,
        dy,
        length: 80,
        alpha: 1
    });
}

function drawLightningStrikes() {
    for (let i = 0; i < lightningStrikes.length; i++) {
        const strike = lightningStrikes[i];
        const endX = strike.x + strike.dx * strike.length;
        const endY = strike.y + strike.dy * strike.length;

        ctx.beginPath();
        ctx.moveTo(strike.x, strike.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(0, 200, 255, ${strike.alpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        strike.alpha -= 0.1;
        if (strike.alpha <= 0) {
            lightningStrikes.splice(i, 1);
            i--;
        }
    }
}


let lightningFlashTimer = 0;

function applyThunderEffect(projectile, hitEnemy) {
    const radius = 800;

    enemies.forEach(enemy => {
        if (enemy === hitEnemy) return;

        const dx = enemy.x - hitEnemy.x;
        const dy = enemy.y - hitEnemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
            enemy.health -= projectile.damage / 2;

            lightningArcs.push({
                x1: hitEnemy.x + hitEnemy.width / 2,
                y1: hitEnemy.y + hitEnemy.height / 2,
                x2: enemy.x + enemy.width / 2,
                y2: enemy.y + enemy.height / 2,
                timer: 5 // lasts 5 frames
            });
        }
    });

    lightningFlashTimer = 5;
}


let lightningArcs = []; // Each entry: { x1, y1, x2, y2, timer }

function drawLightningArcs() {
    lightningArcs.forEach(arc => {
        ctx.strokeStyle = "rgba(0, 200, 255, 1)";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(arc.x1, arc.y1); // Start from origin

        let steps = 5;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const x = arc.x1 + (arc.x2 - arc.x1) * t + (Math.random() - 0.5) * 10;
            const y = arc.y1 + (arc.y2 - arc.y1) * t + (Math.random() - 0.5) * 10;
            ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.strokeStyle = "black"; // or whatever default
ctx.lineWidth = 1;
    });

    // Remove expired arcs
    lightningArcs = lightningArcs.filter(arc => --arc.timer > 0);
}

function drawLightningStrikes() {
    lightningStrikes.forEach(strike => {
        ctx.strokeStyle = "cyan";
        ctx.beginPath();
        ctx.moveTo(strike.x - 10, strike.y - 10);
        ctx.lineTo(strike.x + 10, strike.y + 10);
        ctx.stroke();
    });

    // Reduce timers and remove expired strikes
    lightningStrikes = lightningStrikes.filter(strike => --strike.timer > 0);
}



function startShooting() {
    if (!shootInterval) {
        shootProjectile(); // Instant first shot
        shootInterval = setInterval(shootProjectile, 300); // Fires every 300ms
    }
}

function stopShooting() {
    clearInterval(shootInterval);
    shootInterval = null;
}

function isColliding(entity1, entity2) {
    return (
        entity1.x < entity2.x + entity2.frameWidth &&
        entity1.x + (entity1.frameWidth || projectileSize) > entity2.x &&
        entity1.y < entity2.y + entity2.frameHeight &&
        entity1.y + (entity1.frameHeight || projectileSize) > entity2.y
    );
}


function checkCollisions() {
    enemies.forEach(enemy => {
        if (isColliding(character, enemy) && !character.invincible) {
            character.health -= enemy.damage;
            character.invincible = true;
            character.invincibleTimer = character.invincibleCooldown;
        }
    });

    // Handle invincibility timer
    if (character.invincible) {
        character.invincibleTimer--;
        if (character.invincibleTimer <= 0) {
            character.invincible = false;
        }
    }

    // Check if player is dead
    if (character.health <= 0) {
        character.health = 0;
        return; // Stops game logic from continuing if dead
    }
}

function drawHealthBar(entity, ctx) {
    let barWidth = entity.frameWidth;
    let barHeight = 5;
    let x = entity.x;
    let y = entity.y - 10; // Position above character/enemy

    // Draw background (missing health)
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw current health (green)
    let healthWidth = (entity.health / entity.maxHealth) * barWidth;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, barHeight);

    // Optional: Draw border for clarity
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, barWidth, barHeight);
}

// Simulate key presses for button clicks
function moveUp() {
    keys["ArrowUp"] = true;
    updateCharacter();
    keys["ArrowUp"] = false;
}

function moveDown() {
    keys["ArrowDown"] = true;
    updateCharacter();
    keys["ArrowDown"] = false;
}

function moveLeft() {
    keys["ArrowLeft"] = true;
    updateCharacter();
    keys["ArrowLeft"] = false;
}

function moveRight() {
    keys["ArrowRight"] = true;
    updateCharacter();
    keys["ArrowRight"] = false;
}


function updateCharacter() {
    character.moving = false;

    let nextX = character.x;
    let nextY = character.y;

    // Predict movement
    if (keys['ArrowUp'] && character.y > 0) {
        nextY -= character.speed;
        character.lastDirection = 1;
    }
    if (keys['ArrowDown'] && character.y < canvas.height - character.frameHeight) {
        nextY += character.speed;
        character.lastDirection = 0;
    }
    if (keys['ArrowLeft'] && character.x > 0) {
        nextX -= character.speed;
        character.lastDirection = 2;
    }
    if (keys['ArrowRight'] && character.x < canvas.width - character.frameWidth) {
        nextX += character.speed;
        character.lastDirection = 3;
    }

    // Calculate the new player_index for collision detection
    let nextIndex = Math.floor((nextY + scaled_size * 0.5) / scaled_size) * columns + 
                    Math.floor((nextX + scaled_size * 0.5) / scaled_size);

    // Check if the next tile is solid before allowing movement
    if (!solid.includes(currentMap[nextIndex])) {
        character.x = nextX;
        character.y = nextY;
        character.moving = true;
    }

    // Stomp plants if stepping on tile 150
    if (currentMap[nextIndex] == 150) {
        currentMap[nextIndex] = 151; // Change the tile
    }

    // Update animation frame
    if (character.moving) {
        character.frameTimer++;
        if (character.frameTimer >= character.frameDelay) {
            character.frameTimer = 0;
            character.frameIndex = (character.frameIndex + 1) % 3;
        }
    } else {
        character.frameIndex = 0; // Reset to idle
    }
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        let dx = character.x - enemy.x;
        let dy = character.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (enemy.name === "Ivy" && enemy.health < enemy.maxHealth / 2) {
            enemy.speed = 0.4; // ✅ Doubles speed when low health
        } 

        if(enemy.name === "Venosaur" && distance < 100) {
            enemy.speed = 0.8;
        }

        if (enemy.name === "Ivy" && distance < 200) {  // ✅ Ivy shoots if close
            
            if (enemy.attackCooldown <= 0) {
                shootVine(enemy);
                enemy.attackCooldown = 500; // ✅ Adjust cooldown for frequent attacks
            } else {
                enemy.attackCooldown--; // ✅ Decrease cooldown over time
            }
        
        } else if (distance > 0) {  // Normal movement
            let velocityX = (dx / distance) * enemy.speed;
            let velocityY = (dy / distance) * enemy.speed;

            enemy.x += velocityX;
            enemy.y += velocityY;
        }

        if (distance > 0) {
            let velocityX = (dx / distance) * enemy.speed;
            let velocityY = (dy / distance) * enemy.speed;

            // Predict next position
            let nextX = enemy.x + velocityX;
            let nextY = enemy.y + velocityY;

            // Calculate tile index for next position
            let nextIndex = Math.floor((nextY + scaled_size * 0.5) / scaled_size) * columns + 
                            Math.floor((nextX + scaled_size * 0.5) / scaled_size);

            // Check if the next move is valid
            if (!solid.includes(currentMap[nextIndex])) {
                enemy.x = nextX;
                enemy.y = nextY;

                // ✅ Save valid position
                enemy.lastValidX = enemy.x;
                enemy.lastValidY = enemy.y;
            } else {
                // 🚨 Stuck! Try alternative directions
                let possibleMoves = [
                    { x: enemy.x + enemy.speed, y: enemy.y },  // Right
                    { x: enemy.x - enemy.speed, y: enemy.y },  // Left
                    { x: enemy.x, y: enemy.y + enemy.speed },  // Down
                    { x: enemy.x, y: enemy.y - enemy.speed }   // Up
                ];

                let moved = false;
                for (let move of possibleMoves) {
                    let moveIndex = Math.floor((move.y + scaled_size * 0.5) / scaled_size) * columns + 
                                    Math.floor((move.x + scaled_size * 0.5) / scaled_size);

                    if (!solid.includes(currentMap[moveIndex])) {
                        enemy.x = move.x;
                        enemy.y = move.y;
                        moved = true;
                        break; // Stop checking once a valid move is found
                    }
                }

                // If no alternative move found, revert to last valid position
                if (!moved) {
                    enemy.x = enemy.lastValidX;
                    enemy.y = enemy.lastValidY;
                }
            }

            // ✅ Determine animation row based on movement
            if (Math.abs(dx) > Math.abs(dy)) {
                enemy.lastDirection = dx > 0 ? 2 : 1; // 2 = Right, 1 = Left
            } else {
                enemy.lastDirection = dy > 0 ? 0 : 3; // 3 = Down, 0 = Up
            }
        }

        // Keep enemies within bounds
        enemy.x = Math.max(0, Math.min(enemy.x, canvas.width - scaled_size));
        enemy.y = Math.max(0, Math.min(enemy.y, canvas.height - scaled_size));

        // Check for collision with player
        if (distance < 20) { 
            character.health -= 10; // Damage player
            enemies.splice(index, 1);  // Remove enemy
        }

        // ✅ Update animation frame
        enemy.frameTimer++;
        if (enemy.frameTimer >= enemy.frameDelay) {
            enemy.frameTimer = 0;
            enemy.frameIndex = (enemy.frameIndex + 1) % 4; // 4 columns per row (updated)
        }
        
    });

    // ✅ Ensure the next wave spawns correctly
    if (enemies.length === 0) {
        waveNumber++;
        enemiesPerWave = Math.max(2, enemiesPerWave + 2); // Increase enemy count per wave
        spawnEnemies();
    }
}


function spawnPotion() {
    let potion = {
        x: Math.random() * (canvas.width - 32), // Keep inside the canvas
        y: Math.random() * (canvas.height - 32),
        width: 12,
        height: 12,
        image: potionImage
    };
    potions.push(potion);
}

spawnPotion();

function checkPlayerHealth() {
    if (character.health <= 0) {
        saveScore();
        gameOver = true;
    }
}


function checkPotionCollision() {
    for (let i = 0; i < potions.length; i++) {
        let potion = potions[i];

        // Check if character overlaps the potion (hitbox collision)
        if (
            character.x < potion.x + potion.width &&
            character.x + character.frameWidth > potion.x &&
            character.y < potion.y + potion.height &&
            character.y + character.frameHeight > potion.y
        ) {
            // ✅ Heal the player
            character.health = Math.min(character.health + 40, 100); // Max health 100
            potions.splice(i, 1); // ✅ Remove the potion after pickup
            i--; // ✅ Adjust index since we removed an element
        }
    }
}

// Drawing Functions
function drawCharacter() {
    if (character.img.complete) {  // Check if the image is fully loaded

        ctx.drawImage(
            character.img,
            character.frameIndex * character.frameWidth, character.lastDirection * character.frameHeight, // Source position on sprite sheet
            character.frameWidth, character.frameHeight,  // Width and height of the frame to draw
            character.x, character.y,                     // Position on canvas
            character.frameWidth, character.frameHeight  // Size on canvas
        );

        // Draw health bar after drawing character
        drawHealthBar(character, ctx);
    } else {
        console.log("Image not loaded yet");
    }
}

const TILE_SIZE2 = 60; // Each tile is 60px now
const H_SPACING = 0; // Horizontal spacing between frames (this is based on your previous description)
const V_SPACING = 1; // Vertical spacing between frames

const FRAME_WIDTH = TILE_SIZE2;  // Frame width is now 60px
const FRAME_HEIGHT = TILE_SIZE2; // Frame height is also 60px

const H_MARGIN = 10; // 1/2 tile for horizontal margin (if needed)
const V_MARGIN = TILE_SIZE2 / 4; // 1/2 tile for vertical margin (if needed)

function drawEnemies() {
    enemies.forEach(enemy => {
        let col = enemy.frameIndex; // Column in sprite sheet (frame index)
        let row = enemy.lastDirection ?? 0; // Row in sprite sheet (animation row)

        // Calculate source X and Y for the sprite in the sprite sheet
        let sx = H_MARGIN + col * (FRAME_WIDTH + H_SPACING);  // X offset + frame width + horizontal spacing
        let sy = V_MARGIN + row * (FRAME_HEIGHT + V_SPACING); // Y offset + frame height + vertical spacing

        // Draw the sprite using drawImage with correct source and destination dimensions
        ctx.drawImage(
            enemy.img,           // Image source
            sx, sy,              // Source coordinates for the sprite
            FRAME_WIDTH, FRAME_HEIGHT,  // Width and height of the sprite in the sprite sheet
            enemy.x, enemy.y,    // Destination coordinates on canvas
            enemy.width, enemy.height  // Destination dimensions (may scale if needed)
        );

        drawHealthBar(enemy, ctx);
    });
}

function getSpriteSheetCoords(col, row, frameWidth, frameHeight, hMargin, vMargin, hSpacing, vSpacing) {
    const sx = hMargin + col * (frameWidth + hSpacing);
    const sy = vMargin + row * (frameHeight + vSpacing);
    return { sx, sy };
}


function updatePlayerIndex() {
    player_index = Math.floor((character.y + scaled_size * 0.5) / scaled_size) * columns + 
                   Math.floor((character.x + scaled_size * 0.5) / scaled_size);
}

function action() {
    if (!isShooting) {
        isShooting = true;
        startShooting();
    }
}


//#region Constants & Variables
// document.addEventListener("keydown", (event) => {
//     if (event.code === "Space") {
//         let isHeatSeeking = character.currentWeapon.name === "Heat-Seeking Bow";
//         shootProjectile(isHeatSeeking);
//     }
// });

document.addEventListener("keydown", (event) => {
    if (event.code === "Digit1") {
        character.currentWeapon = weapons.regularBow;
    }
    if (event.code === "Digit2") {
        character.currentWeapon = weapons.heatSeekingBow;
    }
    if (event.code === "Digit3") {
        character.currentWeapon = weapons.thunderBow;
    }
    if (event.code === "Digit4") {
        character.currentWeapon = weapons.flameSword;
    }
    if (event.code === "Digit5") {
        character.currentWeapon = weapons.lightningBlade;
    }
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !isShooting) {
        action();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
        isShooting = false;
        stopShooting();
    }
});

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

document.addEventListener("keydown", function(event) {
    if (event.key === "r" && gameOver) {
        restartGame();
    }
});
//#endregion

function drawGameOverScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2);
    
    let highScore = localStorage.getItem("highScore") || 0;
    ctx.fillText("High Score: " + highScore, canvas.width / 2, canvas.height / 2 + 40);
    
    ctx.font = "20px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 80);
}

function checkTileCollision() {
    let tileX = Math.floor(character.x / TILE_SIZE);
    let tileY = Math.floor(character.y / TILE_SIZE);
    let tileIndex = tileY * MAP_WIDTH + tileX;

    if (currentMap === map1 && mapData[tileIndex] === 5) {
        // swapMap(map2);
    } 
    else if (currentMap === map2 && mapData[tileIndex] === 8) {
        // swapMap(map1);
    }
}

function restartGame() {
    score = 0;
    character.health = character.maxHealth;
    gameOver = false;
    spawnEnemies();
    ShowClassSelection();
    selectClass();
}

//#region Game Loop
let lastTime = 0;
let shootCooldown = 0; 
let gamePaused = false; 

function gameLoop(timestamp) {

    
    if (!lastTime) lastTime = timestamp;  // Set initial time on first frame
    const deltaTime = (timestamp - lastTime) / 1000; // Convert to seconds

    if (isNaN(shootCooldown)) {
        shootCooldown = 0; // Reset if NaN for any reason
    }

    shootCooldown -= deltaTime;

    if (shootCooldown <= 0 && !gameOver) {
        attack();
    
        const weapon = character.currentWeapon;
        if (weapon) {
            shootCooldown = 1 / weapon.speed;
        }
    }
    

    console.log()

    lastTime = timestamp;

    if (gameOver) {
        drawGameOverScreen();
        return; // Stop the game loop
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawMap();
    drawVines();
    drawEnemies();
    drawCharacter();
    drawProjectiles();
    drawPotions();
    drawScore();
    drawLightningArcs();
    drawSwordArcs();
    drawLightningStrikes();
    
    checkTileCollision();
    checkCollisions();
    mapCollide();

    updateEnemies();
    updateVines();
    updateProjectiles();
    updateCharacter();
    updatePlayerIndex();
    
    checkPotionCollision();
    checkPlayerHealth();
    
    //Potential take dmg warning?
    // if (lightningFlashTimer > 0) {
    //     ctx.fillStyle = "rgba(0, 150, 255, 0.3)"; // Semi-transparent blue
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    //     lightningFlashTimer--;
    // }

    
    if (!gamePaused) {

    requestAnimationFrame(gameLoop); // Keep the loop running
    }
}

//#endregion

//#region tileset
tileset.onload = () => {
    resizeCanvas();
    requestAnimationFrame((t) => {
        lastTime = t; // Reset timing
        gameLoop(t);
    });
};
//#endregion