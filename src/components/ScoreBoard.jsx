import { useState } from 'react';
import HighScoreList from './HighScoreList';
import HighScoreForm from './HighScoreForm';
import './ScoreBoard.scss';

const ScoreBoard = ({ score, onRestart, onMainMenu, isWinner }) => {
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [userTimestamp, setUserTimestamp] = useState(null);

  return (
    <div className="loser">
      <h2 className="title">{isWinner ? 'You win' :'Nice try, buddy' }</h2>
      <p style={ { marginBottom: '4rem' } }>Your score was <em>{ score }</em></p>

      { scoreSubmitted
        ? <div className="leaderboard__footer">
          <HighScoreList userTimestamp={ userTimestamp } />
          <span className="btn" onClick={ onRestart }>Play again</span>
          <span className="btn" onClick={ onMainMenu }>Main menu</span>
        </div>
        : <HighScoreForm
          score={ score }
          callback={ (date) => {
            setScoreSubmitted(true);
            setUserTimestamp(date)
           } }
           onRestart={onRestart}
        />
      }

      <div className="audio">
        <audio autoPlay={ true }>
          <source src={ require('../assets/music/gameover.mp3') } type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};

export default ScoreBoard;
