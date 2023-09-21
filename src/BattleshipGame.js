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
      player1Board: this.initializeEmptyBoard(),
      computerPlacementBoard: this.initializeEmptyBoard(),
      player1PlacementBoard: this.initializeEmptyBoard(),
      computerHits: 0,
      selectedShip: null,
      selectedOrientation: "horizontal",
      gameStarted: false,
      placedShips: {},
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
    const { selectedShip, selectedOrientation } = this.state;

    if (selectedShip && selectedOrientation) {
      this.placeShip(selectedShip, row, col, selectedOrientation);
    }
  };

  handlePlayerShot = (row, col) => {
    const { computerPlacementBoard, computerHits } = this.state;
    const updatedComputerPlacementBoard = computerPlacementBoard.map(
      (rowArray, rowIndex) => {
        return rowArray.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return cell === "S" ? "X" : null;
          }
          return cell;
        });
      }
    );

    this.setState(
      (prevState) => ({
        computerHits:
          prevState.computerHits +
          (computerPlacementBoard[row][col] === "S" ? 1 : 0),
        computerPlacementBoard: updatedComputerPlacementBoard,
      }),
      () => {
        const allShipsSunk = this.checkAllShipsSunk(this.state.computerHits);
        if (allShipsSunk) {
          alert("Player wins!");
        }
      }
    );
  };

  checkAllShipsSunk = (hits) => {
    const totalShipCells = Object.values(SHIP_SIZES).reduce(
      (acc, curr) => acc + curr,
      0
    );
    return hits === totalShipCells;
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
    const { placedShips } = this.state;
    const allShipsPlaced = SHIPS.every((ship) => placedShips[ship]);
    if (!allShipsPlaced) {
      alert("Please place all ships before starting the game.");
      return;
    }

    this.setState({ gameStarted: true }, () => {
      this.placeComputerShips();
    });
  };

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    const {
      player1Board,
      computerPlacementBoard,
      player1PlacementBoard,
      selectedShip,
      selectedOrientation,
      gameStarted,
    } = this.state;

    return (
      <div className="battleship-container">
        <div className="board-container">
          <div>
            <Board board={player1Board} label="Player 1 Board" />
          </div>

          <div>
            <Board
              board={player1PlacementBoard}
              label="Player 1 Placement Board"
              onClick={this.handlePlayerPlacement}
            />
          </div>

          <div>
            <Board
              board={computerPlacementBoard}
              label="Computer Placement Board"
              onClick={(row, col) => {
                if (gameStarted) {
                  this.handlePlayerShot(row, col);
                }
              }}
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
                disabled={this.state.placedShips[ship]}
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
            />
            Horizontal
          </label>
          <label>
            <input
              type="radio"
              value="vertical"
              checked={selectedOrientation === "vertical"}
              onChange={() => this.handleOrientationChange("vertical")}
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
