import { useContext, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import { Vector2 } from 'types/Vector2';
import { Context } from 'App';
import { pos2coords } from 'utils/GridUtils';
import { Direction } from 'types/Direction';

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
};

export const BoardItem = ({
    _key = '',
    type = BoardItemType.PEG,
    position = { x: 0, y: 0 },
    canMove = false,
    moveHandler = () => {
        console.log('no move handler');
    },
}: BoardItemProps) => {
    const { getSelected, setSelected, tileSize, gap } = useContext(Context);

    // derived attributes
    const selected = getSelected();
    const isSelected = selected.x == position.x && selected.y == position.y;
    // const canMove = playableMoves.length > 0;

    const realCoords = pos2coords(position, tileSize, gap);

    // handlers
    const selectedHandler = () => {
        setSelected({ x: position.x, y: position.y });
    };

    const blurHandler = () => {
        // setSelected({ x: -1, y: -1 });
    };

    const disabledHandler = () => {
        setSelected({ x: -1, y: -1 });
    };

    // styles
    const tileStyles = `absolute items-center justify-center`;
    const [clickedDir, setClickedDir] = useState<Direction | null>(null);

    const disabledColor = 'oklch(0.437 0.078 188.216)';
    const defaultColor = 'oklch(0.277 0.046 192.524)';
    const selectedColor = 'oklch(0.953 0.051 180.801)';

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
                    className={`absolute transition-transform duration-200 ease-out ${isSelected ? 'drop-shadow-2xl' : ''}`}
                    tintColor={
                        isSelected ? selectedColor : canMove ? defaultColor : disabledColor
                    }></Image>
            </Pressable>
        );

    return <View className={tileStyles}></View>;
};
