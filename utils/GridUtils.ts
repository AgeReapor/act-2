import { Vector2 } from 'types/Vector2';

export type GridAttributes = {
    gap: number;
    tileSize: number;
};

export function calcGridAttrs(canvasSize: number, tilesInASide: number): GridAttributes {
    // total gap must at least equal a tile in size
    const totalGap = Math.ceil(tilesInASide / 8);
    const tileSize = Math.ceil(canvasSize / (tilesInASide + totalGap));
    const gap = Math.ceil((totalGap * tileSize) / (tilesInASide + 3));

    return {
        gap,
        tileSize,
    };
}

export function calcGridPosition(position: Vector2, tileSize: number, gap: number): Vector2 {
    return {
        x: position.x * tileSize + position.x * gap,
        y: position.y * tileSize + position.y * gap,
    };
}

export function pos2coords(pos: Vector2, tileSize: number, gap: number): Vector2 {
    return {
        x: 1 * gap + pos.x * (tileSize + gap),
        y: 1 * gap + pos.y * (tileSize + gap),
    };
}
