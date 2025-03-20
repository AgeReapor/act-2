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
            const pegChars = 'xX';
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
            } else if (pegChars.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.PEG,
                    canMove: true,
                });
            } else if (whiteMan.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.MAN,
                    canMove: false,
                });
            } else if (whiteKing.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.KING,
                    canMove: false,
                });
            } else if (redMan.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.MAN,
                    canMove: false,
                });
            } else if (redKing.search(thisChar) != -1) {
                boardState.push({
                    _key: j * tilesInASide + i + '',
                    position: { x: j, y: i },
                    type: BoardItemType.KING,
                    canMove: false,
                });
            }
        }
    }
    return { boardState, tilesInASide };
};

export const miniBoardConfig: BoardConfig = ['XX0', 'XXX', '000'];

export const frenchConfig: BoardConfig = [
    '  xxx  ',
    ' xxxxx ',
    'xxxoxxx',
    'xxxxxxx',
    'xxxxxxx',
    ' xxxxx ',
    '  xxx  ',
];

export const wieglebConfig: BoardConfig = [
    '   xxx   ',
    '   xxx   ',
    '   xxx   ',
    'xxxxxxxxx',
    'xxxx0xxxx',
    'xxxxxxxxx',
    '   xxx   ',
    '   xxx   ',
    '   xxx   ',
];

export const assym3322Config: BoardConfig = [
    '  xxx   ',
    '  xxx   ',
    '  xxx   ',
    'xxxxxxxx',
    'xxx0xxxx',
    'xxxxxxxx',
    '  xxx   ',
    '  xxx   ',
];

export const englishConfig: BoardConfig = [
    '  xxx  ',
    '  xxx  ',
    'xxxxxxx',
    'xxx0xxx',
    'xxxxxxx',
    '  xxx  ',
    '  xxx  ',
];

export const diamondConfig: BoardConfig = [
    '    x    ',
    '   xxx   ',
    '  xxxxx  ',
    ' xxxxxxx ',
    'xxxx0xxxx',
    ' xxxxxxx ',
    '  xxxxx  ',
    '   xxx   ',
    '    x    ',
];

export const triangularConfig: BoardConfig = ['0xxxx', 'xxxx ', 'xxx  ', 'xx   ', 'x    '];

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
