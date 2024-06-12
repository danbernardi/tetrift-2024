import './Splash.scss';

const styles = ['classic', 'modern'];
const difficulties = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const musicOptions = ['on', 'off'];

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

      <footer className="footer">
        Crafted by <a href="http://www.redshiftdigital.com/" target="_blank" rel="noopener noreferrer">Redshift Digital, inc.</a>
      </footer>
    </div>
  );
}

export default Splash;
