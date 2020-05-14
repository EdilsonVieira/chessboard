// Main file

function getClass(props) {
    const c = props.piece;
    if (props.squareColor === 1) {
      return (c === c.toUpperCase() ? "square white_white" : "square white_black");
    } else {
      return (c === c.toLowerCase() ? "square black_black" : "square black_white");
    }
}

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squareColor: null,
      piece: null,
    };
  }  
  render() {
    const class_name = getClass(this.props);
    return (
      <button className={class_name} onClick={() => alert('click')}>
        {this.props.piece.toUpperCase()}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [
                [{sc:0,pc:'R'},{sc:1,pc:'P'},
                 {sc:0,pc:' '},{sc:1,pc:' '},{sc:0,pc:' '},{sc:1,pc:' '},
                 {sc:0,pc:'p'},{sc:1,pc:'r'}],
                [{sc:1,pc:'N'},{sc:0,pc:'P'},
                 {sc:1,pc:' '},{sc:0,pc:' '},{sc:1,pc:' '},{sc:0,pc:' '},
                 {sc:1,pc:'p'},{sc:0,pc:'n'}],
                [{sc:0,pc:'L'},{sc:1,pc:'P'},
                 {sc:0,pc:' '},{sc:1,pc:' '},{sc:0,pc:' '},{sc:1,pc:' '},
                 {sc:0,pc:'p'},{sc:1,pc:'l'}],
                [{sc:1,pc:'Q'},{sc:0,pc:'P'},
                 {sc:1,pc:' '},{sc:0,pc:' '},{sc:1,pc:' '},{sc:0,pc:' '},
                 {sc:1,pc:'p'},{sc:0,pc:'q'}],
                [{sc:0,pc:'K'},{sc:1,pc:'P'},
                 {sc:0,pc:' '},{sc:1,pc:' '},{sc:0,pc:' '},{sc:1,pc:' '},
                 {sc:0,pc:'p'},{sc:1,pc:'k'}],
                [{sc:1,pc:'L'},{sc:0,pc:'P'},
                 {sc:1,pc:' '},{sc:0,pc:' '},{sc:1,pc:' '},{sc:0,pc:' '},
                 {sc:1,pc:'p'},{sc:0,pc:'l'}],
                [{sc:0,pc:'N'},{sc:1,pc:'P'},
                 {sc:0,pc:' '},{sc:1,pc:' '},{sc:0,pc:' '},{sc:1,pc:' '},
                 {sc:0,pc:'p'},{sc:1,pc:'n'}],
                [{sc:1,pc:'R'},{sc:0,pc:'P'},
                 {sc:1,pc:' '},{sc:0,pc:' '},{sc:1,pc:' '},{sc:0,pc:' '},
                 {sc:1,pc:'p'},{sc:0,pc:'r'}],
               ],
        stepNumber: 0,
        whiteIsNext: true,
    };
  }
  renderSquare(sc,pc) {
    return <Square squareColor={sc} piece={pc} />;
  }
  render() {
    const status = 'Next player: white';

    return (
      <div className="game">
        <div className="status">{status}</div>
        <div className="status">
          <button className="tooltip">&#10226; 
            <span className="tooltiptext">Click to rotate pieces.</span>
          </button>
        </div>
        <div className="board-row">
          {this.renderSquare(0,'R')}
          {this.renderSquare(1,'P')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,'p')}
          {this.renderSquare(1,'r')}
        </div>
        <div className="board-row">
          {this.renderSquare(1,'N')}
          {this.renderSquare(0,'P')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,'p')}
          {this.renderSquare(0,'n')}
        </div>
        <div className="board-row">
          {this.renderSquare(0,'L')}
          {this.renderSquare(1,'P')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,'p')}
          {this.renderSquare(1,'l')}
        </div>
        <div className="board-row">
          {this.renderSquare(1,'Q')}
          {this.renderSquare(0,'P')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,'p')}
          {this.renderSquare(0,'q')}
        </div>
        <div className="board-row">
          {this.renderSquare(0,'K')}
          {this.renderSquare(1,'P')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,'p')}
          {this.renderSquare(1,'k')}
        </div>
        <div className="board-row">
          {this.renderSquare(1,'L')}
          {this.renderSquare(0,'P')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,'p')}
          {this.renderSquare(0,'l')}
        </div>
        <div className="board-row">
          {this.renderSquare(0,'N')}
          {this.renderSquare(1,'P')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,'p')}
          {this.renderSquare(1,'n')}
        </div>
        <div className="board-row">
          {this.renderSquare(1,'R')}
          {this.renderSquare(0,'P')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,' ')}
          {this.renderSquare(0,' ')}
          {this.renderSquare(1,'p')}
          {this.renderSquare(0,'r')}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
