import React, { Component } from 'react';
import '../../styles/styles.css';

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
      }
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', (e) => {
      this.setVelocity(e);
    });
    setTimeout(() => {
      this.gameLoop()
    }, 1000);
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

      const nextState = {
        squirrel: {
          ...squirrel,
          head: {
            row: squirrel.head.row + squirrel.velocity.y,
            col: squirrel.head.col + squirrel.velocity.x
          },
          tail: [squirrel.head, ...squirrel.tail]
        },
        food: this.getRandomFood()
      };

      return nextState;
    });
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
            y: -1,
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
            y: 1,
          }
        }
      }))
    } else if (event.keyCode === 39) {
      if (squirrel.velocity.x === -1) return;
      this.setState(({squirrel}) => ({
        squirrel: {
          ...squirrel,
          velocity: {
            x: 1,
            y: 0,
          }
        }
      }))
    } else if (event.keyCode === 37) {
      if (squirrel.velocity.x === 1) return;
      this.setState(({squirrel}) => ({
        squirrel: {
          ...squirrel,
          velocity: {
            x: -1,
            y: 0,
          }
        }
      }))
    }
  }

  render() {
    const { grid, snake, gameOver } = this.state;
    return (
      <div className="App">
        {
          gameOver
          ? <h1>Perdiste! Tu puntaje fue: {snake.tail.length + 1}!</h1>
          : <section className="grid">
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
        }
      </div>
    );

  }
}

export default App;
