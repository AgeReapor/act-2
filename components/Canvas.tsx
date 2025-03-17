import React, { useContext } from 'react';
import { BoardItem, BoardItemProps } from './BoardItem';
import { View } from 'react-native';
import { Move } from 'types/Move';
import { Context } from 'App';
import { BoardSquare } from './BoardSquare';
import { MoveArrow } from './MoveArrow';
import { Direction } from 'types/Direction';

type CanvasProps = {
    boardState?: BoardItemProps[];
    canvasSize?: number;
};

export const Canvas = ({ boardState = [] }: CanvasProps) => {
    const { getSelected, canvasSize } = useContext(Context);
    return (
        <View
            className={`relative rounded-md bg-cyan-950`}
            style={{ width: canvasSize, height: canvasSize }}>
            {boardState.map((item, index) => (
                <BoardSquare
                    key={'bg_' + item._key}
                    position={item.position}
                    defaultColor={`${(item.position.x + item.position.y) % 2 ? 'bg-gray-300' : 'bg-teal-300'}`}
                    focusColor={`${(item.position.x + item.position.y) % 2 ? 'bg-gray-600' : 'bg-teal-600'}`}></BoardSquare>
            ))}
            {boardState.map((item, index) => (
                <BoardItem
                    key={'fg_' + item._key}
                    type={item.type}
                    position={item.position}
                    canMove={item.canMove}
                    moveHandler={item.moveHandler}
                />
            ))}
            <MoveArrow pos={getSelected()} />
            <MoveArrow pos={getSelected()} dir={Direction.DOWN} />
            <MoveArrow pos={getSelected()} dir={Direction.LEFT} />
            <MoveArrow pos={getSelected()} dir={Direction.RIGHT} />
        </View>
    );
};
