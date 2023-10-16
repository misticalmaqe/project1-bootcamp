// OrientationSelection.js
import React from "react";

const OrientationSelection = ({
  selectedOrientation,
  handleOrientationChange,
  gameStarted,
}) => {
  return (
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
  );
};

export default OrientationSelection;
