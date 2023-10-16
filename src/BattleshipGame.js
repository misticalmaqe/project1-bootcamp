import React, { useState, useEffect } from "react";
import Board from "./Board";
import "./Board.css";
import "./BattleshipGame.css";

const BOARD_SIZE = 10;

export const SHIP_SIZES = {
  "Aircraft Carrier": 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
};

const BattleshipGame = () => {
  const [player1PlacementBoard, setPlayer1PlacementBoard] = useState(
    initializeEmptyBoard()
  );
  const [computerPlacementBoard, setComputerPlacementBoard] = useState(
    initializeEmptyBoard()
  );
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState("horizontal");
  const [gameStarted, setGameStarted] = useState(false);
  const [placedShips, setPlacedShips] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [clickedCells, setClickedCells] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false))
  );

  useEffect(() => {
    if (gameStarted) {
      placeComputerShips();
    }
  }, [gameStarted]);

  function initializeEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(null)
    );
  }

  const placeShip = (shipType, row, col, orientation) => {
    const shipSize = SHIP_SIZES[shipType];
    const newPlacedShips = { ...placedShips };

    if (newPlacedShips[shipType]) {
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

    for (let i = 0; i < shipSize; i++) {
      if (
        (orientation === "horizontal" &&
          player1PlacementBoard[row][col + i] === "S") ||
        (orientation === "vertical" &&
          player1PlacementBoard[row + i][col] === "S")
      ) {
        alert("Cannot place the ship in this position.");
        return;
      }
    }

    const updatedPlayer1PlacementBoard = player1PlacementBoard.map(
      (boardRow, rowIndex) => {
        return boardRow.map((cell, colIndex) => {
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

    newPlacedShips[shipType] = true;

    setPlacedShips(newPlacedShips);
    setPlayer1PlacementBoard(updatedPlayer1PlacementBoard);
  };

  const handleShipSelection = (ship) => {
    console.log("Handling ship selection:", ship);
    setSelectedShip(ship);
  };

  const handleOrientationChange = (orientation) => {
    console.log("Handling orientation change:", orientation);
    setSelectedOrientation(orientation);
  };

  const handlePlayerPlacement = (row, col) => {
    console.log("Handling player placement at:", row, col);
    if (
      selectedShip &&
      selectedOrientation &&
      !clickedCells[row][col] &&
      playerTurn &&
      !gameOver
    ) {
      placeShip(selectedShip, row, col, selectedOrientation);

      const updatedClickedCells = clickedCells.map((rowArray, rowIndex) => {
        return rowIndex === row
          ? rowArray.map((_, columnIndex) => columnIndex === col)
          : rowArray;
      });

      setClickedCells(updatedClickedCells);
    }
  };

  const handleComputerPlacementClick = (row, col) => {
    console.log("Handling computer placement click at:", row, col);
    if (!playerTurn || gameOver) return;

    if (computerPlacementBoard[row][col] === "S") {
      const updatedComputerPlacementBoard = computerPlacementBoard.map(
        (rowArray, rowIndex) => {
          return rowArray.map((cell, colIndex) => {
            return rowIndex === row && colIndex === col ? "X" : cell;
          });
        }
      );

      setComputerPlacementBoard(updatedComputerPlacementBoard);

      const allShipsSunk = checkAllShipsSunk(updatedComputerPlacementBoard);
      if (allShipsSunk) {
        alert("Player wins! All computer ships have been sunk.");
        setGameOver(true);
      }
    }
  };

  const playComputerTurn = () => {
    if (!playerTurn) {
      let randomRow, randomCol;

      do {
        randomRow = Math.floor(Math.random() * BOARD_SIZE);
        randomCol = Math.floor(Math.random() * BOARD_SIZE);
      } while (
        player1PlacementBoard[randomRow][randomCol] === "H" ||
        player1PlacementBoard[randomRow][randomCol] === "M"
      );

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

      setPlayer1PlacementBoard(updatedPlayer1PlacementBoard);
      setPlayerTurn(true);

      const allShipsSunk = checkAllShipsSunk(player1PlacementBoard);
      if (allShipsSunk) {
        alert("Computer wins!");
        setGameOver(true);
      }
    }
  };

  const checkAllShipsSunk = (board) => {
    return board.flat().every((cell) => cell !== "S");
  };

  const generateRandomLocation = () => {
    const randomRow = Math.floor(Math.random() * BOARD_SIZE);
    const randomCol = Math.floor(Math.random() * BOARD_SIZE);
    return [randomRow, randomCol];
  };

  const placeComputerShips = () => {
    const newComputerPlacementBoard = initializeEmptyBoard();

    for (const ship in SHIP_SIZES) {
      const shipSize = SHIP_SIZES[ship];
      let success = false;

      while (!success) {
        const [randomRow, randomCol] = generateRandomLocation();
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

    setComputerPlacementBoard(newComputerPlacementBoard);
  };

  const startGame = () => {
    if (gameOver) {
      alert("The game is already over. Reload the page to start a new game.");
      return;
    }

    const allShipsPlaced = Object.keys(SHIP_SIZES).every(
      (ship) => placedShips[ship]
    );
    if (!allShipsPlaced) {
      alert("Please place all ships before starting the game.");
      return;
    }

    setGameStarted(true);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const player1PlacementBoardStyle = {
    border: `2px solid ${playerTurn ? "green" : "red"}`,
  };

  return (
    <div className="battleship-container">
      <div className="game-info">
        <h3>{`It's ${playerTurn ? "Your" : "Computer's"} Turn`}</h3>
      </div>

      <div className="board-container">
        <div>
          <Board
            board={player1PlacementBoard}
            label="Player 1 Placement Board"
            onClick={handlePlayerPlacement}
            style={player1PlacementBoardStyle}
            disabled={gameStarted}
            selectedShip={selectedShip}
            selectedOrientation={selectedOrientation}
          />
        </div>

        <div>
          <Board
            board={computerPlacementBoard}
            label="Computer Placement Board"
            onClick={handleComputerPlacementClick}
            selectedShip={null}
            selectedOrientation={null}
          />
        </div>
      </div>

      <div className="ship-selection-container">
        <h2>Select a Ship</h2>
        {Object.keys(SHIP_SIZES).map((ship) => (
          <div key={ship} className="ship-selection-item">
            <input
              type="radio"
              id={ship}
              value={ship}
              checked={selectedShip === ship}
              onChange={() => handleShipSelection(ship)}
              disabled={placedShips[ship] || gameStarted}
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
            onChange={() => handleOrientationChange("horizontal")}
            disabled={gameStarted}
          />
          Horizontal
        </label>
        <label>
          <input
            type="radio"
            value="vertical"
            checked={selectedOrientation === "vertical"}
            onChange={() => handleOrientationChange("vertical")}
            disabled={gameStarted}
          />
          Vertical
        </label>
      </div>

      <div className="game-controls">
        <button
          onClick={startGame}
          disabled={
            gameStarted ||
            !Object.keys(placedShips).length === Object.keys(SHIP_SIZES).length
          }
        >
          Start Game
        </button>
        <button onClick={reloadPage}>Reload</button>
      </div>
    </div>
  );
};

export default BattleshipGame;
//xport { SHIP_SIZES };
