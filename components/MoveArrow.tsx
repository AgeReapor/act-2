import { Context } from 'App';
import { useContext } from 'react';
import { Image, Pressable } from 'react-native';
import { Direction } from 'types/Direction';
import { Vector2 } from 'types/Vector2';
import { calcGridPosition } from 'utils/GridUtils';

const arrowUp = require('../assets/arrow_up.png');

type moveArrowProps = {
    pos?: Vector2;
    dir?: Direction;
    moveCallback?: () => void;
};

export const MoveArrow = ({
    pos = { x: -1, y: -1 },
    dir = Direction.UP,
    moveCallback = () => {
        console.log(`${dir}`);
    },
}: moveArrowProps) => {
    if (pos.x == -1 || pos.y == -1) return null;

    const { tileSize, gap } = useContext(Context);

    let translateY = tileSize * -0.5;
    let translateX = 0;
    switch (dir) {
        case Direction.UP:
            translateY = tileSize * -1.5;
            break;
        case Direction.DOWN:
            translateY = tileSize * 0.5;
            break;
        case Direction.LEFT:
            translateX = tileSize * -1;
            break;
        case Direction.RIGHT:
            translateX = tileSize * 1;
            break;
    }

    return (
        <Pressable
            key={dir}
            style={{
                width: tileSize,
                height: tileSize,
                left: 1.5 * gap + calcGridPosition(pos, tileSize, gap).x,
                top: 1.5 * gap + calcGridPosition(pos, tileSize, gap).y,
                transform: [{ translateX: translateX }, { translateY: translateY }],
            }}
            className={`absolute items-center justify-center rounded-md bg-teal-950 `}
            // hitSlop={4}
            onPress={moveCallback}>
            <Image
                source={arrowUp}
                className={`absolute`}
                style={{
                    width: '90%',
                    height: '90%',
                    transform: [{ rotate: dir }],
                    // tintColor: 'oklch(0.511 0.096 186.391)',
                    tintColor: `oklch(0.953 0.051 180.801)`,
                }}></Image>
        </Pressable>
    );
};
