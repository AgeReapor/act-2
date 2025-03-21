import { BoardItemProps } from 'components/BoardItem';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import { Vector2 } from 'types/Vector2';

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
    if (!isInBoard(position, tilesInASide)) return null;
    for (const item of boardState) {
        if (item.position.x == position.x && item.position.y == position.y) return item;
    }
    return null;
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

    const fromItem = getItem(boardState, position, tilesInASide);
    if (!fromItem) return [];
    if (fromItem.type != BoardItemType.MAN && fromItem.type != BoardItemType.KING) return [];

    if (!fromItem.owner) return [];

    const dirs: Vector2[] = [];

    if (fromItem?.owner === 'red' || fromItem.type == BoardItemType.KING) {
        dirs.push({
            x: 1,
            y: -1,
        });
        dirs.push({
            x: -1,
            y: -1,
        });
    }

    if (fromItem?.owner === 'white' || fromItem.type == BoardItemType.KING) {
        dirs.push({
            x: 1,
            y: 1,
        });
        dirs.push({
            x: -1,
            y: 1,
        });
    }

    for (const dir of dirs) {
        const acc = eatToDirection(
            position,
            fromItem.owner,
            { x: position.x + dir.x, y: position.y + dir.y },
            dir,
            fromItem.type == BoardItemType.MAN ? 0 : 8,
            tilesInASide,
            boardState,
            []
        );
        if (acc.length > 0) possibleMoves.push(...acc);
    }

    return possibleMoves;
};

const eatToDirection = (
    from: Vector2,
    eater: 'red' | 'white',
    current: Vector2,
    dir: Vector2,
    range: number,
    tilesInASide: number,
    boardState: BoardItemProps[],
    acc: Move[]
): Move[] => {
    // base cases, return accumulator as is
    if (!isInBoard(current, tilesInASide)) return acc;
    if (range < 0) return acc;

    const currItem = getItem(boardState, current, tilesInASide);

    // if currItem is null, return accumulator
    if (!currItem) return acc;

    // if currItem is hole, add current to accumulator and recurse
    if (currItem.type == BoardItemType.HOLE)
        return eatToDirection(
            from,
            eater,
            { x: current.x + dir.x, y: current.y + dir.y },
            dir,
            range - 1,
            tilesInASide,
            boardState,
            [
                ...acc,
                {
                    from,
                    to: current,
                    eaten: null,
                },
            ]
        );

    // if currItem is not a man or king, return accumulator
    if (currItem.type != BoardItemType.MAN && currItem.type != BoardItemType.KING) return acc;

    // if currItem is owned by eater, return accumulator
    if (currItem.owner === eater) return acc;

    const next = { x: current.x + dir.x, y: current.y + dir.y };
    const nextItem = getItem(boardState, next, tilesInASide);
    if (nextItem && nextItem.type == BoardItemType.HOLE)
        return [
            ...acc,
            {
                from,
                to: next,
                eaten: current,
            },
        ];

    return acc;
};
