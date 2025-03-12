import { useContext, useState } from 'react';
import { Image, Pressable, Text } from 'react-native';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import { Vector2 } from 'types/Vector2';
import { SelectContext } from 'App';

type BoardItemProps = {
    // key of the component
    key: string;
    // PEG or HOLE
    type: BoardItemType;
    // Position on board: {x,y}
    position: Vector2;
    // [Default Color, Selected Color]
    colors: string[];
    // Available Moves
    playableMoves: Move[];
    // Called when a move is selected
    moveHandler: (move: Move) => void;
};

const pawnImage = require('../assets/pawn.png');
const holeImage = require('../assets/hole.png');

export const BoardItem = ({
    key,
    type,
    position,
    colors,
    playableMoves,
    moveHandler,
}: BoardItemProps) => {
    const { getSelected, setSelected } = useContext(SelectContext);

    // derived attributes
    const selected = getSelected();
    const isSelected = selected.x == position.x && selected.y == position.y;
    // const canMove = playableMoves.length > 0;
    const canMove = playableMoves.length >= 0;

    // handlers
    const selectedHandler = () => {
        setSelected({ x: position.x, y: position.y });
    };

    const blurHandler = () => {
        setSelected({ x: -1, y: -1 });
    };

    const disabledHandler = () => {};

    // styles
    const tile = `relative size-10 items-center justify-center transition-colors rounded-md`;

    if (type === BoardItemType.PEG)
        return (
            <Pressable
                className={`${tile} ${colors} ${isSelected ? colors[1] : colors[0]}`}
                onPress={canMove ? selectedHandler : disabledHandler}
                onBlur={blurHandler}>
                <Image
                    source={pawnImage}
                    style={{ width: 20, height: 30 }}
                    className={`transition-all ${isSelected ? ' -translate-y-4 ' : ''}`}></Image>
            </Pressable>
        );

    return <Pressable className={`${tile}  ${colors[0]} `}></Pressable>;
};
