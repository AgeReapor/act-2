import { useContext, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import { Vector2 } from 'types/Vector2';
import { Context } from 'App';
import { pos2coords } from 'utils/GridUtils';

const pawnImage = require('../assets/pawn.png');

export type BoardItemProps = {
    // key of the component
    _key?: string;
    // PEG or HOLE
    type?: BoardItemType;
    // Position on board: {x,y}
    position: Vector2;
    // [Default Color, Selected Color]
    // colors?: string[];
    // canMove
    canMove?: boolean;
    // Called when a move is selected
    moveHandler?: (move: Move) => void;

    owner?: 'white' | 'red';
};

export const BoardItem = ({
    _key = '',
    type = BoardItemType.MAN,
    position = { x: 0, y: 0 },
    moveHandler = () => {
        console.log('no move handler');
    },
    owner = 'white',
}: BoardItemProps) => {
    const {
        getSelected,
        setSelected,
        tileSize,
        gap,
        defaultRed,
        selectedRed,
        defaultWhite,
        selectedWhite,
        currentPlayer,
    } = useContext(Context);

    // derived attributes
    const selected = getSelected();
    const isSelected = selected.x == position.x && selected.y == position.y;

    const realCoords = pos2coords(position, tileSize, gap);

    // handlers
    const selectedHandler = () => {
        if (currentPlayer != owner) return;
        setSelected({ x: position.x, y: position.y });
    };

    const blurHandler = () => {
        // setSelected({ x: -1, y: -1 });
    };

    const disabledHandler = () => {
        setSelected({ x: -1, y: -1 });
    };

    // styles
    const relSize = 0.8;
    const relPadding = (1 - relSize) / 2;
    const relTranslate = 0.3;

    const size = tileSize * relSize;
    const pad = tileSize * relPadding;
    const offset = isSelected ? (tileSize * relPadding) / 2 : 0;

    const translate = isSelected ? -tileSize * relTranslate : 0;
    const brightness = currentPlayer === owner ? 'brightness-150' : 'brightness-90';

    let rotate = isSelected ? '45deg' : '0deg';

    const defaultColor = owner === 'red' ? defaultRed : defaultWhite;
    const selectedColor = owner === 'red' ? selectedRed : selectedWhite;

    const color = isSelected ? selectedColor : defaultColor;

    const spriteStyle = `absolute transition-all rounded-full duration-150 ease-out`;

    const isKing = type === BoardItemType.KING;

    if (type === BoardItemType.MAN || type === BoardItemType.KING)
        return (
            <Pressable
                className={`absolute z-30 transition-all duration-100 ease-out `}
                onPress={selectedHandler}
                style={{
                    width: tileSize,
                    height: tileSize,
                    left: realCoords.x,
                    top: realCoords.y,
                }}>
                <View
                    className={`${spriteStyle}  ${brightness}  ${color}`}
                    style={{
                        width: size,
                        height: size,
                        left: pad,
                        top: pad,
                        transform: [{ translateY: translate }, { rotateX: rotate }],
                    }}
                />
                <View
                    className={`${spriteStyle} ${color} ${brightness} z-10 mix-blend-hard-light `}
                    style={{
                        width: size,
                        height: size,
                        left: pad,
                        top: pad - offset,
                        transform: [{ translateY: translate }, { rotateX: rotate }],
                    }}
                />
                {isKing && (
                    <View
                        className={`z-0 saturate-200 ${spriteStyle} ${selectedColor} ${isSelected ? 'animate-ping' : ''}  `}
                        style={{
                            width: size,
                            height: size,
                            left: pad,
                            top: pad - 2 * offset - (tileSize * relPadding) / 2,
                            transform: [{ translateY: translate }, { rotateX: rotate }],
                        }}
                    />
                )}
            </Pressable>
        );

    return <View className={spriteStyle}></View>;
};
