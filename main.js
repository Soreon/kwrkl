import { Tile } from './Tile.js';
import { Board } from './Board.js';
import { Player } from './Player.js';
import { Bag } from './Bag.js'

window.emit = (name, detail) => document.body.dispatchEvent(new CustomEvent(name, { detail }));
window.on = (name, callback) => document.body.addEventListener(name, (event) => { callback(event.detail) });

let bag = new Bag(); // Pioche
const players = []; // Joueurs
let currentPlayerIndex = -1;
window.players = players;
let xFirstClick = null;
let yFirstClick = null;
let secondClickLock = null;

// Création du plateau de jeu
let board = new Board();

// Création des joueurs 
players.push(new Player('Joueur 1'));
players.push(new Player('Joueur 2'));

// Distribution des tiles aux joueurs
function distributeTiles() {
    players.forEach(player => {
        player.removeAllTiles();
        for (let i = 0; i < 6; i++) {
            player.addTile(bag.pickRandomTile());
        }
    });
}

// Dessin des tiles des joueurs 
function renderPlayersDOM() {
    document.querySelector('#players').innerHTML = '';
    players.forEach(player => {
        document.querySelector('#players').appendChild(player.generateDOM());
    });
}
renderPlayersDOM();

// Détermination de l'index du joueur qui commence
function determineFirstPlayer() {
    const playerMax = [];
    players.forEach((player, index) => {
        const uniqueTiles = player.tiles.filter((tile, index, tiles) => {
            const indexOfTile = tiles.findIndex(t => t.shape === tile.shape && t.color === tile.color);
            return indexOfTile === index;
        });

        const possibleTileTypes = {};
        Tile.possibleColorValues.forEach(color => {
            possibleTileTypes[color] = uniqueTiles.filter(tile => tile.color === color).length;
        });
        Tile.possibleShapeValues.forEach(shape => {
            possibleTileTypes[shape] = uniqueTiles.filter(tile => tile.shape === shape).length;
        });

        playerMax[index] = Math.max(...Object.values(possibleTileTypes));
        console.log(player.name + ': ' + playerMax[index]);
    });

    if (playerMax.every(val => val === playerMax[0])) {
        currentPlayerIndex = Math.floor(Math.random() * players.length);
    } else {
        const maxofMax = Math.max(...playerMax);
        const indexes = playerMax.map((val, index) => val === maxofMax ? index : null).filter(val => val !== null);
        currentPlayerIndex = indexes[Math.floor(Math.random() * indexes.length)];
    }
    console.log('Au tour de ' + players[currentPlayerIndex].name);
}

// Dessin des tiles dans le sac 
function renderBagDOM() {
    document.querySelector('#bag').innerHTML = '';
    document.querySelector('#bag').appendChild(bag.generateDOM());
}
renderBagDOM();

document.querySelector('#start').addEventListener('click', () => {
    console.log('Début de la partie');
    document.querySelector('#start').disabled = true;
    document.querySelector('#dropAndDraw').disabled = false;
    document.querySelector('#endTurn').disabled = false;
    document.querySelector('#reset').disabled = false;

    distributeTiles();
    determineFirstPlayer();
    players[currentPlayerIndex].setActive(true);
    renderPlayersDOM();
    renderBagDOM();
});

document.querySelector('#endTurn').addEventListener('click', () => {
    console.log('Fin du tour de ' + players[currentPlayerIndex].name);
    const nbOfTiles = players[currentPlayerIndex].tiles.length;
    for (let i = 0; i < 6 - nbOfTiles; i++) {
        players[currentPlayerIndex].addTile(bag.pickRandomTile());
    }
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    players.find(player => player.active).setActive(false);
    players[currentPlayerIndex].setActive(true);
    console.log('Au tour de ' + players[currentPlayerIndex].name);
    xFirstClick = null;
    yFirstClick = null;
    secondClickLock = null;
    document.querySelector('#dropAndDraw').disabled = false;
    board.xLocking = null;
    board.yLocking = null;
    renderPlayersDOM();
    renderBagDOM();
    board.generateDOM();
});

document.querySelector('#dropAndDraw').addEventListener('click', () => {
    const currentPlayer = players[currentPlayerIndex];
    const len = currentPlayer.selectedTiles.length - 0;
    for (let i = 0; i < len; i++) {
        const firstSelectedTile = currentPlayer.selectedTiles[0];
        bag.putTileBack(currentPlayer.tiles[currentPlayer.selectedTiles[0]]);
        currentPlayer.tiles.splice(firstSelectedTile, 1);
        currentPlayer.selectedTiles.splice(0, 1);
        currentPlayer.selectedTiles = currentPlayer.selectedTiles.map((v) => v < firstSelectedTile ? v : v - 1);
    }
    document.querySelector('#endTurn').click();
});

document.querySelector('#reset').addEventListener('click', () => {
    console.log('Réinitialisation du jeu');
    document.querySelector('#start').disabled = false;
    document.querySelector('#dropAndDraw').disabled = true;
    document.querySelector('#endTurn').disabled = true;
    document.querySelector('#reset').disabled = true;

    bag = new Bag();
    board = new Board();

    players.forEach(player => {
        player.removeAllTiles();
    });
    currentPlayerIndex = -1;
    xFirstClick = null;
    yFirstClick = null;
    secondClickLock = null;
    renderPlayersDOM();
    renderBagDOM();
});

window.on('boardCellClicked', ({ x, y }) => {
    if (xFirstClick === null) {
        xFirstClick = x;
        board.xLocking = x;
    } else if (secondClickLock === null && xFirstClick === x) {
        secondClickLock = 'x'
    }

    if (yFirstClick === null) {
        yFirstClick = y;
        board.yLocking = y;
    } else if (secondClickLock === null && yFirstClick === y) {
        secondClickLock = 'y'
    }
    
    if (xFirstClick !== x && yFirstClick !== y) {
        return;
    } else if (secondClickLock !== null) {
        if (secondClickLock === 'x' && xFirstClick !== x) return;
        if (secondClickLock === 'y' && yFirstClick !== y) return;
    }
    if (currentPlayerIndex === -1) return;
    const player = players[currentPlayerIndex];
    const tile = player.tiles[player.selectedTiles[0]];
    if (!tile) return;
    document.querySelector('#dropAndDraw').disabled = true;
    const firstSelectedTile = player.selectedTiles[0];
    player.tiles.splice(firstSelectedTile, 1);
    player.selectedTiles.splice(0, 1);
    player.selectedTiles = player.selectedTiles.map((v) => v < firstSelectedTile ? v : v - 1);
    board.addTile(tile, x, y);
    renderPlayersDOM();
    renderBagDOM();
});


window.board = board;