import { useReducer, useState } from 'react';
import Tile from './Tile';
import { isVertView } from '../../scripts/useWindowWidth';

import './Minesweeper.css';

import { PiShovelFill, PiMouseLeftClick, PiMouseRightClick } from 'react-icons/pi'
import { FaFlag } from 'react-icons/fa6';

function newTile(): 
{ isMine: boolean, isRevealed: boolean, isFlagged: boolean, adjacentMines: number }
{
    return {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    adjacentMines: 0
    }
}


function newGameState(size: number, mineCount: number, markSafeStartTile?: {x:number, y:number}):
 { isMine: boolean, isRevealed: boolean, isFlagged: boolean, adjacentMines: number }[][] 
 {

    // make matrix filled with empty tiles
    const tiles= Array.from(
                {length: size}, () => (Array.from(
                    {length: size}, () => newTile()
                )
            ));

    // add mines
    if (mineCount > size*size-1) throw `GameState needs at least one safe tile!`;
    if (mineCount >0) {
        const numMines = size*size;
        const indexes = [...Array(numMines).keys()];

        if (markSafeStartTile) indexes.splice(markSafeStartTile.y*size+markSafeStartTile.x, 1);
        
        for (let i=0; i<mineCount; i++) {
            // grab random serialized index of the board we haven't touched yet
            // then convert to coordinates, then set as mine
            const coord = indexes.splice(Math.floor(Math.random() * indexes.length), 1)[0];
            const x = coord%size;
            const y = Math.floor(coord/size);
            tiles[y][x].isMine = true;
            // increment all neighbors' counts
            for (let dx = -1; dx <= 1; dx++) 
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                        tiles[ny][nx].adjacentMines++;
                    }
                }
        }

        // record number of adjacent mines in each tile
        function getAdjacentMines(x: number, y: number): number {
            let count = 0;
            for(let dx=-1; dx<=1; dx++) {
                for(let dy=-1; dy<=1; dy++) {
                    const newX = x+dx;
                    const newY = y+dy;
                    if (newX<0 || newX>=size || newY<0 || newY>=size || (dx==0 && dy==0))
                        continue;
                    count += tiles[newY][newX].isMine?1:0;
                }
            }
            return count;
        }
        tiles.forEach((vector, y) => {
                vector.forEach((tile, x) => tile.adjacentMines = getAdjacentMines(x, y))
            });
    }
    
    return tiles;

}

function sizeToMines(size: number, difficulty: string): number {
    let mines = size*size;
    switch(difficulty){
        case 'Easy': {mines *= 0.11; break;}
        case 'Medium': {mines *= 0.16; break;}
        case 'Hard': {mines *= 0.21; break;}
    }
    return Math.floor(mines);
}


export class GameState {
    tiles: { isMine: boolean, isRevealed: boolean, isFlagged: boolean, adjacentMines: number }[][];
    size: number;
    difficulty: string;
    status: 'not_started' | 'ongoing' | 'won' | 'lost';
    
    constructor(state: {
         isMine: boolean, isRevealed: boolean, isFlagged: boolean, adjacentMines: number 
        }[][], status: 'not_started' | 'ongoing' | 'won' | 'lost' = 'not_started', difficulty: string) {
        if (state.length == 0) throw 'GameState size cannot be length 0';
        if (state.length != state[0].length) throw `GameState must be a square. Was ${state.length}x${state[0].length}`;

        this.tiles = state;
        this.size = state.length;
        this.status = status;
        this.difficulty = difficulty;
    }

    public clone(): GameState {
        return new GameState(this.tiles, this.status, this.difficulty);
    }

    public setMines(arr: boolean[][]) {

        if (arr.length != this.size || arr.length != arr[0].length) throw 'array sizes do not match';
        this.tiles.forEach((vector) => vector.forEach((tile) => tile.adjacentMines = 0)); // reset

        for (let i=0; i<this.size; i++) {
            for (let j=0; j<this.size; j++) {
                if (arr[i][j]) {
                    this.tiles[i][j].isMine = true;
                    // increment all neighbors' counts
                    for (let dx = -1; dx <= 1; dx++) 
                        for (let dy = -1; dy <= 1; dy++) {
                            if (dx === 0 && dy === 0) continue;
                            const ny = i + dy;
                            const nx = j + dx;
                            if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                                this.tiles[ny][nx].adjacentMines++;
                            }
                        }
                }
            }
        }

    }

    public revealTile(x: number, y: number) {
        const tile = this.tiles[y][x];
        tile.isRevealed = true;
        tile.isFlagged = false;
        if (tile.adjacentMines == 0 && !tile.isMine) {
            // reveal all adjacent "0" tiles
            let visitedSet = new Set<string>();
            visitedSet.add(`${x},${y}`);
            this.revealTileRecursive(x, y, visitedSet);
        }
        this.updateGameStatus();
    }

    private revealTileRecursive(x:number, y:number, visitedSet: Set<string>) {
        for (let dx = -1; dx <= 1; dx++) 
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const ny = y + dy;
                const nx = x + dx;
                if (!visitedSet.has(`${nx},${ny}`) && nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                    this.tiles[ny][nx].isRevealed = true;
                    this.tiles[ny][nx].isFlagged = false;
                    visitedSet.add(`${nx},${ny}`);
                    if (this.tiles[ny][nx].adjacentMines == 0) this.revealTileRecursive(nx, ny, visitedSet);
                }
            }
    }

    public revealAllMines() {
        this.tiles.forEach((vector) => (
            vector.forEach((tile) => {
                if (tile.isMine) tile.isRevealed = true
            })
        ));
    }

    public updateGameStatus() {

        let safeTileHidden = false;
        let safeTileShown = false;

        for (let vector of this.tiles) {
            for (let tile of vector) {
                if (tile.isMine && tile.isRevealed) {
                    this.status = 'lost';
                    return;
                }
                if (tile.isRevealed) safeTileShown = true;
                else if (!tile.isMine) safeTileHidden = true;
            }
        }

        this.status = safeTileHidden && safeTileShown ? 'ongoing' :
                      safeTileHidden ? 'not_started' : 'won';
        return;
    }

}

function gameStateReducer(state: GameState, action: any) {

    const actionType: string = action.type;

    let newState: GameState;
    if (state.status == 'not_started') {
        let mineCount = sizeToMines(state.size, state.difficulty);
        newState = new GameState(newGameState(state.size, mineCount, {x: action.x, y: action.y}), 'not_started', state.difficulty);
    } else {
        newState = state.clone();
    }

    switch (actionType) {

        case 'dig':
            if (!newState.tiles[action.y][action.x].isFlagged) {
                newState.revealTile(action.x, action.y);
                if (newState.status == 'lost') newState.revealAllMines();
            }
            break;
        
        case 'setFlag':
            newState.tiles[action.y][action.x].isFlagged = true;
            break;
        
        case 'removeFlag':
            newState.tiles[action.y][action.x].isFlagged = false;
            break;

        case 'restartGame':
            newState = new GameState(newGameState(action.size, action.mineCount), 'not_started', action.difficulty);
            break;

        default:
            // if action type doesn't match, do nothing
            break;
    }
    return newState;
}

/*
class GameState {

    arr: { isMine: boolean, isRevealed: boolean, adjacentMines: number }[][];
    size: number;

    constructor(size: number, mines: number, markSafeStartTile?: {x:number, y:number}) {
        this.size = size;
        this.arr = Array.from({length: size}, () =>
            Array.from({length: size}, () => newTile())
        );

        const numMines = size*size;
        const indexes = [...Array(numMines).keys()];

        if (markSafeStartTile) indexes.splice(markSafeStartTile.y*size+markSafeStartTile.x, 1);
        
        for (let i=0; i<mines; i++) {
            // grab random serialized index of the board we haven't touched yet
            // then convert to coordinates, then set as mine
            const coord = indexes.splice(Math.floor(Math.random() * indexes.length), 1)[0];
            const x = coord%size;
            const y = Math.floor(coord/size);
            this.arr[y][x].isMine = true;
        }

        // find adjacent mines for all tiles
        this.arr.forEach((vector, y) => {
            vector.forEach((tile, x) => tile.adjacentMines = this.getAdjacentMines(x, y))
        });
    }

    public getAdjacentMines(x: number, y: number): number {
        let count = 0;
        
        for(let dx=-1; dx<=1; dx++) {
            for(let dy=-1; dy<=1; dy++) {
                const newX = x+dx;
                const newY = y+dy;
                if (newX<0 || newX>=this.size || newY<0 || newY>=this.size || (dx==0 && dy==0))
                    continue;
                count += this.arr[newY][newX].isMine?1:0;
            }
        }

        return count;
    }

    public revealTile(x: number, y: number) {
        this.arr[y][x].isRevealed = true;
    }

}
    */

export default function MinesweeperMain() {

    const [size, setSize] = useState(10);
    const [desiredSize, setDesiredSize] = useState(size);
    const [mineCount, setMineCount] = useState(11);
    const [difficulty, setDifficulty] = useState('Easy')

    const [state, dispatch] = useReducer(gameStateReducer, new GameState(newGameState(desiredSize, mineCount) ,'not_started', difficulty));
    const vertView = isVertView();

      
    function handleTileClick(x: number, y: number, type: string): void {
        if (state.tiles[y][x].isRevealed || state.status == 'lost' ||state.status == 'won') return;
        if (type == "dig") {
            dispatch({type: 'dig', x: x, y: y});
        } else if (type == "setFlag") {
            if (state.status == 'not_started') return;
            dispatch({type: 'setFlag', x: x, y: y})
        } else if (type == "removeFlag") {
            dispatch({type: 'removeFlag', x: x, y: y})
        } else {
            throw `invalid type argument passed into handleTileClick: ${type}`;
        }
    }

    //RunTests();

    // JSX

    const interfaceJSX =     
    <div style={{width: vertView?"60%":"40%"}}>
        
      <span style={{paddingBlock: "0px"}}>
        <span className="flex-center"><PiMouseLeftClick style={{fontSize:"2rem"}}/><PiShovelFill style={{fontSize:"2rem"}}/><p>Left Click to Dig</p></span>
        <span className="flex-center"><PiMouseRightClick style={{fontSize:"2rem"}}/><FaFlag style={{fontSize:"1.7rem"}}/><p>Right Click to Flag</p></span>
      </span>

      <span style={{display: "flex", flexDirection: "column", padding: "20px", gap:"20px"}}>
        <button className="gradient-button google-sans-code" onClick={() => {
            setMineCount(sizeToMines(desiredSize, difficulty));
            dispatch({type: 'restartGame', size: desiredSize, mineCount: mineCount, difficulty: difficulty});
            setSize(desiredSize);
            }}>RESET</button>
        <input defaultValue={size} type="range" step="1" min="5" max="18" onChange={(e) => {
            const newSize = Number.parseInt(e.target.value);
            const mines = sizeToMines(newSize, difficulty);
            setDesiredSize(newSize);
            setMineCount(mines);
        }}/>
        <select name="difficulty" onChange={(e) => {
            setDifficulty(e.target.value);
            const mines = sizeToMines(size, difficulty)
            setMineCount(mines);
        }}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
        </select>
        
      </span>
        {state.status}
    </div>;

    return (<div style={{
        display:"flex", 
        flexDirection: vertView?"column":"row",
        justifyContent: "center",
        alignItems: "center"
        }}>

        {vertView? <></> : interfaceJSX}
        <div className="minefield-container" onContextMenu={(e) => e.preventDefault()}
        style={{
            border: `5px solid ${state.status == 'won'? 'lime' : state.status == 'lost'? 'red' : 'var(--contrastColor)'}`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gap: "1%"
        }}>
            {[...Array(size**2)].map((_, i: number) => {
                return <Tile 
                key={i}
                state={state} 
                coord={{x:i%size, y:Math.floor(i/size)}} 
                handleClick={handleTileClick}/>
            })}
        </div>
        {vertView? interfaceJSX : <></>}

    </div>)
}


function RunTests() {

    const state1 = new GameState(newGameState(3, 0));
    state1.setMines([[true, true, true],
                     [false, true, false], 
                     [true, false, true]]);

    assertTrue(state1.tiles[0][0].adjacentMines == 2, "tile x=0, y=0 has 2 adjacent mines");
    assertTrue(state1.tiles[1][1].adjacentMines == 5, "tile x=1, y=1 has 5 adjacent mines");
    assertTrue(state1.tiles[2][1].adjacentMines == 3, "tile x=1, y=2 has 3 adjacent mines");

    for (let i=0; i<10; i++) {
        const state2 = new GameState(newGameState(3, 8, {x:2, y:2}));
        assertTrue(state2.tiles[2][2].isMine == false,
                "tile marked as safe in otherwise filled minefield is safe");
    }

    const state2 = new GameState(newGameState(3, 0));
    state2.setMines([[true, false, true],
                     [false, true, false], 
                     [true, false, true]]);
    assertTrue(state2.status == 'not_started', "game not started has status not_started");
    state2.revealTile(0, 1);
    assertTrue(state2.status == 'ongoing', "game with one tile cleared is ongoing");
    state2.revealTile(1,0); state2.revealTile(1, 2); state2.revealTile(2, 1);
    assertTrue(state2.status == 'won', "game with all safe tiles cleared is won");
    state2.revealTile(0, 0);
    assertTrue(state2.status == 'lost', "game with mine revealed is a loss");

    console.log("ALL TESTS PASSED!");

}

function assertTrue(b: boolean, name: string) {
    if (!b) throw `TEST FAILED: ${name}`;
}