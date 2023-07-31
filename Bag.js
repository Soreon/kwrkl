import { Tile } from './Tile.js';

export class Bag {
    tiles = [];

    constructor() {
        // Création des 108 tiles
        Tile.possibleShapeValues.forEach(shape => {
            Tile.possibleColorValues.forEach(color => {
                this.tiles.push(new Tile(shape, color));
                this.tiles.push(new Tile(shape, color));
                this.tiles.push(new Tile(shape, color));
            });
        });
        this.tiles = this.tiles.sort(() => 0.5 - Math.random());
    }

    pickRandomTile() {
        return this.tiles.splice((Math.floor(Math.random() * this.tiles.length)), 1)[0];
    }

    putTileBack(tile) {
        this.tiles.push(tile);
    }

    generateDOM() {
        let element = crel('div', 'Pioche', crel('div', { class: 'tiles' }));
        for (let i = 0; i < this.tiles.length; i++) {
            const cell = crel('div', { class: 'cell' });
            if (this.tiles[i]) {
                cell.innerHTML = `<img src="./image/${this.tiles[i].color}_${this.tiles[i].shape}.png">`;
            }
            element.lastChild.appendChild(cell);
        }

        return element;
    }
}