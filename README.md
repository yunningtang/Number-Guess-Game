# Number-Guess-Game based on "Cows and Bulls" 
# 1. Objective

Game Rules

❗ Guess the computer's secret three-digit number before it guesses yours.

❗ Both numbers have unique digits and no zeros.
How to Play

1️⃣: You and the computer take turns guessing each other's secret number.

2️⃣: You both get up to seven attempts.

3️⃣: After each guess, feedback is provided:

🔵 + : Correct digit and position.

⚪️ - : Correct digit, wrong position.

🟠 0 : No correct digits.


🏆Winning Condition

You win if you guess the computer's number in fewer tries than it guesses yours.

# 2. The Game
This is a two-player game where each player secretly writes down a three-digit number (with no
repeating digits and no zeros). The players then take turns guessing each other's number, receiving
feedback after each guess. The feedback consists of:
   A “+” for each digit that is correct and in the correct position.
   A “–” for each digit that is correct but in the wrong position.
Example: If the secret number is 589 and the guess is 982, the feedback would be “+-” because:
   8 is in the correct position.
   9 is correct but in the wrong position.
The winner is the player who successfully guesses their opponent's number in the fewest attempts.

# 3. Guessing the number
Given that the secret number doesn’t include zeros and has no repeating digits, the total number of
possible guesses is 504 (which is 9 * 8 * 7), ranging from 123 to 987.
