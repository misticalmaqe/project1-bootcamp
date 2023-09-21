import React, { Component } from "react";
import Board from "./Board.js";
import "./BattleshipGame.css";

const BOARD_SIZE = 10;

const SHIP_SIZES = {
  "Aircraft Carrier": 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
};
const SHIPS = Object.keys(SHIP_SIZES);

class BattleshipGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1PlacementBoard: this.initializeEmptyBoard(),
      computerPlacementBoard: this.initializeEmptyBoard(),
      computerHits: 0,
      selectedShip: null,
      selectedOrientation: "horizontal",
      gameStarted: false,
      placedShips: {},
      currentPlayer: "player",
      clickedCells: Array.from({ length: BOARD_SIZE }, () =>
        Array(BOARD_SIZE).fill(false)
      ),
      gameOver: false,
      playerTurn: true,
    };
  }

  initializeEmptyBoard = () => {
    return Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(null)
    );
  };

  placeShip = (shipType, row, col, orientation) => {
    const shipSize = SHIP_SIZES[shipType];
    const { placedShips } = this.state;

    if (placedShips[shipType]) {
      alert(`You have already placed a ${shipType}.`);
      return;
    }

    if (
      (orientation === "horizontal" && col + shipSize > BOARD_SIZE) ||
      (orientation === "vertical" && row + shipSize > BOARD_SIZE)
    ) {
      alert("Cannot place the ship in this position.");
      return;
    }

    this.setState((prevState) => ({
      placedShips: {
        ...prevState.placedShips,
        [shipType]: true,
      },
    }));

    const newPlayer1PlacementBoard = this.state.player1PlacementBoard.map(
      (rowArray, rowIndex) => {
        return rowArray.map((cell, colIndex) => {
          if (
            (orientation === "horizontal" &&
              rowIndex === row &&
              colIndex >= col &&
              colIndex < col + shipSize) ||
            (orientation === "vertical" &&
              colIndex === col &&
              rowIndex >= row &&
              rowIndex < row + shipSize)
          ) {
            return "S";
          }
          return cell;
        });
      }
    );

    this.setState({
      player1PlacementBoard: newPlayer1PlacementBoard,
    });
  };

  handleShipSelection = (ship) => {
    this.setState({ selectedShip: ship });
  };

  handleOrientationChange = (orientation) => {
    this.setState({ selectedOrientation: orientation });
  };

  handlePlayerPlacement = (row, col) => {
    const { selectedShip, selectedOrientation, clickedCells } = this.state;

    if (
      selectedShip &&
      selectedOrientation &&
      !clickedCells[row][col] &&
      this.state.currentPlayer === "player" &&
      !this.state.gameOver
    ) {
      this.placeShip(selectedShip, row, col, selectedOrientation);
      clickedCells[row][col] = true;

      this.setState({
        clickedCells: clickedCells,
      });
    }
  };

  handlePlayerShot = (row, col) => {
    const {
      computerPlacementBoard,
      computerHits,
      clickedCells,
      currentPlayer,
      gameOver,
      playerTurn,
    } = this.state;

    if (!playerTurn || clickedCells[row][col] || gameOver) {
      return;
    }

    const updatedComputerPlacementBoard = computerPlacementBoard.map(
      (rowArray, rowIndex) => {
        return rowArray.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return cell === "S" ? "X" : "O";
          }
          return cell;
        });
      }
    );

    clickedCells[row][col] = true;

    this.setState(
      {
        computerHits:
          this.state.computerHits +
          (computerPlacementBoard[row][col] === "S" ? 1 : 0),
        computerPlacementBoard: updatedComputerPlacementBoard,
        clickedCells: clickedCells,
        currentPlayer: "computer",
        playerTurn: false,
      },
      () => {
        const allShipsSunk = this.checkAllShipsSunk(
          this.state.computerPlacementBoard
        );

        if (allShipsSunk) {
          alert("Player wins!");
          this.setState({ gameOver: true });
        } else {
          this.playComputerTurn();
        }
      }
    );
  };

  playComputerTurn = () => {
    const { player1PlacementBoard, clickedCells } = this.state;

    if (!this.state.playerTurn) {
      let randomRow, randomCol;

      do {
        randomRow = Math.floor(Math.random() * BOARD_SIZE);
        randomCol = Math.floor(Math.random() * BOARD_SIZE);
      } while (clickedCells[randomRow][randomCol]);

      const updatedPlayer1PlacementBoard = player1PlacementBoard.map(
        (rowArray, rowIndex) => {
          return rowArray.map((cell, colIndex) => {
            if (rowIndex === randomRow && colIndex === randomCol) {
              return cell === "S" ? "H" : "M";
            }
            return cell;
          });
        }
      );

      clickedCells[randomRow][randomCol] = true;

      this.setState(
        {
          player1PlacementBoard: updatedPlayer1PlacementBoard,
          currentPlayer: "player",
          clickedCells: clickedCells,
          playerTurn: true,
        },
        () => {
          const allShipsSunk = this.checkAllShipsSunk(
            this.state.player1PlacementBoard
          );
          if (allShipsSunk) {
            alert("Computer wins!");
            this.setState({ gameOver: true });
          } else {
            setTimeout(() => this.playComputerTurn(), 100);
          }
        }
      );
    }
  };

  checkAllShipsSunk = (board) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === "S") {
          return false;
        }
      }
    }
    return true;
  };

  generateRandomLocation = () => {
    const randomRow = Math.floor(Math.random() * BOARD_SIZE);
    const randomCol = Math.floor(Math.random() * BOARD_SIZE);
    return [randomRow, randomCol];
  };

  placeComputerShips = () => {
    const newComputerPlacementBoard = this.initializeEmptyBoard();

    for (const ship of SHIPS) {
      const shipSize = SHIP_SIZES[ship];
      let success = false;

      while (!success) {
        const [randomRow, randomCol] = this.generateRandomLocation();
        const randomOrientation =
          Math.floor(Math.random() * 2) === 0 ? "horizontal" : "vertical";

        let canPlaceShip = true;

        if (
          (randomOrientation === "horizontal" &&
            randomCol + shipSize <= BOARD_SIZE) ||
          (randomOrientation === "vertical" &&
            randomRow + shipSize <= BOARD_SIZE)
        ) {
          for (let i = 0; i < shipSize; i++) {
            if (
              (randomOrientation === "horizontal" &&
                newComputerPlacementBoard[randomRow][randomCol + i] !== null) ||
              (randomOrientation === "vertical" &&
                newComputerPlacementBoard[randomRow + i][randomCol] !== null)
            ) {
              canPlaceShip = false;
              break;
            }
          }

          if (canPlaceShip) {
            for (let i = 0; i < shipSize; i++) {
              if (randomOrientation === "horizontal") {
                newComputerPlacementBoard[randomRow][randomCol + i] = "S";
              } else {
                newComputerPlacementBoard[randomRow + i][randomCol] = "S";
              }
            }
            success = true;
          }
        }
      }
    }

    this.setState({
      computerPlacementBoard: newComputerPlacementBoard,
    });
  };

  startGame = () => {
    const { placedShips, gameOver } = this.state;

    if (gameOver) {
      alert("The game is already over. Reload the page to start a new game.");
      return;
    }

    const allShipsPlaced = SHIPS.every((ship) => placedShips[ship]);
    if (!allShipsPlaced) {
      alert("Please place all ships before starting the game.");
      return;
    }

    this.setState({ gameStarted: true }, () => {
      this.placeComputerShips();
      this.playComputerTurn();
    });
  };

  reloadPage = () => {
    window.location.reload();
  };

  simulateComputerWin = () => {
    const { computerPlacementBoard } = this.state;

    for (const ship of SHIPS) {
      const shipSize = SHIP_SIZES[ship];
      let success = false;

      while (!success) {
        const randomRow = Math.floor(Math.random() * BOARD_SIZE);
        const randomCol = Math.floor(Math.random() * BOARD_SIZE);
        const randomOrientation =
          Math.floor(Math.random() * 2) === 0 ? "horizontal" : "vertical";

        let canPlaceShip = true;

        if (
          (randomOrientation === "horizontal" &&
            randomCol + shipSize <= BOARD_SIZE) ||
          (randomOrientation === "vertical" &&
            randomRow + shipSize <= BOARD_SIZE)
        ) {
          for (let i = 0; i < shipSize; i++) {
            if (
              (randomOrientation === "horizontal" &&
                computerPlacementBoard[randomRow][randomCol + i] !== null) ||
              (randomOrientation === "vertical" &&
                computerPlacementBoard[randomRow + i][randomCol] !== null)
            ) {
              canPlaceShip = false;
              break;
            }
          }

          if (canPlaceShip) {
            for (let i = 0; i < shipSize; i++) {
              if (randomOrientation === "horizontal") {
                computerPlacementBoard[randomRow][randomCol + i] = "S";
              } else {
                computerPlacementBoard[randomRow + i][randomCol] = "S";
              }
            }
            success = true;
          }
        }
      }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (computerPlacementBoard[i][j] === "S") {
          computerPlacementBoard[i][j] = "X";
        }
      }
    }

    this.setState({
      computerPlacementBoard,
      gameOver: true,
    });

    alert("Computer wins! All player ships have been sunk.");
  };

  simulatePlayerWin = () => {
    const { computerPlacementBoard } = this.state;

    const updatedComputerPlacementBoard = computerPlacementBoard.map(
      (rowArray) => {
        return rowArray.map((cell) => {
          return cell === "S" ? "X" : cell;
        });
      }
    );

    this.setState({
      computerPlacementBoard: updatedComputerPlacementBoard,
      gameOver: true,
    });

    alert("Player wins! All computer ships have been sunk.");
  };

  handleSimulateWinClick = () => {
    this.setState({
      player1PlacementBoard: this.initializeEmptyBoard(),
      computerPlacementBoard: this.initializeEmptyBoard(),
      computerHits: 0,
      selectedShip: null,
      selectedOrientation: "horizontal",
      gameStarted: false,
      placedShips: {},
      currentPlayer: "player",
      clickedCells: Array.from({ length: BOARD_SIZE }, () =>
        Array(BOARD_SIZE).fill(false)
      ),
      gameOver: false,
      playerTurn: true,
    });

    this.simulateComputerWin();
  };

  render() {
    const {
      computerPlacementBoard,
      player1PlacementBoard,
      selectedShip,
      selectedOrientation,
      gameStarted,
      currentPlayer,
      clickedCells,
    } = this.state;

    const player1PlacementBoardStyle = {
      border: `2px solid ${currentPlayer === "player" ? "green" : "red"}`,
    };

    return (
      <div className="battleship-container">
        <div className="game-info">
          <h3>{`It's ${
            currentPlayer === "player" ? "Your" : "Computer's"
          } Turn`}</h3>
        </div>

        <div className="board-container">
          <div>
            <Board
              board={player1PlacementBoard}
              label="Player 1 Placement Board"
              onClick={this.handlePlayerPlacement}
              style={player1PlacementBoardStyle}
              disabled={gameStarted}
            />
          </div>

          <div>
            <Board
              board={computerPlacementBoard}
              label="Computer Placement Board"
              onClick={(row, col) => {
                if (gameStarted && currentPlayer === "player") {
                  this.handlePlayerShot(row, col);
                }
              }}
              disabled={gameStarted}
            />
          </div>
        </div>

        <div className="ship-selection-container">
          <h2>Select a Ship</h2>
          {SHIPS.map((ship) => (
            <div key={ship} className="ship-selection-item">
              <input
                type="radio"
                id={ship}
                value={ship}
                checked={selectedShip === ship}
                onChange={() => this.handleShipSelection(ship)}
                disabled={this.state.placedShips[ship] || gameStarted}
              />
              <label htmlFor={ship}>{ship}</label>
            </div>
          ))}
        </div>

        <div className="orientation-container">
          <label>
            Orientation:
            <input
              type="radio"
              value="horizontal"
              checked={selectedOrientation === "horizontal"}
              onChange={() => this.handleOrientationChange("horizontal")}
              disabled={gameStarted}
            />
            Horizontal
          </label>
          <label>
            <input
              type="radio"
              value="vertical"
              checked={selectedOrientation === "vertical"}
              onChange={() => this.handleOrientationChange("vertical")}
              disabled={gameStarted}
            />
            Vertical
          </label>
        </div>

        <div className="game-controls">
          <button
            onClick={this.startGame}
            disabled={
              gameStarted ||
              !Object.keys(this.state.placedShips).length === SHIPS.length
            }
          >
            Start Game
          </button>
          <button onClick={this.reloadPage}>Reload</button>
          <button onClick={this.handleSimulateWinClick}>
            Simulate Computer Win
          </button>
          <button onClick={this.simulatePlayerWin}>Simulate Player Win</button>
        </div>

        {gameStarted && (
          <div className="computer-ships">
            <h2>Computer's Ship Placements</h2>
            <Board board={computerPlacementBoard} label="Computer Board" />
          </div>
        )}
      </div>
    );
  }
}

export default BattleshipGame;
