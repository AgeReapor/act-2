import { Context } from 'App';
import { useContext } from 'react';
import { Pressable } from 'react-native';
import { Vector2 } from 'types/Vector2';
import { pos2coords } from 'utils/GridUtils';

export type BoardSquareProps = {
    key: string;
    position?: Vector2;
    defaultColor?: string;
    focusColor?: string;
};

export const BoardSquare = ({
    position = { x: 0, y: 0 },
    defaultColor = `bg-teal-200`,
    focusColor = `bg-teal-400`,
}: BoardSquareProps) => {
    const { getSelected, tileSize, gap, setSelected } = useContext(Context);

    // derived attributes
    const selected = getSelected();
    const isSelected = selected.x == position.x && selected.y == position.y;

    const realCoords = pos2coords(position, tileSize, gap);

    const tileStyles = `absolute transition-all rounded-md ${isSelected ? focusColor : defaultColor}`;

    return (
        <Pressable
            key={'bg_' + position.x + '_' + position.y}
            className={tileStyles}
            style={{
                left: realCoords.x,
                top: realCoords.y,
                width: tileSize,
                height: tileSize,
            }}
            onPress={() => setSelected({ x: -1, y: -1 })}></Pressable>
    );
};
