import { Context } from 'App';
import { useContext } from 'react';
import { Image, Pressable } from 'react-native';
import { Direction } from 'types/Direction';
import { Vector2 } from 'types/Vector2';

const arrowUp = require('../assets/arrow_up.png');

type moveArrowProps = {
    pos?: Vector2;
    dir?: Direction;
    moveCallback?: () => void;
};

const MoveArrow = ({
    pos = { x: -1, y: -1 },
    dir = Direction.UP,
    moveCallback = () => {
        console.log(`${dir}`);
    },
}: moveArrowProps) => {
    if (pos.x == -1 || pos.y == -1) return null;

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
