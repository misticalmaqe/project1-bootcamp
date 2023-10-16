// GameInfo.js
import React from "react";

const GameInfo = ({ playerTurn }) => {
  return (
    <div className="game-info">
      <h3>{`It's ${playerTurn ? "Your" : "Computer's"} Turn`}</h3>
    </div>
  );
};

export default GameInfo;
