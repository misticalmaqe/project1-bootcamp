import React from "react";
import "./Board.css";

const Board = ({
  board,
  label,
  onClick,
  style,
  disabled,
  selectedShip,
  selectedOrientation,
}) => {
  const handleCellClick = (row, col) => {
    if (!disabled) {
      onClick(row, col, selectedShip, selectedOrientation);
    }
  };

  return (
    <div className="board" style={style}>
      <div className="board-label">{label}</div>
      <div className="board-grid">
        {board.map((row, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`board-cell ${cell === "S" ? "ship" : ""}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
