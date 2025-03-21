import { BoardItemProps } from 'components/BoardItem';
import { BoardItemType } from 'types/BoardItemType';

export type BoardConfig = string[];

export const constructInitBoard: (boardConfig: BoardConfig) => {
    boardState: BoardItemProps[];
    tilesInASide: number;
} = (boardConfig: BoardConfig) => {
    // set tilesInASide to be longest row or column
    let tilesInASide = boardConfig.length;
    for (let str of boardConfig) {
        if (str.length > tilesInASide) tilesInASide = str.length;
    }

    let boardState: BoardItemProps[] = [];
    for (let i = 0; i < tilesInASide; i++) {
        for (let j = 0; j < tilesInASide; j++) {
            // if out of bounds, continue
            if (j >= boardConfig[i].length) continue;

            const thisChar = boardConfig[i][j];

            const emptyChars = 'oO0';
            const whiteMan = 'w';
            const whiteKing = 'W';
            const redMan = 'r';
            const redKing = 'R';

            if (emptyChars.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.HOLE,
                    canMove: true,
                });
            } else if (whiteMan.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.MAN,
                    canMove: false,
                    owner: 'white',
                });
            } else if (whiteKing.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.KING,
                    canMove: false,
                    owner: 'white',
                });
            } else if (redMan.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.MAN,
                    canMove: false,
                    owner: 'red',
                });
            } else if (redKing.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.KING,
                    canMove: false,
                    owner: 'red',
                });
            }
        }
    }
    return { boardState, tilesInASide };
};

export const stdCheckers: BoardConfig = [
    'owowowow',
    'wowowowo',
    'owowowow',
    'oooooooo',
    'oooooooo',
    'rorororo',
    'orororor',
    'rorororo',
];
