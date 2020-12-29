import React from "react";
import { Line } from "react-konva";
import { _SETTINGS } from "../../settings";
import { getLinePoints } from "./utils";
import { getBarColor } from "../../utils";

const TransmissionLine = ({ endPointA, endPointB, n, bars, canvasConfig }) => {
  // const radius = _SETTINGS.LT.radius || _SETTINGS.default.radius;
  // const stroke = _SETTINGS.LT.stroke || _SETTINGS.default.stroke;
  const strokeWidth = _SETTINGS.LT.strokeWidth || _SETTINGS.default.strokeWidth;
  // const draggable = _SETTINGS.LT.draggable || _SETTINGS.default.draggable;
  // const fill = _SETTINGS.LT.fill || _SETTINGS.default.fill;
  //   console.log(handleDrag);
  //   console.log(endPointA, endPointB, n, color, bars);
  let lineColor = getBarColor(bars[endPointA].v_base);
  let linePoints = [];
  let line_opacity = parseInt(canvasConfig.line_opacity) / 100;

  //APENAS PARA DRAW A SEMPRE MENOR QUE B
  if (parseInt(endPointA) > parseInt(endPointB)) {
    linePoints = getLinePoints(
      bars[endPointB].pos.x,
      bars[endPointB].pos.y,
      bars[endPointA].pos.x,
      bars[endPointA].pos.y,
      n
    );
  } else {
    linePoints = getLinePoints(
      bars[endPointA].pos.x,
      bars[endPointA].pos.y,
      bars[endPointB].pos.x,
      bars[endPointB].pos.y,
      n
    );
  }
  return (
    <Line
      points={linePoints}
      stroke={lineColor}
      strokeWidth={strokeWidth}
      endPointA={endPointA}
      endPointB={endPointB}
      n={n}
      opacity={line_opacity}
      // bezier={n > 1}
    />
  );
};

export default TransmissionLine;
