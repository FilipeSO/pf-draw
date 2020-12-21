import React from "react";
import { Circle, Group, Line } from "react-konva";
import { _SETTINGS } from "../../settings";
import { useEffect, useRef } from "react";
import { getAngle } from "../../utils";

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
  const stroke = _SETTINGS.TR.stroke || _SETTINGS.default.stroke;
  const strokeWidth = _SETTINGS.TR.strokeWidth || _SETTINGS.default.strokeWidth;
  const strokeWidthLT =
    _SETTINGS.LT.strokeWidth || _SETTINGS.default.strokeWidth;
  let line_opacity = parseInt(canvasConfig.line_opacity) / 100;

  // const draggable = _SETTINGS.TR.draggable || _SETTINGS.default.draggable;
  // console.log(endPointA, endPointB);
  const refTR = useRef(null);
  useEffect(() => {
    // console.log(
    //   "EFFECT",
    //   endPointB.pos.x,
    //   endPointA.pos.x,
    //   endPointB.pos.y,
    //   endPointA.pos.y
    // );
    refTR.current.rotation(
      getAngle(
        bars[endPointB].pos.x - bars[endPointA].pos.x,
        bars[endPointB].pos.y - bars[endPointA].pos.y
      )
    );
  }, [bars, endPointA, endPointB]);
  // console.log(props.handleDrag);
  return (
    <>
      <Line
        points={[bars[endPointA].pos.x, bars[endPointA].pos.y, x, y]}
        stroke={"#0F0"}
        strokeWidth={strokeWidthLT}
        endPointA={endPointA}
        endPointB={name}
        n={1}
        opacity={line_opacity}
        // bezier={n > 1}
      />

      <Line
        points={[bars[endPointB].pos.x, bars[endPointB].pos.y, x, y]}
        stroke={"#0F0"}
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
        {/* HIGH SIDE */}
        <Circle
          x={-radius + radius / 4}
          y={radius / 4}
          radius={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}

          // fill={"#FFF"}
        />
        {/* LOW SIDE */}
        <Circle
          x={radius - radius / 4}
          y={radius / 4}
          radius={radius}
          stroke={stroke}
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
