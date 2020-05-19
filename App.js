// Main file

function Square(props) {
  let class_name = 'square ';
  if (squareIsWhite(props.row, props.col)) {
    class_name += (props.piece === props.piece.toUpperCase() ? "w_w" : "w_b");
  } else {
    class_name += (props.piece === props.piece.toLowerCase() ? "b_b" : "b_w");
  }
  if (props.highlight) {class_name += ' highlight'};
  return (
    <button className={class_name} onClick={props.onClick}>
      {props.piece.toUpperCase()}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i,j,sc,pc) {
    const highlight = ((this.props.rowColumnFrom.length) 
                       && (this.props.rowColumnFrom[0]==i) 
                       && (this.props.rowColumnFrom[1]==j));
    return <Square piece={pc} 
             onClick={() => this.props.onClick(i,j)}
             highlight={highlight}
             row={i} col={j}
             />;
  }
  renderRow(i) {
    var iSquares = this.props.squares[i];
    return (
      <>
        {this.renderSquare(i,0,iSquares[0][0],iSquares[0][1])}
        {this.renderSquare(i,1,iSquares[1][0],iSquares[1][1])}
        {this.renderSquare(i,2,iSquares[2][0],iSquares[2][1])}
        {this.renderSquare(i,3,iSquares[3][0],iSquares[3][1])}
        {this.renderSquare(i,4,iSquares[4][0],iSquares[4][1])}
        {this.renderSquare(i,5,iSquares[5][0],iSquares[5][1])}
        {this.renderSquare(i,6,iSquares[6][0],iSquares[6][1])}
        {this.renderSquare(i,7,iSquares[7][0],iSquares[7][1])}
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
                  [[1,'r'],[0,'n'],[1,'l'],[0,'q'],[1,'k'],[0,'l'],[1,'n'],[0,'r']],
                  [[0,'p'],[1,'p'],[0,'p'],[1,'p'],[0,'p'],[1,'p'],[0,'p'],[1,'p']],
                  [[1,' '],[0,' '],[1,' '],[0,' '],[1,' '],[0,' '],[1,' '],[0,' ']],
                  [[0,' '],[1,' '],[0,' '],[1,' '],[0,' '],[1,' '],[0,' '],[1,' ']],
                  [[1,' '],[0,' '],[1,' '],[0,' '],[1,' '],[0,' '],[1,' '],[0,' ']],
                  [[0,' '],[1,' '],[0,' '],[1,' '],[0,' '],[1,' '],[0,' '],[1,' ']],
                  [[1,'P'],[0,'P'],[1,'P'],[0,'P'],[1,'P'],[0,'P'],[1,'P'],[0,'P']],
                  [[0,'R'],[1,'N'],[0,'L'],[1,'Q'],[0,'K'],[1,'L'],[0,'N'],[1,'R']],
                 ],
      }],    
      stepNumber: 0,
      whiteIsNext: true,
      rowColumnFrom: [],
      reverseHistory: true,
    };
  }
  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const c = current.squares[i][j][1];
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
            squares[i][j][1] = squares[rowFrom][columnFrom][1];
            squares[rowFrom][columnFrom][1] = ' ';
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
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      
      return (
        <li key={move}>
          <button 
            className={this.state.stepNumber === move ? 'goto bold' : 'goto'}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });    

    if (this.state.reverseHistory) {moves.reverse()};    
    
    const status = 'Next player: ' + (this.state.whiteIsNext?'white':'black');

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i,j) => this.handleClick(i,j)}
            rowColumnFrom={this.state.rowColumnFrom}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div className="status">
            <button className="goto"
              onClick={() => this.toggleOrder()}> 
              <span>Click to change history order.</span>
            </button>
          </div>
          <ol reversed={this.state.reverseHistory}>{moves}</ol>
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

function moveIsLegal(from, to) {
  const p1 = from[1];
  const p2 = to[1];
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

function row(x) {
  return (x >> 3);
}

function col(x) {
  return (x & 7);
}