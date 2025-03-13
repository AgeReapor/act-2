import React, { useContext } from 'react';
import { BoardItem, BoardItemProps } from './BoardItem';
import { View } from 'react-native';
import { Move } from 'types/Move';
import { Context } from 'App';
import { BoardSquare } from './BoardSquare';

type CanvasProps = {
    boardState?: BoardItemProps[];
    canvasSize?: number;
};

export const Canvas = ({ boardState = [] }: CanvasProps) => {
    const { canvasSize, tilesInASide } = useContext(Context);
    return (
        <View
            className={`relative rounded-md bg-cyan-950`}
            style={{ width: canvasSize, height: canvasSize }}>
            {boardState.map((item, index) => (
                <BoardSquare
                    key={'bg_' + item._key}
                    position={item.position}
                    defaultColor={`${(item.position.x + item.position.y) % 2 ? 'bg-gray-200' : 'bg-teal-200'}`}
                    focusColor={`${(item.position.x + item.position.y) % 2 ? 'bg-gray-400' : 'bg-teal-400'}`}></BoardSquare>
            ))}
            {boardState.map((item, index) => (
                <BoardItem
                    key={'fg_' + item._key}
                    type={item.type}
                    position={item.position}
                    playableMoves={item.playableMoves}
                    moveHandler={item.moveHandler}
                />
            ))}
        </View>
    );
};
