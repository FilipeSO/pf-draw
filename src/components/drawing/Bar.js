import React from "react";
import { Group, Circle, Text } from "react-konva";
import { _SETTINGS } from "../../settings";
const Bar = ({ bar, handleDrag, handleDragEnd }) => {
  let { pos, name, id, color } = bar;

  const radius = _SETTINGS.BAR.radius || _SETTINGS.default.radius;
  const strokeWidth =
    _SETTINGS.BAR.strokeWidth || _SETTINGS.default.strokeWidth;
  const draggable = _SETTINGS.BAR.draggable || _SETTINGS.default.draggable;
  const barColor = color || "000";

  // console.log(x, y);
  return (
    <Group
      draggable={draggable}
      x={pos.x}
      y={pos.y}
      name={name}
      onDragMove={(e) => handleDrag(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <Text
        x={-radius * 6}
        y={-radius * 6}
        text={id}
        fontStyle={"bold"}
        fontSize={radius * 4}
      />
      <Circle
        radius={radius * 2}
        stroke={barColor}
        strokeWidth={strokeWidth}
        fill={barColor}
      />
    </Group>
  );
};

export default Bar;
