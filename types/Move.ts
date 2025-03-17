import { Direction } from './Direction';
import { Vector2 } from './Vector2';

export type Move = {
    dir: Direction;
    from: Vector2;
    to: Vector2;
    eaten: Vector2;
};
