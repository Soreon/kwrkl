export class Cell {
    constructor(x, y, up, left, down, right, tile) {
        this.x = x;
        this.y = y;
        this.up = up;
        this.left = left;
        this.down = down;
        this.right = right;
        this.tile = tile;
    }
}