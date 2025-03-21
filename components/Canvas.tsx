import React, { useContext } from 'react';
import { BoardItem, BoardItemProps } from './BoardItem';
import { View } from 'react-native';
import { Move } from 'types/Move';
import { Context } from 'App';
import { BoardSquare } from './BoardSquare';
import { getPossibleMoves } from 'utils/GameUtils';
import { MoveSquare } from './MoveSquare';

type CanvasProps = {
    boardState?: BoardItemProps[];
    canvasSize?: number;
};

export const Canvas = ({ boardState = [] }: CanvasProps) => {
    const {
        getSelected,
        canvasSize,
        playMove,
        tilesInASide,
        canvasColor,
        defaultDarkTile,
        defaultLightTile,
        focusDarkTile,
        focusLightTile,
    } = useContext(Context);

    // const currentMoves: Move[] = getPossibleMoves(getSelected(), boardState, tilesInASide);

    const currentMoves: Move[] = [
        {
            from: { x: 0, y: 0 },
            to: { x: 2, y: 3 },
            eaten: { x: 0, y: 0 },
        },
        {
            from: { x: 0, y: 0 },
            to: { x: 3, y: 4 },
            eaten: { x: 0, y: 0 },
        },
        {
            from: { x: 0, y: 0 },
            to: { x: 0, y: 3 },
            eaten: { x: 0, y: 0 },
        },
    ];

    return (
        <View
            className={`relative rounded-md ${canvasColor}`}
            style={{ width: canvasSize, height: canvasSize }}>
            {boardState.map((item, index) => (
                <BoardSquare
                    key={'bg_' + item._key}
                    position={item.position}
                    defaultColor={`${(item.position.x + item.position.y) % 2 ? defaultDarkTile : defaultLightTile}`}
                    focusColor={`${(item.position.x + item.position.y) % 2 ? focusDarkTile : focusLightTile}`}></BoardSquare>
            ))}
            {boardState.map((item, index) => (
                <BoardItem
                    key={'fg_' + item._key}
                    type={item.type}
                    position={item.position}
                    canMove={item.canMove}
                    moveHandler={item.moveHandler}
                    owner={item.owner}
                />
            ))}
            {currentMoves.map((move, index) => (
                <MoveSquare key={'ms_' + index} pos={move.to} moveCallback={() => playMove(move)} />
            ))}
        </View>
    );
};
