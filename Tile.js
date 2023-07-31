export class Tile {
    static possibleShapeValues = ['circle', '4ptStar', 'diamond', 'square', '8ptStar', 'clover'];
    static possibleColorValues = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
    }   
}