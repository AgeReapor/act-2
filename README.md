# Checkers

A mobile application built with React Native and Expo
Coded by: Age Reapor

## Technologies

- React Native
- Expo
- NativeWind
- TypeScript

## INSTALLATION

To install the app, run `npm install --force` in the root directory, then run one of the following:

- `npm run web`
- `npm run android`
- `npm run ios`

## Decription

A boardgame played by 2 people. Each person is given 12 "men" that can move one square diagonally forward, or take over an enemy piece diagonally forward. If a piece reaches the end of the board, it is "promoted" to a "king," which can move also move backward. A king piece can cross over empty spaces, but still has to jump one tile diagonally after taking over an enemy piece.

The game ends when a player wins by takes over all the opponent's pieces.

## SCREENSHOTS

### Main Menu

This is where the first player is selected.
![alt text](<Select Screen.png>)

### Board Layout

The board uses a chess board, and the pieces can only move in the dark squares. The white pieces are on the top side of the board, and the red pieces are on the bottom side of the board.
![alt text](<Start Board.png>)

### White's Man Piece Turn

A Man piece can only move one square forward, and can take over an enemy piece.
During the White player's turn, a white man piece is selected, as indicated by the highligted white piece. The places they can move to is highlighted by the green squares.

Because the white is on the top side of the board, they can only move downward. They can either move on the empty space on the left, or take over the red piece in the right.
![alt text](<White Man Plays.png>)

### Red's King Piece Turn

A King is powerful, capable of moving in all 4 directions and cross empty spaces. The selected Red piece can land on all the green spaces highlighted, including two white pieces that can be taken over.
![alt text](<Red King Plays.png>)

### Win Screen

This is where the winner of the game is announced.
![alt text](<Win Screen.png>)
