// ColorPicker.js
import React from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, onChange, onClose, onApply }: any) => {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }}
          onClick={onClose}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <SketchPicker color={color} onChange={onChange} />
          <button onClick={onApply}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
