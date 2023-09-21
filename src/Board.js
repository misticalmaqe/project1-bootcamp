import React from "react";

const Board = ({ board, label, onClick, style }) => {
  return (
    <div className="board" style={style}>
      <h2>{label}</h2>
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`board-cell ${
                cell === "S"
                  ? "ship"
                  : cell === "X"
                  ? "hit"
                  : cell === null
                  ? "miss"
                  : ""
              }`}
              onClick={() => onClick && onClick(rowIndex, colIndex)}
            >
              {cell === "S" || cell === "X" ? " " : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
