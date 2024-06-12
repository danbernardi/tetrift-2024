import {
  calculatePieceCoordinates,
  boardDimensions,
} from '../utils/gameUtils';

import { pieceColors } from '../utils/tetrominoShapes';

/**
   * Generates a renderable board
   * @param  {Array} board     Associative array representing the game board
   * @param  {Array} piece     Associative array representing the piece
   * @param  {object} piecePos x and y coordiates for piece origin [0, 0]
   * @param  {object} options  Defines user selected options
   * @return {object}          JSX representation of the board
   */
const GameBoard = ({ board, piece, piecePos, currentShape, options }) => {
  const pieceCoordinates = piece ? calculatePieceCoordinates(currentShape, piecePos) : {};
  const { x, y } = boardDimensions;
  const height = window.innerHeight / (y + 4);


  const squares = board.map((row, rowIdx) => row.map((square, index) => {
    let fillClass = 'empty';
    if (square) {
      fillClass = `filled ${pieceColors[square]}`;
    }

    if (pieceCoordinates[[index, rowIdx]]) fillClass = `filled ${piece}`;

    return (
      <div key={ index } style={ { height, width: height } } className={ `block ${fillClass}` }>
        { options.style === '3d' && fillClass.split(' ')[0] === 'filled' &&
          <div>
            <div className="front" />
            <div className="back" />
            <div className="right" />
            <div className="left" />
            <div className="top" />
            <div className="bottom" />
          </div>
        }
      </div>
    );
  }));

  return (
    <div style={ { width: height * x, height: height * y } } className="board cf">
      <div className="cf" style={ { marginLeft: `-${height}px`, width: height * (x + 2) } }>
        { squares }
      </div>
    </div>
  );
}

export default GameBoard;
