import React from "react";
import { Circle, Group, Text, Line } from "react-konva";
import { _SETTINGS } from "../../settings";
const Generator = ({
  x,
  y,
  type,
  name,
  endPointA,
  handleDrag,
  bars,
  transformer,
}) => {
  const radius = _SETTINGS.UG.radius || _SETTINGS.default.radius;
  const stroke = _SETTINGS.UG.stroke || _SETTINGS.default.stroke;
  const strokeWidth = _SETTINGS.UG.strokeWidth || _SETTINGS.default.strokeWidth;
  const draggable = _SETTINGS.UG.draggable || _SETTINGS.default.draggable;
  const fill = _SETTINGS.UG.fill || _SETTINGS.default.fill;
  // const strokeWidthLT =
  //   _SETTINGS.LT.strokeWidth || _SETTINGS.default.strokeWidth;

  // { pos, endPointA, name, color, n, bars, handleDrag }
  // console.log(name);
  return (
    <>
      {!transformer && (
        <Line
          points={[bars[endPointA].pos.x, bars[endPointA].pos.y, x, y]}
          stroke={stroke}
          strokeWidth={strokeWidth}
          endPointA={endPointA}
          endPointB={name}
          n={1}
          dash={[10, 5]}
        />
      )}
      <Group
        draggable={draggable}
        x={x}
        y={y}
        type={type}
        name={name}
        onDragMove={(e) => handleDrag(e)}
      >
        <Circle
          radius={radius * 2}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
        />
        <Text
          x={-radius * 1.5}
          y={-radius * 0.8}
          text={"UG"}
          fontSize={radius * 2}
        />
      </Group>
    </>
  );
};

export default Generator;
