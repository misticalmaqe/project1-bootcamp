// Controls.js
import React from "react";

const Controls = ({ startGame, reloadPage, gameStarted, placedShips }) => {
  return (
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
  );
};

export default Controls;
