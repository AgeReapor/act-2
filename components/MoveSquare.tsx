import { Context } from 'App';
import { useContext } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Vector2 } from 'types/Vector2';
import { calcGridPosition } from 'utils/GridUtils';

type moveSquareProps = {
    pos?: Vector2;
    moveCallback?: () => void;
};

export const MoveSquare = ({
    pos = { x: -1, y: -1 },
    moveCallback = () => {
        console.log(`no move callback`);
    },
}: moveSquareProps) => {
    if (pos.x == -1 || pos.y == -1) return null;

    const { tileSize, gap, moveTile } = useContext(Context);

    return (
        <Pressable
            style={{
                width: tileSize,
                height: tileSize,
                left: 1.5 * gap + calcGridPosition(pos, tileSize, gap).x,
                top: 1.5 * gap + calcGridPosition(pos, tileSize, gap).y,
            }}
            className={`absolute animate-pulse items-center justify-center rounded  ${moveTile} `}
            onPress={moveCallback}></Pressable>
    );
};

const introAnim = {
    from: {
        width: 0,
        height: 0,
    },
    to: {
        width: 0.8 * 100,
        height: 0.8 * 100,
    },
};
