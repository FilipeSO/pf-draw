import React from "react";
import { Group, Circle } from "react-konva";
import { _SETTINGS } from "../settings";
const Bar = ({ x, y, name, handleDrag, color }) => {
  const radius = _SETTINGS.BAR.radius || _SETTINGS.default.radius;
  const strokeWidth =
    _SETTINGS.BAR.strokeWidth || _SETTINGS.default.strokeWidth;
  const draggable = _SETTINGS.BAR.draggable || _SETTINGS.default.draggable;

  // console.log(x, y);
  return (
    <Group
      draggable={draggable}
      x={x}
      y={y}
      name={name}
      onDragMove={(e) => handleDrag(e)}
    >
      {/* <Rect width={10} height={10} strokeWidth={strokeWidth} fill={"#F0F"} /> */}
      <Circle
        radius={radius * 2}
        stroke={color}
        strokeWidth={strokeWidth}
        fill={color}
      />
    </Group>
  );
};

export default Bar;
