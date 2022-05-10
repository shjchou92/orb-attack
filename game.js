'use strict';

// For Tutorial modal
const tutorial = document.querySelector('.popup');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.closeBtn');
const tutorialBtn = document.querySelector('#howToPlay');

const openTutorial = function() {
    tutorial.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeTutorial = function() {
    tutorial.classList.add('hidden');
    overlay.classList.add('hidden');
};

tutorialBtn.addEventListener('click', openTutorial);
closeBtn.addEventListener('click', closeTutorial);
overlay.addEventListener('click', closeTutorial)

addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !tutorial.classList.contains('hidden')) {
        closeTutorial();
    }
});

// Game Content

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const scoreEl = document.querySelector('#scoreEl');
const startGame = document.querySelector('#startGameBtn');
const startChallenge = document.querySelector('#startChallengeBtn');
const gameMenu = document.querySelector('#gameMenu');
const gameTitle = document.querySelector('#gameTitle');
const playerScore = document.querySelector('.playerScore');
const bigScore = document.querySelector('#bigScore');


class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.friction = 0.99;
        this.powerUp = '';
        this.alpha = 1;
    }

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    };

    update() {
        this.draw();
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // To prevent player moving outside the screen
        if (this.x - this.radius + this.velocity.x > 0 && this.x + this.radius + this.velocity.x < canvas.width) {
            this.x += this.velocity.x;
        } else {
            this.velocity.x = 0;
        };

        if (this.y - this.radius + this.velocity.y > 0 && this.y + this.radius + this.velocity.y < canvas.height) {
            this.y += this.velocity.y;
        } else {
            this.velocity.y = 0;
        };
    }

    shoot(mouse, color='white') {
        const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        projectiles.push(new Projectile(this.x, this.y, 5, color, { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 }));
    };

    tripleShoot(mouse, color='#1f00ff') {
        const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        const angleLeft = angle - 0.25;
        const angleRight = angle + 0.25;
        projectiles.push(new Projectile(this.x, this.y, 5, color, { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 }));
        projectiles.push(new Projectile(this.x, this.y, 5, color,{ x: Math.cos(angleLeft) * 5, y: Math.sin(angleLeft) * 5 }));
        projectiles.push(new Projectile(this.x, this.y, 5, color,{ x: Math.cos(angleRight) * 5, y: Math.sin(angleRight) * 5 }));
    };
};


class Shield {
    constructor() {
        this.radius = 30;
        this.color = 'white';
        this.angle = 0;
        this.half = 0.25 * Math.PI;
        this.leftEnd = this.angle - this.half;
        this.rightEnd = this.angle + this.half;
    };

    draw() {
        c.beginPath();
        c.arc(player.x, player.y, this.radius, this.leftEnd, this.rightEnd);
        c.strokeStyle = this.color;
        c.lineWidth = 3;
        c.stroke();
        c.closePath();
    };

    update() {
        if (player.powerUp !== 'star') {
            this.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
            this.leftEnd = this.angle - this.half;
            this.rightEnd = this.angle + this.half;
        }
        this.draw();
    };
};


class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fillStyle = this.color;
        c.fill();
    };

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
};


const powerUpImg = new Image();
const tridentImg = new Image();
const explodeImg = new Image();
const starImg = new Image();
powerUpImg.src = './img/lightning.png';
tridentImg.src = './img/three.png';
explodeImg.src = './img/danger.png';
starImg.src = './img/star.png';


class MachineGun {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.width = 14;
        this.height = 18;
    };

    draw() {
        c.save();
        c.translate(this.x + this.width / 2, this.y + this.height / 2);
        c.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        c.drawImage(powerUpImg, this.x, this.y, this.width, this.height);
        c.restore();
    };

    update() {
        this.draw();
        this.x += this.velocity.x * 1.5;
        this.y += this.velocity.y * 1.5;
    };
};


class TripleShot {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.width = 24;
        this.height = 24;
    };

    draw() {
        c.save();
        c.translate(this.x + this.width / 2, this.y + this.height / 2);
        c.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        c.drawImage(tridentImg, this.x, this.y, this.width, this.height);
        c.restore();
    };

    update() {
        this.draw();
        this.x += this.velocity.x * 2;
        this.y += this.velocity.y * 2;
    };
};


class NuclearBomb {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.width = 20;
        this.height = 20;
    };

    draw() {
        c.save();
        c.translate(this.x + this.width / 2, this.y + this.height / 2);
        c.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        c.drawImage(explodeImg, this.x, this.y, this.width, this.height);
        c.restore();
    };

    update() {
        this.draw();
        this.x += this.velocity.x * 2.5;
        this.y += this.velocity.y * 2.5;
    };
};


class Star {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.width = 20;
        this.height = 20;
    };

    draw() {
        c.save();
        c.translate(this.x + this.width / 2, this.y + this.height / 2);
        c.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        c.drawImage(starImg, this.x, this.y, this.width, this.height);
        c.restore();
    };

    update() {
        this.draw();
        this.x += this.velocity.x * 2.5;
        this.y += this.velocity.y * 2.5;
    };
};


class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.type = 'linear';
        this.center = { x, y }; // For spinning enemies
        this.radians = 0;

        if (Math.random() > 0.5) {
            this.type = 'homing';

            if (Math.random() < 0.5) {
                this.type = 'spinning';
                
                if (Math.random() < 0.5) {
                    (!mobileGame) ? this.type = 'jet' : this.type = 'linear';

                    if (Math.random() < 0.35) {
                        this.type = 'homingSpinning';
                    };
                };
            };
        };
    };

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fillStyle = this.color;
        c.fill();
    };

    update() {
        this.draw();

        if (this.type === 'linear') {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        } else if (this.type === 'homing') {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.velocity = { x: Math.cos(angle), y: Math.sin(angle) };
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        } else if (this.type === 'spinning') {
            this.radians += 0.05;
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;
            this.x = this.center.x + Math.cos(this.radians) * 100;
            this.y = this.center.y + Math.sin(this.radians) * 100;
        } else if (this.type === 'homingSpinning') {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.velocity = { x: Math.cos(angle), y: Math.sin(angle) };
            this.radians += 0.05;
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;
            this.x = this.center.x + Math.cos(this.radians) * 100;
            this.y = this.center.y + Math.sin(this.radians) * 100;
        } else if (this.type === 'jet') {
            this.x += this.velocity.x * 5;
            this.y += this.velocity.y * 5;
        };
    };
};


class ShootingEnemy {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.type = 'static';
        this.counter = Math.round(Math.random() * (150 - 100) + 100);
    };

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fillStyle = this.color;
        c.fill();
    };

    update(frame) {
        this.draw();
        this.shoot(frame);
    };

    shoot(frame) {
        if (frame % this.counter === 0) {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            enemyProjectiles.push(new Projectile(this.x, this.y, 5, this.color, { x: Math.cos(angle) * 3.5, y: Math.sin(angle) * 3.5 }));
        };
    };
};


// To Create the particle effect
const friction = 0.99;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    };

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    };
};


// The static dots in the background
class BackgroundParticle {
    constructor(x, y, radius, color, alphaNum) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.alpha = alphaNum;
        this.initialAlpha = this.alpha;
    };

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    };

    update() {
        this.draw();
    };
};


// The nuke power blast radius
class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.color = 'white';
    };

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.strokeStyle = this.color;
        c.stroke();
    };

    update() {
        this.draw();
        this.radius += 8;
    };
};

let player;
let shield;
let alphaNum;
let projectiles = [];
let enemies = [];
let shootingEnemies = [];
let enemyProjectiles = [];
let particles = [];
let powerUps = [];
let backgroundParticles = [];
let pushMovement = document.querySelector('#pushMovement');

function init(challenge=false) {
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    player = new Player(x, y, 10, 'white');
    if (challenge) {
        if (!mobileGame) shield = new Shield();
        shootingEnemies = [];
        enemyProjectiles = [];
        alphaNum = 0.2;
    } else {
        enemies = [];
        alphaNum = 0.05;
    };
    pushMovement = document.querySelector('#pushMovement');
    projectiles = [];
    particles = [];
    powerUps = [];
    backgroundParticles = [];

    for (let x = 0; x < canvas.width; x += 30) {
        for (let y = 0; y < canvas.height; y += 30){
            backgroundParticles.push(new BackgroundParticle(x, y, 3, 'blue', alphaNum));
        };
    };
};

function spawnEnemies(player) {
    // Randomize the size of our enemy
    const radius = Math.random() * (30 - 5) + 5;
    let x;
    let y;
    
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    };

    const angle = Math.atan2(player.y - y, player.x - x);
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    enemies.push(new Enemy(x, y, radius, color, velocity));
};

function spawnShootingEnemies() {
    const maxWidth = canvas.width - 75;
    const maxHeight = canvas.height - 75;
    let x = Math.random() * (maxWidth - 75) + 75;
    let y = Math.random() * (maxHeight - 75) + 75;

    if (Math.abs(player.x - x) < 150 && Math.abs(player.y - y) < 150) {
        while (Math.abs(player.x - x) < 150 && Math.abs(player.y - y) < 150) {
            x = Math.random() * (maxWidth - 75) + 75;
            y = Math.random() * (maxHeight - 75) + 75;
        };
    };

    const radius = Math.random() * (30 - 15) + 15;
    const color = `hsl(${Math.random() * 360}, 63%, 50%)`;
    shootingEnemies.push(new ShootingEnemy(x, y, radius, color));
};

function spawnPowerUps(powerType) {
    let x;
    let y;
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - 7 : canvas.width + 7;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - 9 : canvas.height + 9;
    }

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    if (powerType === 'bomb') {
        powerUps.push(new NuclearBomb(x, y, velocity));
    } else if (powerType === 'triple') {
        powerUps.push(new TripleShot(x, y, velocity));
    } else if (powerType === 'star') {
        powerUps.push(new Star(x, y, velocity));
    } else {
        powerUps.push(new MachineGun(x, y, velocity));
    };
};

function createScoreLabel(projectile, score) {
    const scoreLabel = document.createElement('label');
    scoreLabel.innerHTML = `+${score}`;
    scoreLabel.style.position = 'absolute';
    scoreLabel.style.color = 'white';
    scoreLabel.style.userSelect = 'none';
    scoreLabel.style.left = `${projectile.x}px`;
    scoreLabel.style.top = `${projectile.y}px`;
    document.body.appendChild(scoreLabel);

    gsap.to(scoreLabel, {
        opacity: 0,
        y: -30,
        duration: 0.75,
        onComplete: () => {
            scoreLabel.parentNode.removeChild(scoreLabel)
        }
    });
};

function movePlayer() {
    if (press.right && player.x < canvas.width-15) player.x += 5;
    if (press.left && player.x > 15) player.x -= 5;
    if (press.up && player.y > 15) player.y -= 5;
    if (press.down && player.y < canvas.height-15) player.y += 5;
};

function gameOver() {
    gameMenu.style.display = 'flex';
    startGame.style.display = 'block';
    startChallenge.style.display = 'block';
    if (!mobileGame) tutorialBtn.style.display = 'block';
    pushMovement.disabled = false;
    bigScore.innerHTML = score;
    playerScore.classList.remove('hidden');
    gameTitle.classList.add('hidden');

    gsap.to('#whiteGameMenu', {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'expo.out'
    });
}

let animationId;
let score = 0;
let frame = 0;
let press = { right: false, left: false, up: false, down: false };
let explode;
let powerType = '';

function animate() {
    animationId = requestAnimationFrame(animate);
    frame++;

    if (mobileGame) {
        if (frame % 75 === 0) spawnEnemies(player);
    } else {
        if (frame % 30 === 0) spawnEnemies(player);
    }

    if (mobileGame && frame % 2000 === 0) {
        powerType = 'bomb';
    } else if (frame % 4000 === 0) {
        powerType = 'bomb';
    } else if (frame % 1000 === 0) {
        powerType = (Math.random() < 0.4) ? 'triple' : "";
    }
    spawnPowerUps(powerType);
    
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (mobileGame || pushMovement.checked) {
        player.update();
    } else {
        player.draw();
        movePlayer();
    }

    backgroundParticles.forEach((backgroundParticle) => {
        const bgPlayerDist = Math.hypot(player.x - backgroundParticle.x, player.y - backgroundParticle.y);
        const hideRadius = 100;

        if (bgPlayerDist < hideRadius) {
            backgroundParticle.alpha = (bgPlayerDist < 70) ? 0 : 0.5;
        } else if (bgPlayerDist >= hideRadius && backgroundParticle.alpha < backgroundParticle.initialAlpha) {
            backgroundParticle.alpha += 0.01;
        } else if (bgPlayerDist >= hideRadius && backgroundParticle.alpha > backgroundParticle.initialAlpha) {
            backgroundParticle.alpha -= 0.01;
        };
        backgroundParticle.update();
    });

    particles.forEach((particle, index) => {
        (particle.alpha <= 0) ? particles.splice(index, 1) : particle.update();
    });
    
    // Conditional for if the player obtained the power up
    if (player.powerUp === 'automatic' && mouse.down) {
        if (frame % 4 === 0) player.shoot(mouse, '#fff500');
    } else if (player.powerUp === 'triple' && mouse.down) {
        if (frame % 12 === 0) player.tripleShoot(mouse);
    } else if (mobileGame && mouse.down) {
        if (frame % 18 === 0) player.shoot(mouse);
    }

    if (player.powerUp === 'explosion' || explode) {
        if (explode && explode.radius < canvas.width) {
            explode.update();

            enemies.forEach((enemy, index) => {
                const bombEnemyDist = Math.hypot(enemy.x - explode.x, enemy.y - explode.y);
                if (bombEnemyDist - explode.radius < 0.25) {
                    for (let i = 0; i < enemy.radius * 2; i++) {
                        particles.push(new Particle(
                            enemy.x, 
                            enemy.y, 
                            Math.random()*2,
                            enemy.color, 
                            {
                                x: (Math.random()-0.5) * (Math.random() * 8),
                                y: (Math.random()-0.5) * (Math.random() * 8)
                            }
                        ));
                    };
                    
                    score += 250;
                    scoreEl.innerHTML = score;
                    createScoreLabel(enemy, 250);

                    backgroundParticles.forEach(backgroundParticle => {
                        backgroundParticle.color = enemy.color;
                        gsap.to(backgroundParticle, {
                            alpha: 0.5,
                            duration: 0.015,
                            onComplete: () => {
                                gsap.to(backgroundParticle, {
                                    alpha: backgroundParticle.initialAlpha,
                                    duration: 0.03
                                })
                            }
                        });
                    });
                    setTimeout(() => {
                        const enemyFound = enemies.find((enemyValue) => {
                            return enemyValue === enemy;
                        });
                        if (enemyFound) enemies.splice(index, 1);
                    }, 0);
                };
            });
        } else {
            player.powerUp = null;
            explode = null;
        };
    };

    // Power ups movement in Canvas
    powerUps.forEach((powerUp, index) => {
        const powerPlayerDist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y);

        if (powerPlayerDist - player.radius - powerUp.width / 2 < 1) {
            if (powerUp.width === 14) {
                player.color = '#ffffb9';
                player.powerUp = 'automatic';
                setTimeout(() => {
                    player.powerUp = null;
                    player.color = '#fff';
                }, 10000);
            } else if (powerUp.width === 24) {
                player.color = '#00d8ff';
                player.powerUp = 'triple';
                setTimeout(() => {
                    player.powerUp = null;
                    player.color = '#fff';
                }, 10000);
            } else {
                explode = new Explosion(player.x, player.y);
                player.powerUp = 'explosion';
                player.color = '#fff'
            }
            powerUps.splice(index, 1);
        } else {
            powerUp.update();
        };
    });

    projectiles.forEach((projectile, index) => {
        projectile.update();

        // Remove projectiles from edge of screen
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        };
    });

    enemies.forEach((enemy, index) => {
        enemy.update();

        // Delete enemies outside of the screen
        if (enemy.x < -100 || enemy.x > canvas.width + 100 || enemy.y < -100 || enemy.y > canvas.height + 100) {
            setTimeout(() => {
                enemies.splice(index, 1);
            }, 0);
        };

        const enemyPlayerDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        // End game
        if (enemyPlayerDist - enemy.radius - player.radius < 1) {
            setTimeout(() => {
                cancelAnimationFrame(animationId);
                gameOver();
            }, 1000)

            for (let j = 0; j < player.radius * 2; j++) {
                particles.push(new Particle(
                    player.x,
                    player.y,
                    Math.random() * 2,
                    player.color,
                    {
                        x: (Math.random()-0.5) * (Math.random() * 8),
                        y: (Math.random()-0.5) * (Math.random() * 8)
                    }
                ));
            };
            player.alpha = 0;
        };

        // To start removing enemies upon hit from our projectile
        projectiles.forEach((projectile, projectileIndex) => {
            const projectileEnemyDist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            // When projectile touch enemy
            if (projectileEnemyDist - enemy.radius - projectile.radius < 0.25) {
                // Create particles for explosion
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(
                        projectile.x, 
                        projectile.y, 
                        Math.random()*2,
                        enemy.color, 
                        {
                            x: (Math.random()-0.5) * (Math.random() * 8),
                            y: (Math.random()-0.5) * (Math.random() * 8)
                        }
                    ));
                };

                // To add shrinking enemy effect
                if (enemy.radius - 10 > 5) {
                    score += 100;
                    scoreEl.innerHTML = score;
                    createScoreLabel(projectile, 100);
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {
                    score += 250;
                    scoreEl.innerHTML = score;
                    createScoreLabel(projectile, 250);

                    // Change backgroundParticle colors to the color of the enemy when hit
                    backgroundParticles.forEach(backgroundParticle => {
                        backgroundParticle.color = enemy.color;
                        gsap.to(backgroundParticle, {
                            alpha: 0.5,
                            duration: 0.015,
                            onComplete: () => {
                                gsap.to(backgroundParticle, {
                                    alpha: backgroundParticle.initialAlpha,
                                    duration: 0.03
                                })
                            }
                        });
                    });
                    setTimeout(() => {
                        // For bug fixing where random enemy is eliminated
                        const enemyFound = enemies.find((enemyValue) => {
                            return enemyValue === enemy;
                        });
                        if (enemyFound) {
                            enemies.splice(index, 1);
                            projectiles.splice(projectileIndex, 1);
                        };
                    }, 0);
                };
            };
        });
    });
};

function challenge() {
    animationId = requestAnimationFrame(challenge);
    frame++;

    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (mobileGame || pushMovement.checked) {
        player.update();
    } else {
        player.draw();
        movePlayer();
    }

    if (!mobileGame) shield.update();

    if (frame % 150 === 0) spawnShootingEnemies();

    if (mobileGame && frame % 2000 === 0) {
        powerType = 'star';
    } else if (frame % 4000 === 0) {
        powerType = 'star'; 
    } else if (frame % 1000 === 0) {
        powerType = (Math.random() < 0.4) ? 'triple' : "";
    };
    spawnPowerUps(powerType);
    
    if (player.powerUp === 'automatic' && mouse.down) {
        if (frame % 4 === 0) player.shoot(mouse, '#fff500');
    } else if (player.powerUp === 'triple' && mouse.down) {
        if (frame % 12 === 0) player.tripleShoot(mouse);
    } else if (mobileGame && mouse.down) {
        if (frame % 18 === 0) player.shoot(mouse);
    }

    powerUps.forEach((powerUp, index) => {
        const powerPlayerDist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y);

        if (powerPlayerDist - player.radius - powerUp.width / 2 < 1) {
            if (powerUp.width === 14) {
                player.color = '#ffffb9';
                player.powerUp = 'automatic';
                setTimeout(() => {
                    player.powerUp = null;
                    player.color = '#fff';
                }, 10000);
            } else if (powerUp.width === 24) {
                player.color = '#00d8ff';
                player.powerUp = 'triple';
                setTimeout(() => {
                    player.powerUp = null;
                    player.color = '#fff';
                }, 10000);
            } else {
                // Add invincible power
                player.powerUp = 'star';
                player.color = '#ff5151';
                shield.color = '#ff5151';
                shield.leftEnd = 0;
                shield.rightEnd = Math.PI * 2;
                setTimeout(() => {
                    player.powerUp = null;
                    player.color = '#fff';
                    shield.color = '#fff';
                    shield.leftEnd = shield.angle - shield.half;
                    shield.rightEnd = shield.angle + shield.half;
                }, 10000);
            };
            powerUps.splice(index, 1);
        } else {
            powerUp.update();
        };
    });

    backgroundParticles.forEach((backgroundParticle) => {
        const bgPlayerDist = Math.hypot(player.x - backgroundParticle.x, player.y - backgroundParticle.y);
        const hideRadius = 100;

        if (bgPlayerDist < hideRadius) {
            backgroundParticle.alpha = (bgPlayerDist < 70) ? 0 : 0.5;
        } else if (bgPlayerDist >= hideRadius && backgroundParticle.alpha < backgroundParticle.initialAlpha) {
            backgroundParticle.alpha += 0.01;
        } else if (bgPlayerDist >= hideRadius && backgroundParticle.alpha > backgroundParticle.initialAlpha) {
            backgroundParticle.alpha -= 0.01;
        };
        backgroundParticle.update();
    });

    particles.forEach((particle, index) => {
        (particle.alpha <= 0) ? particles.splice(index, 1) : particle.update();
    });

    projectiles.forEach((projectile, index) => {
        projectile.update();

        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        };
    });
    
    enemyProjectiles.forEach((projectile, index) => {
        projectile.update();

        // Check for collision with shield
        const playerProjectileDist = Math.hypot(player.x - projectile.x, player.y - projectile.y);
        if (!mobileGame) {
            const shieldAngle = Math.atan2(player.y - mouse.y, player.x - mouse.x);
            const projectileAngle = Math.atan2(player.y - projectile.y, player.x - projectile.x);
            const shieldProjectileDist = playerProjectileDist - projectile.radius - shield.radius;
            let shieldOffset = 0;
    
            if (player.powerUp === 'star') {
                if (shieldProjectileDist < 0.25) {
                    projectile.velocity.x = -projectile.velocity.x;
                    projectile.velocity.y = -projectile.velocity.y;
                };
            } else {
                // Need this condition to fix a bug in detecting collision between enemy projectile and edge of shield
                if (Math.abs(projectileAngle) >= (Math.PI - Math.PI*0.25)) {
                    shieldOffset = (projectileAngle < 0) ? Math.PI - (shieldAngle + Math.PI*0.25) : Math.PI + (shieldAngle - Math.PI*0.25);
                };
        
                if ((projectileAngle) >= (shieldAngle-(Math.PI*0.25)) && (projectileAngle) <= (shieldAngle+(Math.PI*0.25)) && shieldProjectileDist < 0.25) {
                    projectile.velocity.x = -projectile.velocity.x;
                    projectile.velocity.y = -projectile.velocity.y;
                };
                
                if (shieldOffset) {
                    if (projectileAngle < 0 && projectileAngle <= -Math.PI - shieldOffset + 0.2 && shieldProjectileDist < 0.25) {
                        projectile.velocity.x = -projectile.velocity.x;
                        projectile.velocity.y = -projectile.velocity.y;
                    } else if (projectileAngle > 0 && projectileAngle <= Math.PI - shieldOffset - 0.2 && shieldProjectileDist < 0.25) {
                        projectile.velocity.x = -projectile.velocity.x;
                        projectile.velocity.y = -projectile.velocity.y;
                    };
                };
            };
        };

        // Check for collision with player
        if (playerProjectileDist - projectile.radius - player.radius < 10) {
            setTimeout(() => {
                cancelAnimationFrame(animationId);
                gameOver();
            }, 1000);

            for (let i = 0; i < player.radius * 2; i++) {
                particles.push(new Particle(
                    player.x,
                    player.y,
                    Math.random() * 2,
                    player.color,
                    {
                        x: (Math.random()-0.5) * (Math.random() * 8),
                        y: (Math.random()-0.5) * (Math.random() * 8)
                    }
                ));
            };
            player.alpha = 0;
        };

        // Remove projectiles from edge of screen
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                enemyProjectiles.splice(index, 1);
            }, 0);
        };
    });

    shootingEnemies.forEach((enemy, index) => {
        enemy.update(frame);
        const enemyPlayerDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        // End game
        if (enemyPlayerDist - player.radius - enemy.radius < 0.01) {
            setTimeout(() => {
                cancelAnimationFrame(animationId);
                gameOver();
            }, 500);

            for (let i = 0; i < player.radius * 2; i++) {
                particles.push(new Particle(
                    player.x,
                    player.y,
                    Math.random() * 2,
                    player.color,
                    {
                        x: (Math.random()-0.5) * (Math.random() * 8),
                        y: (Math.random()-0.5) * (Math.random() * 8)
                    }
                ));
            };
            player.alpha = 0;
        };

        // Remove enemies from our projectile
        projectiles.forEach((projectile, projectileIndex) => {
            const projectileEnemyDist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            if (projectileEnemyDist - enemy.radius - projectile.radius < 0.25) {
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(
                        projectile.x,
                        projectile.y,
                        Math.random() * 2,
                        enemy.color,
                        {
                            x: (Math.random()-0.5) * (Math.random() * 8),
                            y: (Math.random()-0.5) * (Math.random() * 8)
                        }
                    ));
                };

                if (enemy.radius - 10 > 8) {
                    score += 100;
                    scoreEl.innerHTML = score;
                    createScoreLabel(projectile, 100);
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {
                    score += 250;
                    scoreEl.innerHTML = score;
                    createScoreLabel(projectile, 250);
                    backgroundParticles.forEach(backgroundParticle => {
                        backgroundParticle.color = enemy.color;
                        gsap.to(backgroundParticle, {
                            alpha: backgroundParticle.initialAlpha,
                            duration: 0.03
                        });
                    });
                    setTimeout(() => {
                        const enemyFound = shootingEnemies.find((enemyValue) => {
                            return enemyValue === enemy;
                        });
                        if (enemyFound) {
                            shootingEnemies.splice(index, 1);
                            projectiles.splice(projectileIndex, 1);
                        };
                    }, 0);
                };
            };
        });
    });
};

const mouse = { down: false, x: undefined, y: undefined };
let isChallenge = false;

// New event listener for automatic shooter power up
addEventListener('mousedown', ({ clientX, clientY }) => {
    mouse.x = clientX;
    mouse.y = clientY;
    mouse.down = true;
});

// This is to have the continuous projectiles follow the mouse movement
addEventListener('mousemove', ({ clientX, clientY }) => {
    mouse.x = clientX;
    mouse.y = clientY;
});

// Need this so that we can stop the automatic shooting power up.
addEventListener('mouseup', () => {
    mouse.down = false;
});

addEventListener('click', ({ clientX, clientY }) => {
    mouse.x = clientX;
    mouse.y = clientY;
    if (player){
        player.shoot(mouse);
    };
});

// Adding event listener for when browser is resized
addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init(isChallenge);
});

startGame.addEventListener('click', () => {
    isChallenge = false
    init(isChallenge);
    animate();
    score = 0;
    frame = 0;
    scoreEl.innerHTML = score;
    bigScore.innerHTML = score;

    gsap.to('#whiteGameMenu', {
        opacity: 0,
        scale: 0.75,
        duration: 0.25,
        ease: 'expo.in',
        onComplete: () => {
            gameMenu.style.display = 'none',
            startGame.style.display = 'none',
            startChallenge.style.display = 'none',
            pushMovement.disabled = true,
            tutorialBtn.style.display = 'none'
        }
    });
});

startChallenge.addEventListener('click', () => {
    isChallenge = true;
    init(isChallenge);
    challenge();
    score = 0;
    frame = 0;
    scoreEl.innerHTML = score;
    bigScore.innerHTML = score;
    
    gsap.to('#whiteGameMenu', {
        opacity: 0,
        scale: 0.75,
        duration: 0.25,
        ease: 'expo.in',
        onComplete: () => {
            gameMenu.style.display = 'none',
            startGame.style.display = 'none',
            startChallenge.style.display = 'none',
            pushMovement.disabled = true,
            tutorialBtn.style.display = 'none'
        }
    });
});

addEventListener('keydown', ({ key }) => {
    if (pushMovement.checked) {
        if (key === 'w') {
            player.velocity.y -= 1;
        } else if (key === 'a') {
            player.velocity.x -= 1;
        } else if (key === 's') {
            player.velocity.y += 1;
        } else if (key === 'd') {
            player.velocity.x += 1;
        };
    } else {
        if (key === 'd') {
            press.right = true;
        } else if (key === 'a') {
            press.left = true;
        } else if (key === 'w') {
            press.up = true;
        } else if (key === 's') {
            press.down = true;
        };
    };
});

addEventListener('keyup', ({key}) => {
    if (key === 'd') {
        press.right = false;
    } else if (key === 'a') {
        press.left = false;
    } else if (key === 'w') {
        press.up = false;
    } else if (key === 's') {
        press.down = false;
    };
});

// Mobile support

let mobileGame = false

addEventListener('touchstart', (event) => {
    mobileGame = true;

    window.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;

    mouse.down = true
});

addEventListener('touchmove', (event) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    const angle = Math.atan2(player.y - mouse.y, player.x - mouse.x)
    const xWay = Math.cos(angle);
    const yWay = Math.sin(angle);
    (xWay > 0) ? player.velocity.x -= 0.1 : player.velocity.x += 0.1;
    (yWay > 0) ? player.velocity.y -= 0.1 : player.velocity.y += 0.1;
});

addEventListener('touchend', () => {
    mouse.down = false
});