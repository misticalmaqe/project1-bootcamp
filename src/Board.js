import React from "react";
import "./Board.css";

const Board = ({ board, label, onClick, style, disabled }) => {
  const handleClick = (row, col) => {
    if (!disabled) {
      onClick(row, col);
    }
  };

  return (
    <div className="board" style={style}>
      <div className="board-label">{label}</div>
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`board-cell ${cell}`}
              onClick={() => handleClick(rowIndex, colIndex)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
