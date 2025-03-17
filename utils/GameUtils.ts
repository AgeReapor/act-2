import { BoardItemProps } from 'components/BoardItem';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import { Vector2 } from 'types/Vector2';
import { Direction } from 'types/Direction';

// checks if position is inside board boundaries
export const isInBoard = (position: Vector2, tilesInASide: number): boolean => {
    return (
        position.x >= 0 && position.y >= 0 && position.x < tilesInASide && position.y < tilesInASide
    );
};

// returns item at position from boardstate, null if not found
export const getItem = (
    boardState: BoardItemProps[],
    position: Vector2,
    tilesInASide: number
): BoardItemProps | null => {
    // if (!isInBoard(position, tilesInASide)) return null;
    for (const item of boardState) {
        if (item.position.x == position.x && item.position.y == position.y) return item;
    }
    return null;
};

// checks if a move is valid given from, eaten, and to positions
export const canEat = (
    boardState: BoardItemProps[],
    from: Vector2,
    eaten: Vector2,
    to: Vector2,
    tilesInASide: number
): boolean => {
    const fromItem = getItem(boardState, from, tilesInASide);
    const eatenItem = getItem(boardState, eaten, tilesInASide);
    const toItem = getItem(boardState, to, tilesInASide);

    // if any of the items are null, return false
    if (!fromItem || !eatenItem || !toItem) return false;

    // if from and eaten are peg and to is hole, return true
    return (
        fromItem.type == BoardItemType.PEG &&
        eatenItem.type == BoardItemType.PEG &&
        toItem.type == BoardItemType.HOLE
    );
};

export const getPossibleMoves = (
    position: Vector2,
    boardState: BoardItemProps[],
    tilesInASide: number
): Move[] => {
    // if position is not in board, return empty
    if (!isInBoard(position, tilesInASide)) return [];
    let eaten, to: Vector2;

    const possibleMoves: Move[] = [];

    // check up
    eaten = { x: position.x, y: position.y - 1 };
    to = { x: position.x, y: position.y - 2 };
    if (canEat(boardState, position, eaten, to, tilesInASide))
        possibleMoves.push({ dir: Direction.UP, from: position, eaten, to });

    // check down
    eaten = { x: position.x, y: position.y + 1 };
    to = { x: position.x, y: position.y + 2 };
    if (canEat(boardState, position, eaten, to, tilesInASide))
        possibleMoves.push({ dir: Direction.DOWN, from: position, eaten, to });

    // check left
    eaten = { x: position.x - 1, y: position.y };
    to = { x: position.x - 2, y: position.y };
    if (canEat(boardState, position, eaten, to, tilesInASide))
        possibleMoves.push({ dir: Direction.LEFT, from: position, eaten, to });

    // check right
    eaten = { x: position.x + 1, y: position.y };
    to = { x: position.x + 2, y: position.y };
    if (canEat(boardState, position, eaten, to, tilesInASide))
        possibleMoves.push({ dir: Direction.RIGHT, from: position, eaten, to });

    return possibleMoves;
};
