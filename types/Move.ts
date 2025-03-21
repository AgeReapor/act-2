import { Vector2 } from './Vector2';

export type Move = {
    type: 'move' | 'eat';
    from: Vector2;
    to: Vector2;
    eaten: Vector2 | null;
};
