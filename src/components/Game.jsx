import { useState, useEffect } from 'react';

import ScoreBoard from './ScoreBoard';
import GameBoard from './GameBoard';
import Tetromino from './Tetromino';

import {
  generateGameBoard,
  checkRowForCompletion,
  removeBoardRow,
  calculateLevel,
  generateRandomPiece,
  generateBoardRow,
  caclulateTurnScore,
  calculateLevelSpeed,
  rotatePiece,
  calculatePieceCoordinates,
  boardDimensions,
  pieces,
  levelThemes,
} from '../utils/gameUtils';
import { tetrominoShapeNames } from '../utils/tetrominoShapes';
import { useFrameLoop } from '../utils/useFrameLoop';
import './Game.scss';

let currentPieceConfig = generateRandomPiece(pieces);
let pieceQueue = new Array(5).fill(null).map(() => generateRandomPiece(pieces));
let boardArr = generateGameBoard(boardDimensions);
let completedLines = 0;
let flash = false;
let currentScore = 0;
let paused = false;

function Game ({ options, goToMainMenu }) {
  const [currentTime, setCurrentTime] = useState(0);

  const [showScoreboard, setShowScoreboard] = useState();
  const [level, setLevel] = useState(options.difficulty);
  const [gameSpeed, setGameSpeed] = useState(calculateLevelSpeed(options?.difficulty));
  const [isWinner, setIsWinner] = useState(false);

  const [time, setTime] = useState(0);
  const { startLoop, stopLoop } = useFrameLoop((time) => {setTime(time)});


  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  /*****************************
  * Game Loop Functions
  *****************************/
  // const togglePause = () => {
  //   paused = !paused
  //   const updatePause = paused ? stopLoop : startLoop;
  //   updatePause();
  // }

  const gameLost = () => {
    return boardArr[0].reduce((a, b) => a + b) > 2;
  }

  const endGame = () => {
    stopLoop();
    if (currentScore >= 10000) {
      setIsWinner(true)
    }

    setShowScoreboard(true);
  }

  const restartGame = () => {
    const initialPieceState = generateRandomPiece(pieces);
    pieceQueue = new Array(5).fill(null).map(() => generateRandomPiece(pieces));
    currentPieceConfig = initialPieceState;
    boardArr = generateGameBoard(boardDimensions);
    currentScore = 0;
    completedLines = 0;
    setLevel(0);
    setGameSpeed(50);
    startLoop();
    setIsWinner(false);
    setShowScoreboard(false);
  }

  useEffect(() => {
    if (currentTime % gameSpeed === 0) fallDown();
    setCurrentTime(currentTime + 1);
  }, [time, gameSpeed]);

  /**
   * Updates to next level
   * @param  {Nubmer} level Level number
   */
  const triggerLevelChange = (newLevel) => {
    setLevel(newLevel);
    setGameSpeed(calculateLevelSpeed(newLevel));

    flash = true;
    const flashTimeout = setTimeout(() => {
      flash = false;
    }, 1000);

    clearTimeout(flashTimeout);
  }

  const move = (dir) => {
    const newPos = { x: currentPieceConfig.piecePos.x + dir.x, y: currentPieceConfig.piecePos.y + dir.y };
    if (noCollision(newPos)) {
      updatePieceState({ piecePos: newPos });
    }
  }

  const canMove = (dir) => {
    const newPos = { x: currentPieceConfig.piecePos.x + dir.x, y: currentPieceConfig.piecePos.y + dir.y };
    if (noCollision(newPos)) {
      return true;
    }

    return false;
  }

  const fallDown = () => {
    if (canMove({ x: 0, y: 1 })) {
      move({ x: 0, y: 1 });
    } else {
      killPiece();
    }
  }

  const handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 37: // left
        move({ x: -1, y: 0 });
        break;
      case 38: // up
        handleRotation('left');
        break;
      case 39: // right
        move({ x: 1, y: 0 });
        break;
      case 40: // down
        fallDown();
        break;
      default:
        break;
    }
  }

  const noCollision = (newPos, shape) => {
    const { currentShape } = currentPieceConfig;
    let pieceCoordinates = calculatePieceCoordinates(shape || currentShape, newPos, true);
    const collisions = pieceCoordinates.filter((piece) => boardArr[piece.y][piece.x] !== 0).length;

    return collisions === 0;
  }

  const assessNextTurn = () => {
    if (gameLost()) {
      endGame();
    } else {
      addNewPiece();
    }
  }

  /**
   * Freezes a piece at the bottom or when bottom collision occurs
   */
  const killPiece = () => {
    const { currentShape, piece, piecePos } = currentPieceConfig;
    let pieceCoordinates = calculatePieceCoordinates(currentShape, piecePos, true);

    pieceCoordinates.forEach((thisPiece) => {
      boardArr[thisPiece.y][thisPiece.x] = tetrominoShapeNames.indexOf(piece) + 2;
    });

    let lineCount = 0;
    let rowsToRemove = [];

    // Check for completed lines
    boardArr.forEach((row, index) => {
      if (checkRowForCompletion(row) && index < boardArr.length - 1) {
        completedLines++;
        lineCount ++;
        rowsToRemove.push(index);
      }
    });

    // Update score if line complete
    if (lineCount) {
      removeRowsWithAnimation(rowsToRemove);
      const newScore = currentScore + caclulateTurnScore(level, lineCount);
      currentScore = newScore;
    }

    const thisLevel = calculateLevel(completedLines);

    if (level !== thisLevel && thisLevel > level) {
      triggerLevelChange(thisLevel);
    }

    assessNextTurn();
  }

  const removeRowsWithAnimation = (rowIndexes = []) => {
    rowIndexes.forEach((rowIndex) => {
      const row = generateBoardRow(boardDimensions.x + 2, -1);
      boardArr[rowIndex] = row;

      setTimeout(() => {
        boardArr = removeBoardRow(boardArr, rowIndex);
      }, 75);
    });
  }

  /**
   * Adds a new piece at the origin
   */
  const addNewPiece = () => {
    const newPiece = pieceQueue.pop();
    pieceQueue.unshift(generateRandomPiece(pieces));
    newPiece.piecePos = { x: 3, y: 0 };
    updatePieceState(newPiece);
  }

  /**
   * Updates the component state dyanimcally based on arbitrary state properties
   * @param  {Object} newState Object mapping to updated properties in state
   */
  const updatePieceState = (newState = {}) => {
    currentPieceConfig = Object.assign({}, currentPieceConfig, newState);
  }

  /**
   * Rotate the active piece left or right
   * @param  {String} direction Direction of 'left' or 'right'
   */
  const handleRotation = (direction) => {
    const { currentPosition, piece, piecePos } = currentPieceConfig;
    const pieceConfig = rotatePiece(direction, currentPosition, piece);
    if (noCollision(piecePos, pieceConfig.currentShape)) updatePieceState(pieceConfig);
  }

  return (
    <div className={ `game cf ${levelThemes[level]} style--${options.style}` }>
      <div className="header">
        <div className="timer">
          <span style={ { margin: '10px 20px' } }>Score: { currentScore }</span>
        </div>
      </div>

      <div className="main">
        <div className="status">
          <span>Lines { completedLines }</span>
          <span>Level { level + 1 }</span>
        </div>
        <GameBoard
          board={boardArr}
          piece={currentPieceConfig.piece}
          piecePos={currentPieceConfig.piecePos}
          currentShape={currentPieceConfig.currentShape}
          options={options}
        />

        { flash ?
          <div className="flash-bang" />
          : null
        }
        { flash && <div className="flash-bang" /> }

        <div className="queue">
          <h5>Next</h5>
          <div className="queue__piece">
            <Tetromino
              dimensions={ boardDimensions }
              fillClass={ `filled ${pieceQueue[pieceQueue.length - 1].piece}` }
              shape={ pieceQueue[pieceQueue.length - 1].currentShape }
            />
          </div>
        </div>
      </div>

      { showScoreboard &&
        <ScoreBoard
          isWinner={isWinner}
          score={ currentScore }
          onRestart={restartGame}
          onMainMenu={ () => {
            restartGame();
            goToMainMenu(this);
          } }
        />
      }

      { options.music !== 'off' &&
        <div className="audio">
          <audio autoPlay={ true } controls={ true } loop={ true }>
            <source src={ require(`../assets/music/tetris-gameboy-0${options.music}.mp3`) } type="audio/mpeg" />
          </audio>
        </div>
      }
    </div>
  );
}

export default Game;
