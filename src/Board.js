import React from "react";
import "./Board.css";

const Board = ({ board, label, onClick }) => {
  return (
    <div className="board">
      <h2>{label}</h2>
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`board-cell ${cell === "S" ? "ship-placed" : ""}`}
              onClick={() => onClick && onClick(rowIndex, colIndex)}
            >
              {cell === "S" ? "S" : cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
