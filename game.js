let secretNumber = '';
let computerGuess = '';
let possibleNumbers = [];
let userAttempts = 0;
let pcAttempts = 0;
const maxAttempts = 7;
let playerWon = false;
let computerWon = false;
let computerTargetNumber = '';
let totalGames = 0;
let playerWins = 0;
let computerWins = 0;
let averagePlayerAttempts = 0;
let averageComputerAttempts = 0;

window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    return false;
};

// Initialize game variables
function initGameVariables(difficulty) {
    // Generate computer's secret number for player to guess
    const digits = ['1','2','3','4','5','6','7','8','9'];
    secretNumber = '';
    for(let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * digits.length);
        secretNumber += digits.splice(index, 1)[0];
    }
    
    // Only show ??? at the beginning
    const computerSecretDisplay = document.querySelector('.highlight');
    if (computerSecretDisplay) {
        computerSecretDisplay.textContent = '???';
    }
    
    // Initialize all possible 3-digit combinations
    possibleNumbers = [];
    for(let i = 123; i <= 987; i++) {
        const numStr = i.toString();
        if(new Set(numStr).size === 3 && !numStr.includes('0')) {
            possibleNumbers.push(numStr);
        }
    }
    
    // Reset game state
    userAttempts = 0;
    pcAttempts = 0;
    computerGuess = '';
    playerWon = false;
    computerWon = false;
}

// Check if it is a valid Guess 
function isValidGuess(guess) {
    if (!guess || guess.length !== 3) return false;
    if (!/^\d{3}$/.test(guess)) return false;
    if (guess.includes('0')) return false;
    return new Set(guess).size === 3;
}

// Check if feedback is valid
function isValidFeedback(feedback) {
    if (!feedback) return false;
    
    // If it is single 0 , return 0 
    if (feedback === '0') return '0';
    
    // Remove
    feedback = feedback.trim();
    
    // Check if it is only contain + or -
    if (!/^[+-]+$/.test(feedback)) return false;
    
    // Check the length
    if (feedback.length > 3) return false;
    
    return feedback;
}

// Get feedback

function isValidFeedback(feedback) {
    if (!feedback) return false;
    
    // Remove all whitespace first
    feedback = feedback.trim();
    
    // If it's a single '0', return it directly
    if (feedback === '0') return '0';
    
    // Check if feedback only contains + and - symbols
    if (!/^[+-]+$/.test(feedback)) return false;
    
    // Check if length is not more than 3
    if (feedback.length > 3) return false;
    
    // Return the original feedback string
    return feedback;
}

// Add debug logging to submitFeedback function
function submitFeedback() {
    if (computerWon || pcAttempts >= maxAttempts) {
        alert(computerWon ? "Computer has already found the number!" : "Computer has used all its attempts!");
        return;
    }

    const feedbackInput = document.getElementById('feedbackInput');
    let feedback = feedbackInput.value.trim();
    console.log('Original feedback:', feedback);  
    
    feedback = isValidFeedback(feedback);
    console.log('Validated feedback:', feedback);  
    
    if (!feedback) {
        alert('Please enter valid feedback using +, -, and 0 symbols');
        return;
    }

// Get correct feedback and compare (ignore order)
    const correctFeedback = getFeedback(computerTargetNumber, computerGuess);
    console.log('Correct feedback:', correctFeedback);

// Check (-)
    for (let Xi = 0; i < 3; i++) {
        if (guessArr[i] !== 'y') {  // Pass 
            const index = secretArr.indexOf(guessArr[i]);
            if (index !== -1 && secretArr[index] !== 'x') {
                minus++;
                secretArr[index] = 'x';  // Mark 
            }
        }
    }
    
    // If there is no digit matched, return 0 
    if (plus === 0 && minus === 0) {
        return '0';
    }
    
    // Return
    return '+'.repeat(plus) + '-'.repeat(minus);
}

// Update History
function updateHistory(elementId, guess, feedback) {
    const historyArea = document.getElementById(elementId);
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.textContent = `Guess: ${guess}, Feedback: ${feedback}`;
    historyArea.appendChild(historyItem);
    historyArea.scrollTop = historyArea.scrollHeight;
}

// handle Player Guess
function handlePlayerGuess() {
    // If Player fond the seceret number already, should wait for the computer to finish
    if (playerWon) {
        alert("You've already found the number! Please wait for the computer to finish.");
        return;
    }

// If player used all 7 attempts, player cannot guess the number anymore
    if (userAttempts >= maxAttempts) {
        alert("You've used all your attempts!");
        return;
    }

    const guessInput = document.getElementById('playerGuess');
    const guess = guessInput.value.trim();

    if (!isValidGuess(guess)) {
        alert('Please enter a valid 3-digit number (no repeating digits, no zeros)');
        return;
    }

    const feedback = getFeedback(secretNumber, guess);
    updateHistory('playerHistory', guess, feedback);
    userAttempts++;

    if (feedback === "+++") {
        playerWon = true;
        alert(`Congratulations! You found the number in ${userAttempts} attempts! Please wait for the computer to finish.`);
    } else if (userAttempts >= maxAttempts) {
        alert(`You've used all your attempts! The correct number was: ${secretNumber}`);
    }
    
// Check if game ends
    if (shouldEndGame()) {
        handleGameEnd();
    }

    guessInput.value = '';
}

// Computer Strategy & Algorithm
function makeComputerMove() {
    if (computerWon || pcAttempts >= maxAttempts) {
        return;  // If computer won the game or used all 7 attempts, then computer cannot keep guessing the number
    }

    const params = new URLSearchParams(window.location.search);
    const difficulty = params.get('difficulty') || 'normal';
    
    switch(difficulty) {
        case 'easy':
            computerGuess = makeEasyGuess();
            break;
        case 'hard':
            computerGuess = makeHardGuess();
            break;
        default:
            computerGuess = makeNormalGuess();
    }
    
    // Present computer's guess
    document.getElementById('computerGuess').textContent = computerGuess;
}

// ESAY 
function makeEasyGuess() {
    const digits = ['1','2','3','4','5','6','7','8','9'];
    let guess = '';
    while(guess.length < 3) {
        const index = Math.floor(Math.random() * digits.length);
        const digit = digits.splice(index, 1)[0];
        if (!guess.includes(digit)) {
            guess += digit;
        }
    }
    return guess;
}

// NORMAL
function makeNormalGuess() {
    // First two guesses are random
    if (pcAttempts < 2) {
        // Ensure we don't repeat previous guesses
        let guess;
        do {
            guess = makeEasyGuess();
        } while (getPreviousGuesses().includes(guess));
        return guess;
    }
    
    // After that, use the filtered possible numbers
    if (possibleNumbers.length > 0) {
        const availableNumbers = possibleNumbers.filter(num => !getPreviousGuesses().includes(num));
        if (availableNumbers.length > 0) {
            return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        }
    }
    
// Fallback to random guess if no possible numbers
    let newGuess;
    do {
        newGuess = makeEasyGuess();
    } while (getPreviousGuesses().includes(newGuess));
    return newGuess;
}

// Get list of previous computer guesses
function getPreviousGuesses() {
    const history = document.getElementById('computerHistory');
    if (!history) return [];
    
    return Array.from(history.children)
        .map(item => item.textContent.split(',')[0].replace('Guess: ', '').trim());
}

// HARD: Advanced Minimax Strategy
function makeHardGuess() {
    if (pcAttempts < 2) {
        return getRandomGuess(possibleNumbers);
    } else {
        // After initial guesses, use minimax strategy
        return makeMinimaxGuess(possibleNumbers);
    }
}

// Function to make a random guess
function getRandomGuess(numbers) {
    const availableNumbers = numbers.filter(num => !getPreviousGuesses().includes(num));
    const index = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[index];
}

// Function to make a guess using the minimax algorithm
function makeMinimaxGuess(possibleNumbers) {
    let minRemaining = Number.MAX_SAFE_INTEGER;
    let bestGuess;

    // For each possible guess
    for (let guess of possibleNumbers) {
        // Skip if we've already used this guess
        if (getPreviousGuesses().includes(guess)) continue;
        
        // Count how many numbers would remain for each possible feedback
        let feedbackCounts = new Map();

        for (let possibleSecret of possibleNumbers) {
            let feedback = getFeedback(possibleSecret, guess);
            feedbackCounts.set(feedback, (feedbackCounts.get(feedback) || 0) + 1);
        }

        // Find the worst case (maximum remaining numbers) for this guess
        let maxFeedbackCount = Math.max(...feedbackCounts.values());

        // If this guess's worst case is better than our current best
        if (maxFeedbackCount < minRemaining) {
            minRemaining = maxFeedbackCount;
            bestGuess = guess;
        }
    }

    return bestGuess || getRandomGuess(possibleNumbers);
}

// Update possible numbers based on feedback
function updatePossibleNumbers(guess, feedback) {
    if (feedback === "0") {
        // If feedback is 0, eliminate all numbers containing any digits from the guess
        possibleNumbers = possibleNumbers.filter(number => 
            !guess.split("").some(digit => number.includes(digit))
        );
    } else {
        // Otherwise, keep only numbers that would give the same feedback
        possibleNumbers = possibleNumbers.filter(number => 
            getFeedback(number, guess) === feedback
        );
    }
}

// Get feedback for a guess
function getFeedback(secret, guess) {
    let correctPosition = 0;
    let correctDigit = 0;

    // Check for correct positions
    for (let i = 0; i < 3; i++) {
        if (guess[i] === secret[i]) {
            correctPosition++;
        } else if (secret.includes(guess[i])) {
            correctDigit++;
        }
    }

    // Return 0 if no matches
    if (correctPosition === 0 && correctDigit === 0) {
        return "0";
    }

    // Return feedback string
    return "+".repeat(correctPosition) + "-".repeat(correctDigit);
}

// get all possible guesses (from 1 - 9, no repeat)
function getAllPossibleGuesses() {
    let guesses = [];
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            if (j === i) continue;
            for (let k = 1; k <= 9; k++) {
                if (k !== i && k !== j) {
                    guesses.push(`${i}${j}${k}`);
                }
            }
        }
    }
    return guesses;
}

// update possible numbers
function updatePossibleNumbers(guess, feedback) {
    possibleNumbers = possibleNumbers.filter(num => {
        const expectedFeedback = getFeedback(num, guess);
        return expectedFeedback.split('').sort().join('') === feedback.split('').sort().join('');
    });
}

// Add feedback symbol
function addFeedback(symbol) {
    const feedbackInput = document.getElementById('feedbackInput');
    const currentFeedback = feedbackInput.value;
    
    if ((currentFeedback === '' && symbol === '0') || currentFeedback === '0') {
        feedbackInput.value = symbol;
        return;
    }
    
    // If the current symbol is 0, it will not allow user to put any other symbo
    if (symbol === '0' && currentFeedback.length > 0) {
        return;
    }
    
    // If it contains other symbol, it will not allow user to input 0
    if (currentFeedback.length > 0 && symbol === '0') {
        return;
    }
    
    // The maximum feedback length should be no longer than 3 
    if (currentFeedback.length < 3) {
        feedbackInput.value = currentFeedback + symbol;
    }
}

// Clear feedback input
function clearFeedback() {
    document.getElementById('feedbackInput').value = '';
}

// hanld game end
function handleGameEnd() {
    totalGames++;
    
    // Check Winner
    let winner = '';
    if (playerWon && computerWon) {
        if (userAttempts < pcAttempts) {
            winner = 'player';
            playerWins++;
        } else if (pcAttempts < userAttempts) {
            winner = 'computer';
            computerWins++;
        } else {
            winner = 'tie';
        }
    } else if (playerWon) {
        winner = 'player';
        playerWins++;
    } else if (computerWon) {
        winner = 'computer';
        computerWins++;
    }

    // Show Result
    let message = `🎮 Game Over! 🎮\n\n`;
    message += `🎯 Final Results:\n`;
    message += `Your attempts: ${userAttempts}/7\n`;
    message += `Computer's attempts: ${pcAttempts}/7\n\n`;
    
    // Show both side's secret number
    message += `🔢 Your number: ${computerTargetNumber}\n`;
    message += `🔢 Computer's number: ${secretNumber}\n\n`;
    
    // Show Winner
    switch(winner) {
        case 'player':
            message += `🏆 Congratulations! You Won! 🎉\n`;
            message += `You found the number in ${userAttempts} attempts\n`;
            message += `Computer took ${pcAttempts} attempts`;
            break;
        case 'computer':
            message += `🤖 Computer Won! \n`;
            message += `Computer found the number in ${pcAttempts} attempts\n`;
            message += `You took ${userAttempts} attempts`;
            break;
        case 'tie':
            message += `🤝 It's a Tie! \n`;
            message += `Both found the number in ${userAttempts} attempts!`;
            break;
        default:
            message += `⌛ Time's Up! \n`;
            message += `Neither player found the number within ${maxAttempts} attempts.`;
    }
    
// Overall Stats
    message += `\n\n📊 Overall Stats:\n`;
    message += `Games Played: ${totalGames}\n`;
    message += `Your Wins: ${playerWins}\n`;
    message += `Computer Wins: ${computerWins}`;

    alert(message);
    
    // Ask it user want to return main menu
    if (playerWon || userAttempts >= maxAttempts) {
        setTimeout(() => {
            if (confirm('Return to main menu?')) {
                goBack();
            }
        }, 500);
    }
}

// Back to the menu
function goBack() {
    window.location.href = 'index.html';
}

function shouldEndGame() {
    // If both side finished the game, either they found the secret number or compare their maximum attempt times 
    const playerDone = playerWon || userAttempts >= maxAttempts;
    const computerDone = computerWon || pcAttempts >= maxAttempts;
    
    return playerDone && computerDone;
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty');
    
    // Check if they select the difficulty level
    if (!difficulty) {
        window.location.href = 'index.html';
        return;
    }
    
    // Present difficutly
    document.getElementById('difficultyDisplay').textContent = 
        `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
    
    // Initialize game variables
    initGameVariables(difficulty);
    
    // Hidding the secret number at the beginning
    document.getElementById('gameContent').style.display = 'none';
    document.getElementById('setupSection').style.display = 'block';
}

function submitFeedback() {
    if (computerWon || pcAttempts >= maxAttempts) {
        alert(computerWon ? "Computer has already found the number!" : "Computer has used all its attempts!");
        return;
    }

    const feedbackInput = document.getElementById('feedbackInput');
    let feedback = feedbackInput.value.trim();
    feedback = isValidFeedback(feedback);
    
    if (!feedback) {
        alert('Please enter valid feedback using +, -, and 0 symbols');
        return;
    }

    // Get the correct feedback 
    const correctFeedback = getFeedback(computerTargetNumber, computerGuess);
    const sortedFeedback = feedback.split('').sort().join('');
    const sortedCorrectFeedback = correctFeedback.split('').sort().join('');
    
    if (sortedFeedback !== sortedCorrectFeedback) {
        alert('Your feedback is incorrect! Please check your number and try again.');
        return;
    }

    // Update History
    updateHistory('computerHistory', computerGuess, feedback);
    updatePossibleNumbers(computerGuess, feedback);
    pcAttempts++;

    // Check the winner
    if (sortedFeedback === "+++") {
        computerWon = true;
        alert(`Computer found the number in ${pcAttempts} attempts!`);
    }
    
    // Handle end game
    if (shouldEndGame()) {
        handleGameEnd();
    } else if (!computerWon && pcAttempts < maxAttempts) {
        feedbackInput.value = '';
        makeComputerMove();
    }
}

// Set up the Game
function setupGame() {
    const targetInput = document.getElementById('computerTargetInput');
    const target = targetInput.value.trim();

    if (!isValidGuess(target)) {
        alert('Please enter a valid 3-digit number (no repeating digits, no zeros)');
        return;
    }

    // Save user's secret number
    computerTargetNumber = target;
    
    // Update
    document.getElementById('computerTargetDisplay').textContent = target;
    
    // Clear game history
    document.getElementById('playerHistory').innerHTML = '';
    document.getElementById('computerHistory').innerHTML = '';
    
    // Change section
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('gameContent').style.display = 'block';

    // Clear computer guess's feedback input
    document.getElementById('computerGuess').textContent = '';
    document.getElementById('feedbackInput').value = '';

    // Computer start first guess
    makeComputerMove();
}
