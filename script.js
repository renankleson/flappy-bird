// script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
canvas.width = 320;
canvas.height = 480;

// Variables
let birdX = 50;
let birdY = 200;
let birdWidth = 30;
let birdHeight = 30;
let birdSpeed = 5;
let gravity = 0.5;
let lift = -10;
let isGameOver = false;
let birdImage = new Image(); // The bird's image
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 3;
let pipes = [];
let score = 0;
let isMenu = true; // Track if we are in the menu
let selectedSkin = 'bird'; // Variable to store selected skin


// Load background image
let backgroundImage = new Image();
backgroundImage.src = 'fundo.png'; // Path to your background image

// Load Pipe (tubos)
const pipeImages = {
    'pipes': new Image(),
    'pipes2': new Image() // Add new pipe image for the top tube
};

// Set image source for pipes
pipeImages['pipes'].src = 'pipes.png'; // Bottom pipe
pipeImages['pipes2'].src = 'pipes2.png'; // Top pipe

// Load bird images
const birdImages = {
    'bird': new Image(),
    'bird2': new Image(),
    'bird3': new Image(),
    'bird4': new Image(),
};

// Set image sources
birdImages['bird'].src = 'bird.png';
birdImages['bird2'].src = 'bird2.png';
birdImages['bird3'].src = 'bird3.png';
birdImages['bird4'].src = 'bird4.png';

// Store the skin button positions
const buttonBounds = {
    'bird': { x: 100, y: 200, width: 120, height: 40 },
    'bird2': { x: 100, y: 250, width: 120, height: 40 },
    'bird3': { x: 100, y: 300, width: 120, height: 40 },
    'bird4': { x: 100, y: 350, width: 120, height: 40 },
    'start': { x: 100, y: 400, width: 120, height: 40 },
    'restart': { x: 100, y: 400, width: 120, height: 40 },
    'backToMenu': { x: 100, y: 450, width: 120, height: 40 } // New button for going back to the menu
};

// Handle mouse clicks for menu and restart
canvas.addEventListener('click', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    if (isMenu) {
        // Check if skin option is clicked
        if (mouseX > buttonBounds['bird'].x && mouseX < buttonBounds['bird'].x + buttonBounds['bird'].width &&
            mouseY > buttonBounds['bird'].y && mouseY < buttonBounds['bird'].y + buttonBounds['bird'].height) {
            selectedSkin = 'bird'; // Store selected skin
            startGame(selectedSkin);
        } else if (mouseX > buttonBounds['bird2'].x && mouseX < buttonBounds['bird2'].x + buttonBounds['bird2'].width &&
            mouseY > buttonBounds['bird2'].y && mouseY < buttonBounds['bird2'].y + buttonBounds['bird2'].height) {
            selectedSkin = 'bird2'; // Store selected skin
            startGame(selectedSkin);
        } else if (mouseX > buttonBounds['bird3'].x && mouseX < buttonBounds['bird3'].x + buttonBounds['bird3'].width &&
            mouseY > buttonBounds['bird3'].y && mouseY < buttonBounds['bird3'].y + buttonBounds['bird3'].height) {
            selectedSkin = 'bird3'; // Store selected skin
            startGame(selectedSkin);
        } else if (mouseX > buttonBounds['bird4'].x && mouseX < buttonBounds['bird4'].x + buttonBounds['bird4'].width &&
            mouseY > buttonBounds['bird4'].y && mouseY < buttonBounds['bird4'].y + buttonBounds['bird4'].height) {
            selectedSkin = 'bird4'; // Store selected skin
            startGame(selectedSkin);
        }

        // Check if the start button is clicked
        if (mouseX > buttonBounds['start'].x && mouseX < buttonBounds['start'].x + buttonBounds['start'].width &&
            mouseY > buttonBounds['start'].y && mouseY < buttonBounds['start'].y + buttonBounds['start'].height) {
            startGame(selectedSkin); // Use the selected skin
        }
    } else if (isGameOver) {
        // Restart the game
        if (mouseX > buttonBounds['restart'].x && mouseX < buttonBounds['restart'].x + buttonBounds['restart'].width &&
            mouseY > buttonBounds['restart'].y && mouseY < buttonBounds['restart'].y + buttonBounds['restart'].height) {
            restartGame(); // Restart with the previously selected skin
        }

        // Check if the back to menu button is clicked
        if (mouseX > buttonBounds['backToMenu'].x && mouseX < buttonBounds['backToMenu'].x + buttonBounds['backToMenu'].width &&
            mouseY > buttonBounds['backToMenu'].y && mouseY < buttonBounds['backToMenu'].y + buttonBounds['backToMenu'].height) {
            goBackToMenu();
        }
    }
});

// Handle the bird's movement with keyboard input (Space key for jumping)
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !isGameOver && !isMenu) {
        // Only jump if game is not over and not in the menu
        birdSpeed = lift;
    }
});

// Draw the menu
function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw background image

    // Draw menu title
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText('Flappy Bird', canvas.width / 2 - 100, 100);

    // Draw skin selection buttons
    ctx.fillStyle = 'white';
    ctx.fillRect(buttonBounds['bird'].x, buttonBounds['bird'].y, buttonBounds['bird'].width, buttonBounds['bird'].height);
    ctx.fillRect(buttonBounds['bird2'].x, buttonBounds['bird2'].y, buttonBounds['bird2'].width, buttonBounds['bird2'].height);
    ctx.fillRect(buttonBounds['bird3'].x, buttonBounds['bird3'].y, buttonBounds['bird3'].width, buttonBounds['bird3'].height);
    ctx.fillRect(buttonBounds['bird4'].x, buttonBounds['bird4'].y, buttonBounds['bird4'].width, buttonBounds['bird4'].height);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Bird 1', buttonBounds['bird'].x + 40, buttonBounds['bird'].y + 25);
    ctx.fillText('Bird 2', buttonBounds['bird2'].x + 40, buttonBounds['bird2'].y + 25);
    ctx.fillText('Bird 3', buttonBounds['bird3'].x + 40, buttonBounds['bird3'].y + 25);
    ctx.fillText('Bird 4', buttonBounds['bird4'].x + 40, buttonBounds['bird4'].y + 25);

    // Draw the start button
    ctx.fillRect(buttonBounds['start'].x, buttonBounds['start'].y, buttonBounds['start'].width, buttonBounds['start'].height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Start Game', buttonBounds['start'].x + 20, buttonBounds['start'].y + 25);

    // Draw instructions for the user
    ctx.font = '15px Arial';
    ctx.fillText('Click to select skin and start the game', canvas.width / 2 - 120, 450);
}

// Start the game with the selected skin
function startGame(selectedSkin) {
    birdImage = birdImages[selectedSkin]; // Set the selected bird image
    isMenu = false;
    score = 0;
    birdY = 200;
    birdSpeed = 5;
    pipes = [];
    gameLoop();
}

// Bird movement and game loop
function gameLoop() {           
    if (isGameOver) return;

    // Clear canvas and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw background image

    // Bird movement
    birdSpeed += gravity;
    birdY += birdSpeed;

    // Draw the bird using the image
    ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

    // Check for collisions
    if (birdY + birdHeight > canvas.height || birdY < 0) {
        gameOver();
    }

    // Pipe movement and creation
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    // Update pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        // Draw top pipe using the 'pipes2' image
        ctx.drawImage(pipeImages['pipes2'], pipe.x, 0, pipeWidth, pipe.topHeight); // Top pipe

        // Draw bottom pipe using the 'pipes' image
        ctx.drawImage(pipeImages['pipes'], pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap); // Bottom pipe

        // Check for collision with pipes
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
            if (birdY < pipe.topHeight || birdY + birdHeight > pipe.topHeight + pipeGap) {
                gameOver();
            }
        }

        // Remove off-screen pipes and count score
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Create new pipes
function createPipe() {
    let topHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        topHeight: topHeight
    });
}

// Game over function
function gameOver() {
    isGameOver = true;
    ctx.fillStyle = 'orange';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', 60, canvas.height / 2);
    ctx.font = '17px Arial';
    ctx.fillStyle = 'white';    
    ctx.fillText('Click to Restart', 70, canvas.height / 2 + 50);
    ctx.fillStyle = '#d68f15';
    
    // Draw the restart and back to menu buttons
    ctx.fillRect(buttonBounds['restart'].x, buttonBounds['restart'].y, buttonBounds['restart'].width, buttonBounds['restart'].height);
    ctx.fillStyle = 'white';
    
    ctx.fillText('Restart', buttonBounds['restart'].x + 40, buttonBounds['restart'].y + 25);
    ctx.fillStyle = '#d68f15';
    
    ctx.fillRect(buttonBounds['backToMenu'].x, buttonBounds['backToMenu'].y, buttonBounds['backToMenu'].width, buttonBounds['backToMenu'].height);
    ctx.fillStyle = 'white';
    ctx.fillText('Back to Menu', buttonBounds['backToMenu'].x + 10, buttonBounds['backToMenu'].y + 25);
}

// Restart the game
function restartGame() {
    isGameOver = false;
    startGame(selectedSkin); // Restart with the previously selected skin
}

// Go back to the main menu
function goBackToMenu() {
    isMenu = true;
    isGameOver = false;
    gameInit();
}

// Game loop initiation
function gameInit() {
    if (isMenu) {
        drawMenu();
    }
}

// Call gameInit to handle the menu display
gameInit();
