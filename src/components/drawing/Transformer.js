import React from "react";
import { Circle, Group, Line } from "react-konva";
import { _SETTINGS } from "../../settings";
import { useEffect, useRef } from "react";
import { getAngle } from "./utils";
import { getBarColor } from "../../utils";

const Transformer = ({
  x,
  y,
  endPointA,
  endPointB,
  name,
  bars,
  n,
  canvasConfig,
}) => {
  const radius = _SETTINGS.TR.radius || _SETTINGS.default.radius;
  const strokeWidth = _SETTINGS.TR.strokeWidth || _SETTINGS.default.strokeWidth;
  const strokeWidthLT =
    _SETTINGS.LT.strokeWidth || _SETTINGS.default.strokeWidth;
  let line_opacity = parseInt(canvasConfig.line_opacity) / 100;

  const refTR = useRef(null);
  useEffect(() => {
    refTR.current.rotation(
      getAngle(
        bars[endPointB].pos.x - bars[endPointA].pos.x,
        bars[endPointB].pos.y - bars[endPointA].pos.y
      )
    );
  }, [bars, endPointA, endPointB]);
  return (
    <>
      <Line
        points={[bars[endPointA].pos.x, bars[endPointA].pos.y, x, y]}
        stroke={getBarColor(bars[endPointA].v_base)}
        strokeWidth={strokeWidthLT}
        endPointA={endPointA}
        endPointB={name}
        n={1}
        opacity={line_opacity}
        // bezier={n > 1}
      />

      <Line
        points={[bars[endPointB].pos.x, bars[endPointB].pos.y, x, y]}
        stroke={getBarColor(bars[endPointB].v_base)}
        strokeWidth={strokeWidthLT}
        endPointA={name}
        endPointB={endPointB}
        n={1}
        opacity={line_opacity}
        // bezier={n > 1}
      />

      <Group
        // draggable={draggable}
        endPointA={endPointA}
        endPointB={endPointB}
        name={name}
        type={"TR"}
        x={x}
        y={y}
        n={n}
        ref={refTR}
      >
        {/* ENDPOINTA SIDE */}
        <Circle
          x={-radius + radius / 4}
          y={radius / 4}
          radius={radius}
          stroke={"#000"}
          strokeWidth={strokeWidth}
          // fill={"#FFF"}
        />
        {/* ENDPOINTB SIDE */}
        <Circle
          x={radius - radius / 4}
          y={radius / 4}
          radius={radius}
          stroke={"#000"}
          strokeWidth={strokeWidth}
          // fill={"#FFF"}
        />
        {/* TERTIARY SIDE */}
        {/* <Circle
          y={-radius + radius / 4}
          radius={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          // fill={"#FFF"}
        /> */}
      </Group>
    </>
  );
};

export default Transformer;
