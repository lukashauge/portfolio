import React, { useEffect, useReducer, useState } from 'react';
import confetti from "canvas-confetti";

import Tile from './Tile';
import Stopwatch from './Stopwatch';
import { isVertView } from '../../scripts/useWindowDimensions';
import useWindowDimensions from '../../scripts/useWindowDimensions';

import './Minesweeper.css';

import { PiShovelFill, PiMouseLeftClick, PiMouseRightClick } from 'react-icons/pi'
import { FaFlag } from 'react-icons/fa6';

function reverseLerp(value: number, lower: number, upper: number): number {
    // clamp
    if (value <= lower) return 0;
    if (value >= upper) return 1;
    // reverse lerp
    return (value - lower) / (upper - lower);
}

function randomRange(lower: number, upper: number, floored: boolean = false): number {
    let res = Math.random()*(upper-lower) + lower;
    if (floored) res = Math.floor(res);
    return res;
}

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
        const safeZone = new Set<number>();

        if (markSafeStartTile) {
            // no bombs in 3x3 square around the safe tile
            for (let dx = 1; dx >= -1; dx--) 
                for (let dy = 1; dy >=-1; dy--) {
                    const nx = markSafeStartTile.x + dx;
                    const ny = markSafeStartTile.y + dy;
                    if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                        safeZone.add(ny*size+nx);
                    }
                }
        }

        // bombs in corners are a big source of 50/50 luck-based decisions
        // but, only make them guaranteed safe 80% of the time so people don't just
        // always go for the corners!

        if (Math.random() >= 0.8) {
            if (!safeZone.has(0)) safeZone.add(0); // top left
            if (!safeZone.has(size-1)) safeZone.add(size-1); // top right
            if (!safeZone.has((size-1)*size)) safeZone.add((size-1)*size); // bottom left
            if (!safeZone.has(size*size-1)) safeZone.add(size*size-1);
        }


        const indexes = [...Array(numMines).keys()].filter((i) => !safeZone.has(i));
        for (let i=0; i<mineCount; i++) {

            // grab random serialized index of the board we haven't touched yet
            // then convert to coordinates, then set as mine

            if (indexes.length === 0) break; // no more available spots means we break
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
    }
    
    return tiles;

}

function sizeToMines(size: number, difficulty: string): number {
    let mines = size*size;
    switch(difficulty){
        case 'Easy': {mines *= 0.11; break;}
        case 'Medium': {mines *= 0.16; break;}
        case 'Hard': {mines *= 0.21; break;}
        case 'Impossible': {mines *= 0.4; break;}
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
                if (!visitedSet.has(`${nx},${ny}`) && nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && !this.tiles[ny][nx].isFlagged) {
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

function gameStateReducer(state: GameState, 
    action: {type: 'dig', x: number, y: number} |
            {type: 'setFlag', x: number, y: number} |
            {type: 'removeFlag', x: number, y: number} |
            {type: 'restartGame', size: number, mineCount: number, difficulty: string}
) {

    let newState: GameState;
    if (action.type !== 'restartGame' && state.status == 'not_started') {
        let mineCount = sizeToMines(state.size, state.difficulty);
        newState = new GameState(newGameState(state.size, mineCount, {x: action.x, y: action.y}), 'not_started', state.difficulty);
    } else {
        newState = state.clone();
    }

    switch (action.type) {

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


export default function MinesweeperMain() {

    const MIN_SIZE = 5;
    const MAX_SIZE = 25;

    const [size, setSize] = useState(10);
    const [desiredSize, setDesiredSize] = useState(size);
    const [mineCount, setMineCount] = useState(11);
    const [difficulty, setDifficulty] = useState('Easy');
    const [tickReset, setTickReset] = useState(false);

    const [state, dispatch] = useReducer(gameStateReducer, new GameState(newGameState(desiredSize, mineCount) ,'not_started', difficulty));
    const vertView = isVertView();
    
    // calculate tile font size mulitplier
    const dim = useWindowDimensions();
    const fontMultiplier = 250/size * Math.min(dim.w, dim.h)/1000;

    useEffect(() => {
        if (RUN_TESTS) RunTests();
    }, []); 

    useEffect(() => {
        if (state.status == 'won') {
            confetti({
                particleCount: 100,
                angle: randomRange(30, 60),
                spread: 100,
                origin: {x: 0, y: 0.5},
                decay: 0.93,
                ticks: 150,
                scalar: 1.5
            });
            confetti({
                particleCount: 100,
                angle: randomRange(120, 150),
                spread: 100,
                origin: {x: 1, y: 0.5},
                decay: 0.93,
                ticks: 150,
                scalar: 1.5
            });
        }
    }, [state.status == 'won']);
      
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

    function statusText(): React.ReactNode {
        switch(state.status) {
            case 'lost':
                return <p className="status-text"  style={{color: "red"}}>You Lose!</p>;
            case 'won':
                // gets special id, because green isn't accessible in dark theme & lime isn't
                // accessible in light theme, so color needs to change based on theme preference
                return <p className="status-text" id="win-text">You Win!</p>;
            case 'not_started':
                return <p className="status-text" style={{color: "var(--color1)"}}>Click a tile to start</p>;
            case 'ongoing':
                return <p className="status-text" style={{color: "var(--color2)"}}>Good Luck!</p>;
        }
    }


    // JSX
    const interfaceJSX =     
    <div style={{width: vertView?"70%":"30%", minWidth:"400px", justifyItems: "center"}}>
    <button className="gradient-button google-sans-code" style={{width: "70%", alignSelf:"center", marginTop:"20px"}} 
        onClick={() => {
            const mines = sizeToMines(desiredSize, difficulty);
            setTickReset(!tickReset);
            setMineCount(mines);
            dispatch({type: 'restartGame', size: desiredSize, mineCount: mines, difficulty: difficulty});
            setSize(desiredSize);
        }}>RESET</button>
      {statusText()}
      <Stopwatch running={state.status == 'ongoing'} resetTick={tickReset} color={state.status == 'lost'?'red':state.status == 'won'?'lime':'white'}/>
      <span className="flex-center">
        <span className="flex-center" style={{flexDirection: "column", gap: "40px"}}>
            <span className="flex-center">
                <PiMouseLeftClick style={{fontSize:"2rem"}}/>
                <PiShovelFill style={{fontSize:"1.7rem", transform: "scale(1.2)"}}/>
            </span>
            <span className="flex-center">
                <PiMouseRightClick style={{fontSize:"2rem"}}/>
                <FaFlag style={{fontSize:"1.7rem"}}/>
            </span>
        </span>
        <span className="flex-center" style={{flexDirection: "column", gap: "40px"}}>
            <p style={{margin: "0px", justifySelf: "left"}}>Left Click to Dig</p>
            <p style={{margin: "0px", justifySelf: "left"}}>Right Click to Flag</p>
        </span>
      </span>

      <span style={{display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px", gap:"20px", width: "80%"}}>
        <span className="flex-center">
            <p style={{width:"30%", textAlign:"left"}}>Size:<br/>{desiredSize}x{desiredSize}</p>
            <input defaultValue={size} type="range" step="1" min={MIN_SIZE} max={MAX_SIZE} 
            style={{
                background: `
                linear-gradient(to right, 
                    color-mix(in hsl, 
                        var(--color1) ${(1-reverseLerp(desiredSize, MIN_SIZE, MAX_SIZE))*100}%,
                        var(--color2) ${reverseLerp(desiredSize, MIN_SIZE, MAX_SIZE)*100}%) 
                    ${reverseLerp(desiredSize, MIN_SIZE, MAX_SIZE)*96+3}%,
                    var(--bg1) ${reverseLerp(desiredSize, MIN_SIZE, MAX_SIZE)*96+3}%)`
            }}
            onChange={(e) => {
                const newSize = Number.parseInt(e.target.value);
                const mines = sizeToMines(newSize, difficulty);
                setDesiredSize(newSize);
                setMineCount(mines);
                if (state.status === 'not_started') {
                    dispatch({type: 'restartGame', size: newSize, mineCount: mines, difficulty: difficulty});                     
                    setSize(newSize);
                }
            }}/>
        </span>
        <span className="flex-center">
            <p style={{width:"30%", textAlign:"left"}}>Mines:<br/>{mineCount}</p>
            <select style={{width:"70%"}} name="difficulty" className="dropdown cascadia-code" onChange={(e) => {
                setDifficulty(e.target.value);
                const mines = sizeToMines(size, e.target.value)
                setMineCount(mines);
                if (state.status == 'not_started') {
                    dispatch({type: 'restartGame', size: size, mineCount: mines, difficulty: e.target.value});
                }
            }}>
                <option className="cascadia-code">Easy</option>
                <option className="cascadia-code">Medium</option>
                <option className="cascadia-code">Hard</option>
                <option className="cascadia-code">Impossible</option>
            </select>
        </span>
      </span>
    </div>;

    return (<div style={{
        display:"flex", 
        flexDirection: vertView?"column-reverse":"row",
        justifyContent: "center",
        alignItems: "center"
        }}>

        {interfaceJSX}
        <div className="minefield-container" onContextMenu={(e) => e.preventDefault()}
        style={{
            border: `5px solid ${state.status == 'won'? 'lime' : state.status == 'lost'? 'red' : 'var(--contrastColor)'}`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gap: `${fontMultiplier/5}px`
        }}>
            {[...Array(size**2)].map((_, i: number) => {
                return <Tile 
                key={i}
                tileFontSize={fontMultiplier}
                state={state} 
                coord={{x:i%size, y:Math.floor(i/size)}} 
                handleClick={handleTileClick}/>
            })}
        </div>

    </div>)
}

var RUN_TESTS = false;

function RunTests() {

    const state1 = new GameState(newGameState(3, 0), 'not_started', 'Easy');
    state1.setMines([[true, true, true],
                     [false, true, false], 
                     [true, false, true]]);

    assertTrue(state1.tiles[0][0].adjacentMines == 2, "tile x=0, y=0 has 2 adjacent mines");
    assertTrue(state1.tiles[1][1].adjacentMines == 5, "tile x=1, y=1 has 5 adjacent mines");
    assertTrue(state1.tiles[2][1].adjacentMines == 3, "tile x=1, y=2 has 3 adjacent mines");

    for (let i=0; i<10; i++) {
        const state2 = new GameState(newGameState(3, 8, {x:2, y:2}), 'not_started', 'Easy');
        assertTrue(state2.tiles[2][2].isMine == false,
                "tile marked as safe in otherwise filled minefield is safe");
    }

    const state2 = new GameState(newGameState(3, 0), 'not_started', 'Easy');
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

    assertTrue(reverseLerp(10, 10, 20) == 0, "lowest part of lerp is 0");
    assertTrue(reverseLerp(-10, 10, 20) == 0 && reverseLerp(25, 10, 20) == 1, "results are clamped between 0 and 1");
    assertTrue(reverseLerp(15, 10, 20) == 0.5, "middle of two values returns 0.5");

    console.log("ALL TESTS PASSED!");

}

function assertTrue(b: boolean, name: string) {
    if (!b) throw `TEST FAILED: ${name}`;
}
