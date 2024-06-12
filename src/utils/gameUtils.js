import {
  line,
  square,
  lShape,
  jShape,
  tShape,
  zShape,
  sShape,
} from './tetrominoShapes';
import { getRandomInt } from './utils';

/*****************************
* Game Board Setup
*****************************/

export const boardDimensions = { x: 10, y: 20 };

export const pieces = {
  line,
  square,
  lShape,
  jShape,
  tShape,
  zShape,
  sShape
};

export function generateBoardRow (width, fill = 0) {
  const row = new Array(width).fill(fill);
  row[0] = 1;
  row[row.length - 1] = 1;
  return row;
}

/**
 * Creates an empty game board
 * @return {Array} Returns associative array as the game board
 */
export function generateGameBoard (dimensions) {
  const { x, y } = dimensions;

  const wrapper = new Array(y + 1).fill([]);
  const board = wrapper.map((val, index) => {
    const row = generateBoardRow(x + 2);
    if (index === wrapper.length - 1) {
      row.fill(1);
    }
    return row;
  });

  return board;
}

/**
 * Checks if a row is complete.  Returns true if complete
 * @param  {Array} row A board row
 * @return {Boolean}     Returns True if complete False if not
 */
export function checkRowForCompletion (row) {
  return row.filter((square) => square === 0).length === 0;
}

/**
 * Removes a row from the board and adds new row to top
 * @param  {Array} board    A game board array
 * @param  {number} rowIndex Index of row to be deleted
 * @return {Array}          A copy and updated version of the game board.
 */
export function removeBoardRow (board, rowIndex) {
  const boardCopy = [].concat(board);
  boardCopy.splice(rowIndex, 1);
  boardCopy.unshift(generateBoardRow(board[0].length));
  return boardCopy;
}

/*****************************
* Tetronimo Setup
*****************************/
/**
 * Creates a tetromino piece data structure
 * @param  {Array} activeSquares An array of four tuples that define the filled squares
 * @return {Array}               A tetromino data structure (associative array)
 */
export function generatePiece (activeSquares) {
  const pieceGrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  activeSquares.forEach((coord) => {
    const row = coord[0];
    const column = coord[1];
    pieceGrid[row][column] = 1;
  });

  return pieceGrid;
}

/**
 * Creates the values for creating a randomly selected Tetromino
 * @param  {Object} shapes Object of Tetrominos
 * @return {Object}        State values for creating a piece
 */
export function generateRandomPiece (shapes) {
  const pieceList = Object.keys(shapes);
  const piece = pieceList[getRandomInt(0, pieceList.length)];
  const rotation = getRandomInt(0, shapes[piece].length);
  const currentShape = generatePiece(shapes[piece][rotation]);
  
  return {
    piece,
    rotation,
    currentPosition: rotation,
    currentShape,
    piecePos: { x: 5, y: 0 }
  };
}

/*****************************
* Score Calculation
*****************************/
export function caclulateTurnScore (level, completedLines) {
  const multiplier = [40, 100, 300, 1200];
  return (level + 1) * multiplier[completedLines - 1];
}

/**
   * Caclulates the level speed from level number
   * @param  {Number} levelNumber Level number
   * @return {Number}             Game speed
   */
export const calculateLevelSpeed = (levelNumber) => {
  const levelSpeed = 50 - (levelNumber * 5);
  return levelSpeed >= 1 ? levelSpeed : 1;
}

/**
   * Rotates a piece to the next position, either left or right
   * @param  {String} direction       A rotation direction, either 'right' or 'left'
   * @param  {Number} currentPosition The current rotation index
    * @param {string} piece           Name of current piece
   * @return {Object}                 Returns an object with the relative rotation and the cumulative position, both for udating state
   */
export const rotatePiece = (direction, currentPosition, piece) => {
  const nextPosition = direction === 'right' ? currentPosition + 1 : currentPosition - 1 ;

  return {
    currentPosition: nextPosition,
    rotation: Math.abs(nextPosition) % 4,
    currentShape: generatePiece(pieces[piece][Math.abs(nextPosition) % 4])
  };
}

export const calculatePieceCoordinates = (shape, origin = { x: -1, y: -3 }, array = false) => {
  const coordinates = array ? [] : {};

  shape.forEach((row, yIndex) => {
    row.forEach((square, xIndex) => {
      if (square === 1) {
        if (array)
          coordinates.push({ x: xIndex + origin.x, y: yIndex + origin.y });
        else
          coordinates[[xIndex + origin.x, yIndex + origin.y]] = 1;
      }
    });
  });


  return coordinates;
}

/**
   * Calculates the current level from completed lines
   * @param  {Number} linesCleared Number of cleared lines
   * @return {Number}              Level number
   */
export const calculateLevel = (linesCleared) => {
  let level = 0;

  if (linesCleared <= 90) {
    level = Math.floor(linesCleared / 7);
  } else {
    level = Math.floor((linesCleared - 90) / 20) + 9;
  }
  return level;
}

export const levelThemes = [
  'sherbert',
  'motherland',
  'coldfront',
  'desert',
  'princess',
  'chocolate',
  'dinosaur',
  'meat',
  'rocketship',
  'volcano'
];
