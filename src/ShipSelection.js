// ShipSelection.js
import React from "react";

const ShipSelection = ({
  ships,
  selectedShip,
  handleShipSelection,
  placedShips,
  gameStarted,
}) => {
  return (
    <div className="ship-selection-container">
      <h2>Select a Ship</h2>
      {ships.map((ship) => (
        <div key={ship} className="ship-selection-item">
          <input
            type="radio"
            id={ship}
            value={ship}
            checked={selectedShip === ship}
            onChange={() => handleShipSelection(ship)}
            disabled={placedShips[ship] || gameStarted}
          />
          <label htmlFor={ship}>{ship}</label>
        </div>
      ))}
    </div>
  );
};

export default ShipSelection;
