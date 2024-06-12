import { useState, useEffect } from 'react';
import { getOrdinalSuffix } from '../utils/utils';
import './Leaderboard.scss';

const getScores = () => {
  return JSON.parse(localStorage.getItem('highscores') || '[]');
};

const HighScoreList = ({ userTimestamp }) => {
  const scores = getScores().sort((a, b) => b.score - a.score);

  const topTen = scores.slice(0, 10);
  const notTopTen = topTen.filter(score => score.date === userTimestamp).length <= 0;

  const user = {};
  if (notTopTen) {
    user.data = scores.find(score => score.date === userTimestamp);
    user.placement = scores.findIndex(score => score.date === userTimestamp) + 1;
  }

  return (
    <div className="leaderboard">
      <h3 className="title">Leaderboard top ten</h3>

      <ul className="leaderbord__list">
        { topTen.map((score, index) => (
          <li key={ index } className={ userTimestamp === score.date ? 'is-user' : '' }>
            <span className="placement">{ `${index + 1}${getOrdinalSuffix(index + 1)}` }</span>
            <span className="name">{score.name}</span>
            <span className="score">{score.score}</span>
          </li>
        )) }

        { notTopTen && user.data &&
          <li className="is-user not-top-ten">
            <span className="placement">{ `${user.placement}${getOrdinalSuffix(user.placement)}` }</span>
            <span className="name">{user.data.name}</span>
            <span className="score">{user.data.score}</span>
          </li>
        }
      </ul>
    </div>
  );
}

export default HighScoreList;
