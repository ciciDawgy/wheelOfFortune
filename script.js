// Canvas setup for the wheel
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const segments = ['100', '200', '300', '400', '500', '600', 'Bankrupt', 'Lose a Turn'];
const colors = ['#f39c12', '#e74c3c', '#8e44ad', '#2980b9', '#27ae60', '#16a085', '#c0392b', '#d35400'];
let angle = 0;
let isSpinning = false;

// Word setup
const wordToGuess = 'JAVASCRIPT';
let guessedWord = Array(wordToGuess.length).fill('_');
let currentPlayer = 1;
let messageDisplay = document.getElementById('messageDisplay');
let wordDisplay = document.getElementById('wordDisplay');

// Draw the Wheel of Fortune
function drawWheel() {
    const arcSize = (2 * Math.PI) / segments.length;
    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, arcSize * i, arcSize * (i + 1));
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(segments[i], canvas.width / 2 + Math.cos(arcSize * i + arcSize / 2) * 100, canvas.height / 2 + Math.sin(arcSize * i + arcSize / 2) * 100);
    }
}

// Spin the wheel and determine the result
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    let spinAngle = Math.floor(Math.random() * 360) + 720; // Random spin of at least two full turns

    const spinInterval = setInterval(() => {
        angle += 5; // Adjust this value for different spin speeds
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        drawWheel();
        ctx.restore();
    }, 10);

    setTimeout(() => {
        clearInterval(spinInterval);
        isSpinning = false;
        const segmentIndex = Math.floor(((angle % 360) / 360) * segments.length);
        displayMessage(`Player ${currentPlayer} landed on: ${segments[segmentIndex]}`);
        handleSpinResult(segments[segmentIndex]);
    }, spinAngle);
}

// Handle the result of the wheel spin
function handleSpinResult(result) {
    if (result === 'Bankrupt') {
        displayMessage(`Player ${currentPlayer} went bankrupt!`);
        switchPlayer();
    } else if (result === 'Lose a Turn') {
        displayMessage(`Player ${currentPlayer} loses a turn!`);
        switchPlayer();
    } else {
        displayMessage(`Player ${currentPlayer}, guess a letter!`);
    }
}

// Handle the player's guess
function makeGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.toUpperCase();
    guessInput.value = '';

    if (!guess || guess.length !== 1 || !/^[A-Z]$/.test(guess)) {
        displayMessage('Please enter a valid letter.');
        return;
    }

    if (wordToGuess.includes(guess)) {
        updateGuessedWord(guess);
    } else {
        displayMessage(`Incorrect guess! Player ${currentPlayer} loses a turn.`);
        switchPlayer();
    }
}

// Update the displayed word with correct guesses
function updateGuessedWord(letter) {
    let correctGuess = false;
    for (let i = 0; i < wordToGuess.length; i++) {
        if (wordToGuess[i] === letter) {
            guessedWord[i] = letter;
            correctGuess = true;
        }
    }

    wordDisplay.innerHTML = guessedWord.join(' ');
    if (guessedWord.join('') === wordToGuess) {
        displayMessage(`Player ${currentPlayer} wins! The word was: ${wordToGuess}`);
    } else if (correctGuess) {
        displayMessage(`Good job, Player ${currentPlayer}! Keep guessing!`);
    }
}

// Switch to the other player
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    displayMessage(`It's now Player ${currentPlayer}'s turn! Spin the wheel!`);
}

// Display game messages
function displayMessage(message) {
    messageDisplay.innerHTML = message;
}

// Initialize the game board
drawWheel();
displayMessage(`Player ${currentPlayer}, click the wheel to spin!`);

// Add a click event listener to spin the wheel
canvas.addEventListener('click', spinWheel);
