import { useContext, useState } from 'react';
import { Image, Pressable, Text } from 'react-native';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import { Vector2 } from 'types/Vector2';
import { Context } from 'App';

export type BoardItemProps = {
    // key of the component
    key: string;
    // PEG or HOLE
    type?: BoardItemType;
    // Position on board: {x,y}
    position?: Vector2;
    // [Default Color, Selected Color]
    colors?: string[];
    // Available Moves
    playableMoves?: Move[];
    // Called when a move is selected
    moveHandler?: (move: Move) => void;
};

const pawnImage = require('../assets/pawn.png');

export const BoardItem = ({
    key,
    type = BoardItemType.PEG,
    position = { x: 0, y: 0 },
    colors = [`bg-teal-200`, `bg-teal-400`],
    playableMoves = [],
    moveHandler = () => {
        console.log('no move handler');
    },
}: BoardItemProps) => {
    const { getSelected, setSelected, tileSize, gap } = useContext(Context);

    // derived attributes
    const selected = getSelected();
    const isSelected = selected.x == position.x && selected.y == position.y;
    // const canMove = playableMoves.length > 0;
    const canMove = playableMoves.length >= 0;
    const realCoords: Vector2 = {
        x: gap + position.x * (tileSize + gap),
        y: gap + position.y * (tileSize + gap),
    };

    // handlers
    const selectedHandler = () => {
        setSelected({ x: position.x, y: position.y });
    };

    const blurHandler = () => {
        setSelected({ x: -1, y: -1 });
    };

    const disabledHandler = () => {};

    // styles
    const tileStyles = `absolute items-center justify-center transition-all left-${position.x} top-${position.y} rounded-md`;

    if (type === BoardItemType.PEG)
        return (
            <Pressable
                className={`${tileStyles} ${colors} ${isSelected ? colors[1] : colors[0]}`}
                style={{ left: realCoords.x, top: realCoords.y, width: tileSize, height: tileSize }}
                onPress={canMove ? selectedHandler : disabledHandler}
                onBlur={blurHandler}>
                <Image
                    source={pawnImage}
                    style={{ width: 20, height: 30 }}
                    className={`transition-all ${isSelected ? ' -translate-y-4 ' : ''}`}></Image>
            </Pressable>
        );

    return <Pressable className={`${tileStyles}  ${colors[0]} `}></Pressable>;
};
