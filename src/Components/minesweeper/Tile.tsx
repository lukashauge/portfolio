import { FaBomb, FaFlag } from "react-icons/fa6";
import { GameState } from "./MinesweeperMain";

export default function Tile(props: 
  {coord:{x: number, y:number},
  state: GameState,
  handleClick: (x:number, y:number, type: string) => void}
) {
  
  // TODO
  const {state, coord, handleClick} = props;
  const tile = state.tiles[coord.y][coord.x];
  const gameIsOver = state.status == 'lost' || state.status == 'won';

  return (
    <div className={`minefield-tile ${!tile.isRevealed && !tile.isFlagged && !gameIsOver ? "hover-changes-color": ''}`}
    style={{
      userSelect: 'none',
      background: tile.isRevealed ? "var(--bg1)" : "rgba(93, 89, 138, 0.459)"
    }}

    onClick={(e) => {e.preventDefault(); handleClick(coord.x, coord.y, 'dig')}}
    onContextMenu={(e) => {e.preventDefault(); handleClick(coord.x, coord.y, tile.isFlagged?'removeFlag':'setFlag')}}>
      {tile.isRevealed ? 
      (tile.isMine ? <FaBomb style={{color: "var(--color2)"}}/> : (tile.adjacentMines == 0 ? <></> : <p className="minefield-number">{tile.adjacentMines}</p>)) :
      (tile.isFlagged ? <FaFlag style={{color: state.status == 'lost' ? 'red' : state.status == 'won' ? 'lime' : "var(--color1)"}}/> : <></>)}

    </div>
  )

}
