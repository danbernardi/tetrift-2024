import React from 'react';
import { useState } from 'react';

const HighScoreForm = ({ score, callback, onRestart }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setName(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (name.length > 0) {
      const date = new Date().getTime();
      const currentScores = JSON.parse(localStorage?.getItem('highscores') || '[]');
      currentScores.push({ name, score, date });
      localStorage.setItem('highscores', JSON.stringify(currentScores));
      callback(date);
    } else {
      setError('Please type in your name');
    }
  }

  return (
    <form style={ { maxWidth: '40rem' } } onSubmit={ handleSubmit }>
      <input placeholder="Enter your name" type="text" value={ name } onChange={ handleChange } />

      <div className="submit__wrapper">
        <button className="btn" type="submit">
          Submit score
        </button>
        { error && <p className="error">{ error }</p> }
      </div>

      <span className="btn btn--secondary mt5" onClick={ () => callback(undefined) }>Skip to leaderboard</span>
      <span className="btn btn--secondary mt0" onClick={onRestart}>Play again</span>
    </form>
  );
}

export default HighScoreForm;
