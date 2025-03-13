import { Vector2 } from 'types/Vector2';

export type GridAttributes = {
    gap: number;
    tileSize: number;
};

export function calcGridAttrs(canvasSize: number, tilesInASide: number): GridAttributes {
    // total gap must at least equal a tile in size
    const totalGap = Math.ceil(tilesInASide / 4);
    const tileSize = Math.ceil(canvasSize / (tilesInASide + totalGap));
    const gap = Math.ceil((totalGap * tileSize) / (tilesInASide + 1));

    console.log('Canvas Size: ' + canvasSize);
    console.log('Tiles In A Side: ' + tilesInASide);
    console.log('Total Gap: ' + totalGap);
    console.log('Tile Size: ' + tileSize);
    console.log('Gap: ' + gap);

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
