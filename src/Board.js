// Board.js

import React from "react";
import PropTypes from "prop-types";
import "./Board.css";

const Board = ({ board, label, onClick, style, disabled }) => {
  return (
    <div className="board" style={style}>
      <h2>{label}</h2>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`board-cell ${cell}`}
              onClick={() => {
                if (!disabled && onClick) {
                  onClick(rowIndex, colIndex);
                }
              }}
            >
              {cell === "S" ? <span>S</span> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

Board.propTypes = {
  board: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

export default Board;
