import { BoardItemProps } from 'components/BoardItem';
import { Move } from 'types/Move';
import { Vector2 } from 'types/Vector2';

export const getPossibleMoves = (
    position: Vector2,
    boardState: BoardItemProps[],
    tilesInASide: number
): Move[] => {
    // when position is outside the board, return empty array
    if (!isInBoard(position, tilesInASide)) return [];

    const possibleMoves: Move[] = [];
    return possibleMoves;
};

export const isInBoard = (position: Vector2, tilesInASide: number): boolean => {
    return (
        position.x >= 0 && position.y >= 0 && position.x < tilesInASide && position.y < tilesInASide
    );
};

export const checkMove = (
    from: Vector2,
    to: Vector2,
    eats: Vector2,
    tilesInASide: number
): boolean => {
    if (
        !isInBoard(from, tilesInASide) ||
        !isInBoard(to, tilesInASide) ||
        !isInBoard(eats, tilesInASide)
    )
        return false;

    return true;
};
