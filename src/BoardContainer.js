// BoardContainer.js
import React from "react";
import Board from "./Board";

const BoardContainer = ({
  player1PlacementBoard,
  computerPlacementBoard,
  player1PlacementBoardStyle,
  handlePlayerPlacement,
  handleComputerPlacementClick,
  gameStarted,
  selectedShip,
  selectedOrientation,
}) => {
  return (
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
  );
};

export default BoardContainer;
