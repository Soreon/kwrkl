export class Player {
    constructor(name) {
        this.name = name;
        this.tiles = [];
        this.active = false;
        this.selectedTiles = [];
    }

    addTile(tile) {
        this.tiles.push(tile);
    }

    removeTile(tile) {
        const index = this.tiles.indexOf(tile);
        if (index === -1) {
            throw new Error('Tile not found');
        }
        this.tiles.splice(index, 1);
    }

    removeAllTiles() {
        this.tiles = [];
        this.selectedTiles = [];
    }

    setActive(active) {
        if (!active) this.selectedTiles = [];
        this.active = active;
    }
    
    generateDOM() {
        let element = crel('div', { class: 'player', 'data-name': this.name }, this.name, crel('div', { class: 'tiles' }));
        if (this.active) element.classList.add('active');
        for (let i = 0; i < 6; i++) {
            const cell = crel('div', { class: 'cell' });
            if (this.selectedTiles.includes(i)) cell.classList.add('selected');
            if (this.tiles[i]) {
                cell.innerHTML = `<img src="./image/${this.tiles[i].color}_${this.tiles[i].shape}.png">`;
                cell.addEventListener('click', () => {
                    if (!this.active) return;
                    if (this.selectedTiles.includes(i)) {
                        this.selectedTiles.splice(this.selectedTiles.indexOf(i), 1);
                        cell.classList.remove('selected');
                    } else {
                        this.selectedTiles.push(i);
                        cell.classList.add('selected');
                    }
                });
            }
            element.lastChild.appendChild(cell);
        }

        return element;
    }
}