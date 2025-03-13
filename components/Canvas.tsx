import React, { useContext } from 'react';
import { BoardItem, BoardItemProps } from './BoardItem';
import { View } from 'react-native';
import { Move } from 'types/Move';
import { Context } from 'App';

type CanvasProps = {
    boardState?: BoardItemProps[];
    canvasSize?: number;
};

export const Canvas = ({ boardState = [] }: CanvasProps) => {
    const { canvasSize } = useContext(Context);
    return (
        <View
            className={`relative rounded-md bg-slate-400`}
            style={{ width: canvasSize, height: canvasSize }}>
            {boardState.map((item, index) => (
                <BoardItem
                    key={item.key}
                    type={item.type}
                    position={item.position}
                    colors={item.colors}
                    playableMoves={item.playableMoves}
                    moveHandler={item.moveHandler}
                />
            ))}
        </View>
    );
};
