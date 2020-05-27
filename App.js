const LIGHT = 0;
const DARK = 1;

const PAWN = 0;
const KNIGHT = 1;
const BISHOP = 2;
const ROOK = 3;
const QUEEN = 4;
const KING = 5;

const piece_char = ['P','N','L','R','Q','K','p','n','l','r','q','k'];

const init_piece = [
	3, 1, 2, 4, 5, 2, 1, 3,
	0, 0, 0, 0, 0, 0, 0, 0,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	0, 0, 0, 0, 0, 0, 0, 0,
	3, 1, 2, 4, 5, 2, 1, 3
];

const init_color = [
	1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	6, 6, 6, 6, 6, 6, 6, 6,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0
];

function row(x) {
  return (x >> 3);
}

function col(x) {
  return (x & 7);
}

function Square(props) {
  let class_name = 'square ';
  class_name += (squareIsWhite(props.row, props.col) ? " white_square" : " black_square");
  class_name += (props.piece === props.piece.toUpperCase() ? " white_piece" : " black_piece");
  class_name += (props.highlight ? " highlight" : "");  
  class_name += (props.whiteIsNext ? " " : " rotate");  
  return (
    <button className={class_name} onClick={props.onClick}>
      {props.piece.toUpperCase()}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i,j,pc) {
    const highlight = ((this.props.rowColumnFrom.length) 
                       && (this.props.rowColumnFrom[0]==i) 
                       && (this.props.rowColumnFrom[1]==j));
    return <Square piece={pc} 
             onClick={() => this.props.onClick(i,j)}
             highlight={highlight}
             row={i} col={j}
             whiteIsNext={this.props.whiteIsNext}
             />;
  }
  renderRow(i) {
    var iSquares = this.props.squares[i];
    return (
      <>
        {this.renderSquare(i,0,iSquares[0])}
        {this.renderSquare(i,1,iSquares[1])}
        {this.renderSquare(i,2,iSquares[2])}
        {this.renderSquare(i,3,iSquares[3])}
        {this.renderSquare(i,4,iSquares[4])}
        {this.renderSquare(i,5,iSquares[5])}
        {this.renderSquare(i,6,iSquares[6])}
        {this.renderSquare(i,7,iSquares[7])}
      </>
    );
  }
  render() {
    const rowList = this.props.squares.map((row, index) =>
                                <div key={index} className="board-row">
                                  {this.renderRow(index)}
                                </div>
    );
    return (
      <div className="game">
        <>{rowList}</>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: [
                  ['r','n','l','q','k','l','n','r'],
                  ['p','p','p','p','p','p','p','p'],
                  [' ',' ',' ',' ',' ',' ',' ',' '],
                  [' ',' ',' ',' ',' ',' ',' ',' '],
                  [' ',' ',' ',' ',' ',' ',' ',' '],
                  [' ',' ',' ',' ',' ',' ',' ',' '],
                  ['P','P','P','P','P','P','P','P'],
                  ['R','N','L','Q','K','L','N','R'],
                 ],
      }],    
      stepNumber: 0,
      whiteIsNext: true,
      whiteOrientation: 0,
      blackOrientation: 1,
      rowColumnFrom: [],
      reverseHistory: true,
    };
  }
  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const c = current.squares[i][j];
    if (this.state.rowColumnFrom.length === 0) {
      // Enforce occupied square and turn
      if ((c != ' ') && 
        ((this.state.whiteIsNext && c === c.toUpperCase())
         || (!this.state.whiteIsNext && c === c.toLowerCase()))) {
        // Remember touched piece
        this.setState({rowColumnFrom: [i,j]});
      };
    } else {
        const rowFrom = this.state.rowColumnFrom[0];
        const columnFrom = this.state.rowColumnFrom[1];
        if ((i == rowFrom) && (j == columnFrom)) {
          // Give up the move! Let's permit it!
          this.setState({
            rowColumnFrom: [],
          });        
        } else {
          if (moveIsLegal(current.squares[rowFrom][columnFrom], 
                          current.squares[i][j])) {
            // Deep copy current board state
            const squares = JSON.parse(JSON.stringify(current.squares)); 
            // Move the piece
            squares[i][j] = squares[rowFrom][columnFrom];
            squares[rowFrom][columnFrom] = ' ';
            // Mantain history, enter if again, set step number and set new turn
            this.setState({
              history: history.concat([{
                      squares: squares,
                    }]),
              rowColumnFrom: [],
              stepNumber: history.length,
              whiteIsNext: !this.state.whiteIsNext,
            });
          };
        };
    };
  } 
  toggleOrder() {
    this.setState({
      reverseHistory: !this.state.reverseHistory,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      whiteIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = ('Go #' + move.toString().padStart(2,'0')) ;      
      return (
        <li key={move}>
          <button 
            className={this.state.stepNumber === move ? 
              'panel-button mono-font bold' : 'panel-button mono-font'}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });    

    if (this.state.reverseHistory) {moves.reverse()};    
    
    const status = 'Next player: ' + (this.state.whiteIsNext?'white':'black');

    return (
      <div className="game">
        <div className="status rotate">{status}</div>
        <div className="game-board">
          <div className="panel black">
            black panel
            <div>
              <button className="panel-button" 
                onClick={() => this.toggleOrder()}>
                &#9650;&#9660;
              </button>
            </div>
            <ol reversed={this.state.reverseHistory}>{moves}</ol>
          </div>
          <Board
            squares={current.squares}
            onClick={(i,j) => this.handleClick(i,j)}
            rowColumnFrom={this.state.rowColumnFrom}
            whiteIsNext={this.state.whiteIsNext}
            />
          <div className="panel white">
            <span>white panel</span>
            <div>
              <button className="panel-button" 
                onClick={() => this.toggleOrder()}>
                &#9650;&#9660;
              </button>
            </div>
            <ol reversed={this.state.reverseHistory}>{moves}</ol>
          </div>
        </div>
        <div className="status">{status}</div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function moveIsLegal(from, to) {
  const p1 = from;
  const p2 = to;
  // Let's  prevent friend fire!
  if ((p2 != ' ') && ((p1 == p1.toUpperCase() && p2 == p2.toUpperCase())
    || (p1 == p1.toLowerCase() && p2 == p2.toLowerCase()))) {
    return false;
  };
  return true;
};

function squareIsWhite(row, col) {
  return (((row % 2 == 0) && (col % 2 == 0)) || ((row % 2 != 0) && (col % 2 != 0)));
};


