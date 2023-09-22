import React from "react";
import PropTypes from "prop-types";
import "./Board.css";

const Board = ({ board, label, onClick, style, disabled }) => {
  const renderCell = (rowIndex, colIndex) => {
    const cellValue = board[rowIndex][colIndex];
    let cellClass = "board-cell";

    if (cellValue === "S") {
      cellClass += " ship";
    } else if (cellValue === "H") {
      cellClass += " hit";
    } else if (cellValue === "M") {
      cellClass += " miss";
    }

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={cellClass}
        onClick={() => onClick(rowIndex, colIndex)}
        style={{ cursor: disabled ? "default" : "pointer" }}
      >
        {cellValue === "S" ? "🚢" : null}
      </div>
    );
  };

  return (
    <div className="board" style={style}>
      <h2>{label}</h2>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
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
