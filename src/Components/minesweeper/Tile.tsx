import { FaBomb, FaFlag } from "react-icons/fa6";
import { GameState } from "./MinesweeperMain";
import { memo } from "react";

function Tile(props: 
  {coord:{x: number, y:number},
  state: GameState,
  tileFontSize: number,
  handleClick: (x:number, y:number, type: string) => void}
) {
  
  // TODO
  const {state, tileFontSize, coord, handleClick} = props;
  const tile = state.tiles[coord.y][coord.x];
  const gameIsOver = state.status == 'lost' || state.status == 'won';

  return (
    <div className={`minefield-tile ${!tile.isRevealed && !tile.isFlagged && !gameIsOver ? "hover-changes-color": ''}`}
    style={{
      userSelect: 'none',
      position: 'relative',
      background: tile.isRevealed ? "var(--bg1)" : (state.status == 'won' && tile.isMine && !tile.isFlagged) ? "var(--bg1)" : "rgba(93, 89, 138, 0.37)"
    }}

    onClick={(e) => {e.preventDefault(); handleClick(coord.x, coord.y, 'dig')}}
    onContextMenu={(e) => {e.preventDefault(); handleClick(coord.x, coord.y, tile.isFlagged?'removeFlag':'setFlag')}}>
      {tile.isRevealed ? 
      
      (tile.isMine ? <FaBomb style={{color: "var(--color2)", fontSize: tileFontSize, position: "absolute", inset:"30%"}}/> : 
        (tile.adjacentMines == 0 ? <></> : <p className="minefield-number" style={{fontSize: tileFontSize}}>{tile.adjacentMines}</p>)) :
      
      (tile.isFlagged ? <FaFlag style={{color: state.status == 'lost' ? 'red' :
          state.status == 'won' ? 'lime' : "var(--color1)", fontSize: tileFontSize, position: "absolute", inset:"30%"}}/> : 
        state.status == 'won' && tile.isMine? <FaBomb style={{color: "var(--color1)", fontSize: tileFontSize, position: "absolute", inset:"30%"}}/> : <></>)}

    </div>
  )

}

export default memo(Tile);