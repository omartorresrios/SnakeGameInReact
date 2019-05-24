import React, { Component } from 'react';
import '../../styles/styles.css';
import ScoreBoardList from './ScoreBoardList';

class App extends Component {
  constructor() {
    super();

    const grid = [];

    for (let row = 0; row < 16; row++) {
      const cols = [];
      for (let col = 0; col < 16; col++) {
        cols.push({row, col});
      }
      grid.push(cols);
    }

    this.state = {
      grid,
      food: {
        row: Math.floor(Math.random() * 16),
        col: Math.floor(Math.random() * 16),
      },
      squirrel: {
        head: {
          row: 6,
          col: 6
        },
        velocity: {
          x: 1,
          y: 0
        },
        tail: [0, 0, 0]
      },
      score: [],
      numberOfGames: 1
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', (e) => {
      this.setVelocity(e);
    });
    this.settingTimeOut();
  }

  settingTimeOut = () => {
    setTimeout(() => {
      this.gameLoop()
    }, this.state.squirrel.tail.length ? (400 / this.state.squirrel.tail.length) + 200 : 400);
  }

  getRandomFood = () => {
    const { squirrel } = this.state;
    const newFood = {
      row: Math.floor(Math.random() * 16),
      col: Math.floor(Math.random() * 16),
    };
    if (this.isTail(newFood) || (
      squirrel.head.row === newFood.row
      && squirrel.head.col === newFood.col)) {
      return this.getRandomFood();
    } else {
      return newFood;
    }
  }

  gameLoop = () => {
    if (this.state.gameOver) return;

    this.setState(({squirrel, food}) => {
      const collidesWithFood = this.collidesWithFood();
      const nextState = {
        squirrel: {
          ...squirrel,
          head: {
            row: squirrel.head.row + squirrel.velocity.y,
            col: squirrel.head.col + squirrel.velocity.x
          },
          tail: [squirrel.head, ...squirrel.tail]
        },
        food: collidesWithFood ? this.getRandomFood() : food
      };

      if (!collidesWithFood) nextState.squirrel.tail.pop();

      return nextState;
    }, () => {
      const { squirrel, score, numberOfGames } = this.state;
      if (this.isOffEdge() || this.isTail(squirrel.head)) {
        const newScore = {
          scoreKey: 'Puntaje ' + numberOfGames,
          scoreValue: squirrel.tail.length - 3
        };

        this.setState(({gameOver, score, numberOfGames}) => ({
          gameOver: true,
          score: [
            ...score,
            newScore
          ],
          numberOfGames: numberOfGames + 1
        }))
        return;
      }
      this.settingTimeOut();
    });
  }

  isOffEdge = () => {
    const { squirrel } = this.state;

    if (squirrel.head.col > 15
      || squirrel.head.col < 0
      || squirrel.head.row > 15
      || squirrel.head.row < 0) {
        return true;
      }
  }

  collidesWithFood = () => {
    const { food, squirrel } = this.state;
    return food.row === squirrel.head.row
      && food.col === squirrel.head.col;
  }

  isFood = (cell) => {
    const { food } = this.state;
    return food.row === cell.row
      && food.col === cell.col;
  }

  isHead = (cell) => {
    const { squirrel } = this.state;
    return squirrel.head.row === cell.row
      && squirrel.head.col === cell.col;
  }

  isTail = (cell) => {
    const { squirrel } = this.state;
    return squirrel.tail.find(inTail => inTail.row === cell.row && inTail.col === cell.col);
  }

  setVelocity = (event) => {
    const { squirrel } = this.state;
    if (event.keyCode === 38) {
      if (squirrel.velocity.y === 1) return;
      this.setState(({squirrel}) => ({
        squirrel: {
          ...squirrel,
          velocity: {
            x: 0,
            y: 1,
          }
        }
      }))
    } else if (event.keyCode === 40) {
      if (squirrel.velocity.y === -1) return;
      this.setState(({squirrel}) => ({
        squirrel: {
          ...squirrel,
          velocity: {
            x: 0,
            y: -1,
          }
        }
      }))
    } else if (event.keyCode === 39)  {
      if (squirrel.velocity.x === -1) return;
      this.setState(({squirrel}) => ({
        squirrel: {
          ...squirrel,
          velocity: {
            x: -1,
            y: 0,
          }
        }
      }))
    } else if (event.keyCode === 37)  {
      if (squirrel.velocity.x === 1) return;
      this.setState(({squirrel}) => ({
        squirrel: {
          ...squirrel,
          velocity: {
            x: 1,
            y: 0,
          }
        }
      }))
    }
  }

  restartGame = () => {
    this.setState({
      gameOver: false,
      food: {
        row: Math.floor(Math.random() * 16),
        col: Math.floor(Math.random() * 16),
      },
      squirrel: {
        head: {
          row: 6,
          col: 6
        },
        velocity: {
          x: 1,
          y: 0
        },
        tail: [0, 0, 0]
      }
    }, () => {
      this.gameLoop();
    })
  }

  renderGameOverView = () => {
    const { squirrel, score, numberOfGames } = this.state;
    console.log("scoreBoard: ", score);
    return (
      <div className="GameOver-root container">
        <h1>Juego terminado! Tu puntaje fue: {squirrel.tail.length - 3}</h1>
        <div>
          {
            score.map((sco, key) => {
              return (
                <div key={key}>{sco.scoreKey} ==> {sco.scoreValue}</div>
              )
            })
          }
        </div>
        {this.renderScoresResult()}
        <div onClick={this.restartGame}>Jugar de nuevo!</div>
      </div>
    );
  }

  renderGridView = () => {
    const { grid } = this.state;
    return (
      <div className="App container">
        <section className="grid">
          {
            grid.map((row, i) => (
              row.map(cell => (
                <div key={`${cell.row} ${cell.col}`} className={`cell
                  ${
                    this.isHead(cell)
                    ? 'head' : this.isFood(cell)
                    ? 'food' : this.isTail(cell)
                    ? 'tail' : ''
                    }`
                  }>
                </div>
              ))
            ))
          }
        </section>
      </div>

    )
  }

  renderScoresResult() {
    return (
      <ScoreBoardList
        scores={this.state.score}
      />
    );
  }

  render() {
    const { gameOver } = this.state;
    return (
      <div>
        {gameOver ? this.renderGameOverView() : this.renderGridView()}
      </div>
    );
  }
}

export default App;
