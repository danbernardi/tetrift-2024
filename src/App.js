import { useState } from 'react';
import Game from './components/Game';
import Splash from './components/Splash';
import './styles/core.scss';

const App = () => {
  const [startGame, setStartGame] = useState(false);
  const [options, setOptions] = useState({
    style: 'classic',
    difficulty: 0,
    music: 'on'
  });

  const setOption = (newOption) => {
    const optionsObj = { ...options };
    setOptions(Object.assign(optionsObj, newOption));
  }

  return (
    <div className="app">
      { startGame
        ? (
          <Game
            options={ options }
            goToMainMenu={ () => setStartGame(false) }
          />
        ) : (
          <Splash
            activeOptions={ options }
            setOption={ setOption }
            onGameStart={ () => setStartGame(true) }
          />
        )
      }
    </div>
  );
}

export default App;
