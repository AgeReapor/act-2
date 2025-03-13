import { useContext, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import { Vector2 } from 'types/Vector2';
import { Context } from 'App';
import { pos2coords } from 'utils/GridUtils';
import { Direction } from 'types/Direction';

const pawnImage = require('../assets/pawn.png');
const arrowUp = require('../assets/arrow_up.png');

export type BoardItemProps = {
    // key of the component
    _key?: string;
    // PEG or HOLE
    type?: BoardItemType;
    // Position on board: {x,y}
    position: Vector2;
    // [Default Color, Selected Color]
    // colors?: string[];
    // Available Moves
    playableMoves?: Move[];
    // Called when a move is selected
    moveHandler?: (move: Move) => void;
};

export const BoardItem = ({
    _key = '',
    type = BoardItemType.PEG,
    position = { x: 0, y: 0 },
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
    const realCoords = pos2coords(position, tileSize, gap);

    // handlers
    const selectedHandler = () => {
        setSelected({ x: position.x, y: position.y });
    };

    const blurHandler = () => {
        setSelected({ x: -1, y: -1 });
    };

    const disabledHandler = () => {};

    // styles
    const tileStyles = `absolute items-center justify-center`;
    const [clickedDir, setClickedDir] = useState<Direction | null>(null);

    if (type === BoardItemType.PEG)
        return (
            <Pressable
                className={tileStyles}
                style={{ left: realCoords.x, top: realCoords.y, width: tileSize, height: tileSize }}
                onPress={canMove ? selectedHandler : disabledHandler}
                onBlur={blurHandler}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Image
                    source={pawnImage}
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: [
                            { translateY: isSelected ? -tileSize / 2 : 0 },
                            { scale: isSelected ? 1.1 : 1 },
                        ],
                    }}
                    className={`absolute transition-transform duration-200 ease-out`}
                    tintColor={
                        isSelected ? 'oklch(0.953 0.051 180.801)' : 'oklch(0.437 0.078 188.216)'
                    }></Image>
                {/* {isSelected && (
                    <MoveArrow
                        key={Direction.UP}
                        dir={Direction.UP}
                        moveCallback={() => {
                            console.log('Clicked Up');
                            setClickedDir(Direction.UP);
                        }}></MoveArrow>
                )}
                {isSelected && (
                    <MoveArrow
                        key={Direction.DOWN}
                        dir={Direction.DOWN}
                        moveCallback={() => {
                            console.log('Clicked Down');
                            setClickedDir(Direction.DOWN);
                        }}></MoveArrow>
                )}
                {isSelected && (
                    <MoveArrow
                        key={Direction.LEFT}
                        dir={Direction.LEFT}
                        moveCallback={() => {
                            console.log('Clicked Left');
                            setClickedDir(Direction.LEFT);
                        }}></MoveArrow>
                )}
                {isSelected && (
                    <MoveArrow
                        key={Direction.RIGHT}
                        dir={Direction.RIGHT}
                        moveCallback={() => {
                            console.log('Clicked Right');
                            setClickedDir(Direction.RIGHT);
                        }}></MoveArrow>
                )} */}
            </Pressable>
        );

    return <View className={tileStyles}></View>;
};

type moveArrowProps = {
    dir?: Direction;
    moveCallback?: () => void;
};

const MoveArrow = ({
    dir = Direction.UP,
    moveCallback = () => {
        console.log(`${dir}`);
    },
}: moveArrowProps) => {
    const { tileSize, gap } = useContext(Context);

    let translateY = -tileSize / 2;
    let translateX = 0;
    switch (dir) {
        case Direction.UP:
            translateY = -tileSize * 1.25;
            break;
        case Direction.DOWN:
            translateY = tileSize * 0.25;
            break;
        case Direction.LEFT:
            translateX = -tileSize / 2 - tileSize * 0.25;
            break;
        case Direction.RIGHT:
            translateX = tileSize / 2 + tileSize * 0.25;
            break;
    }

    return (
        <Pressable
            key={dir}
            style={{
                width: '100%',
                height: '100%',
                transform: [{ translateX: translateX }, { translateY: translateY }],
            }}
            className={`absolute`}
            hitSlop={4}
            onPress={moveCallback}>
            <Image
                source={arrowUp}
                className={`absolute`}
                style={{
                    width: '100%',
                    height: '100%',
                    transform: [{ rotate: dir }],
                }}
                tintColor={'oklch(0.129 0.042 264.695)'}></Image>
        </Pressable>
    );
};
