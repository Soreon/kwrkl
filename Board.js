import { Cell } from './Cell.js';

export class Board {
    constructor() {
        this.cells = [];
        this.xLocking = null;
        this.yLocking = null;
        this.generateDOM();
    }

    addTile(tile, x, y) {
        if (this.cells.find(t => t.x === x && t.y === y)) {
            throw new Error('Cell already occupied');
        }

        const cell = new Cell(x, y, null, null, null, null, tile);
        this.cells.push(cell);

        const top = this.cells.find(t => t.x === x && t.y === y - 1);
        const right = this.cells.find(t => t.x === x + 1 && t.y === y);
        const bottom = this.cells.find(t => t.x === x && t.y === y + 1);
        const left = this.cells.find(t => t.x === x - 1 && t.y === y);

        if (top) {
            cell.up = top;
            top.down = cell;
        }

        if (right) {
            cell.right = right;
            right.left = cell;
        }

        if (bottom) {
            cell.down = bottom;
            bottom.up = cell;
        }

        if (left) {
            cell.left = left;
            left.right = cell;
        }
        
        this.generateDOM();
    }

    generateDOM() {
        let minX = Infinity;
        let maxX = -Infinity
        let minY = Infinity;
        let maxY = -Infinity;

        const table = document.querySelector('#board');
        table.innerHTML = '';
    
        if (this.cells.length === 0) {
            const row = crel('tr');
            const cell = crel('td', { class: 'cell', 'data-x': 0, 'data-y': 0 });
            cell.addEventListener('click', () => {
                window.emit('boardCellClicked', { x: 0, y: 0 });
            });
            row.appendChild(cell);
            table.appendChild(row);
            return;
        }
    
        this.cells.forEach(cell => {
            if (cell.x < minX) minX = cell.x;
            if (cell.x > maxX) maxX = cell.x;
            if (cell.y < minY) minY = cell.y;
            if (cell.y > maxY) maxY = cell.y;
        });
    
        const width = maxX - minX + 1;
        const height = maxY - minY + 1;
    
        for (let y = 0; y < height + 2; y++) {
            const row = crel('tr');
            for (let x = 0; x < width + 2; x++) {
                const cell = crel('td', { class: 'cell', 'data-x': x + minX - 1, 'data-y': y + minY - 1 });
                const cellData = this.cells.find(c => c.x === x + minX - 1 && c.y === y + minY - 1);

                if (this.xLocking !== null || this.yLocking !== null) {
                    cell.classList.add('disabled');
                }

                if (this.xLocking === x + minX - 1) {
                    cell.classList.remove('disabled');
                }

                if (this.yLocking === y + minY - 1) {
                    cell.classList.remove('disabled');
                }

                if (cellData && cellData.tile) {
                    cell.innerHTML = `<img src="./image/${cellData.tile.color}_${cellData.tile.shape}.png">`;
                } else {
                    cell.addEventListener('click', () => {
                        window.emit('boardCellClicked', { x: x + minX - 1, y: y + minY - 1 });
                    });
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    }
}