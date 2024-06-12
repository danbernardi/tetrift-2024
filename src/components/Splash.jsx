import './Splash.scss';

const styles = ['classic', 'modern'];
const difficulties = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const musicOptions = [1, 2, 3, 4, 5, 'off'];

const Splash = ({ onGameStart, setOption, activeOptions }) => {
  return (
    <div className="splash">
      <div>
        <h1 className="title">Tetrift</h1>

        <h3 className="header">Select style</h3>
        <ul className="options">
          { styles.map((style, index) => (
            <li
              className={ activeOptions.style === style ? 'selected' : '' }
              key={ index }
              onClick={ () => setOption({ style }) }
            >
              { style }
            </li>
          )) }
        </ul>

        <h3 className="header">Select level</h3>
        <ul className="options">
          { difficulties.map((difficulty, index) => (
            <li
              className={ activeOptions.difficulty === difficulty - 1 ? 'selected' : '' }
              key={ index }
              onClick={ () => setOption({ difficulty: difficulty - 1 }) }
            >
              { difficulty }
            </li>
          )) }
        </ul>

        <h3 className="header">Music</h3>
        <ul className="options">
          { musicOptions.map((value, index) => (
            <li
              className={ activeOptions.music === value ? 'selected' : '' }
              key={ index }
              onClick={ () => setOption({ music: value }) }
            >
              { value }
            </li>
          )) }
        </ul>

        <span
          className="btn"
          onClick={ () => onGameStart() }
        >Start game</span>
      </div>

      <div className="audio">
        { activeOptions.music === 1 &&
          <audio autoPlay={ true } controls={ true } loop={ true }>
            <source src={ require('../assets/music/tetris-gameboy-02.mp3') } type="audio/mpeg" />
          </audio>
        }

        { activeOptions.music === 2 &&
          <audio autoPlay={ true } controls={ true } loop={ true }>
            <source src={ require('../assets/music/tetris-gameboy-01.mp3') } type="audio/mpeg" />
          </audio>
        }

        { activeOptions.music === 3 &&
          <audio autoPlay={ true } controls={ true } loop={ true }>
            <source src={ require('../assets/music/tetris-gameboy-03.mp3') } type="audio/mpeg" />
          </audio>
        }

        { activeOptions.music === 4 &&
          <audio autoPlay={ true } controls={ true } loop={ true }>
            <source src={ require('../assets/music/tetris-gameboy-04.mp3') } type="audio/mpeg" />
          </audio>
        }

        { activeOptions.music === 5 &&
          <audio autoPlay={ true } controls={ true } loop={ true }>
            <source src={ require('../assets/music/tetris-gameboy-05.mp3') } type="audio/mpeg" />
          </audio>
        }
      </div>

      <footer className="footer">
        Crafted by <a href="http://www.redshiftdigital.com/" target="_blank" rel="noopener noreferrer">Redshift Digital, inc.</a>
      </footer>
    </div>
  );
}

export default Splash;
