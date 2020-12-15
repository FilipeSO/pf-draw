import React from "react";
import { Group, Circle, Text } from "react-konva";
import { _SETTINGS } from "../../settings";
import { complexToPolarString, complexToRecString } from "../../utils";

const Bar = ({ bar, handleDrag, handleDragEnd }) => {
  let { pos, name, id, color, v_data, pf_data, roundTo } = bar;
  // console.log(result);
  v_data = v_data || false;
  pf_data = pf_data || false;
  const radius = _SETTINGS.BAR.radius || _SETTINGS.default.radius;
  const strokeWidth =
    _SETTINGS.BAR.strokeWidth || _SETTINGS.default.strokeWidth;
  const draggable = _SETTINGS.BAR.draggable || _SETTINGS.default.draggable;
  const barColor = color || "000";
  const resultColor = _SETTINGS.default.resultColor || "#4299e1"; //"#63b3ed";

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
      {v_data && (
        <Text
          x={-radius * 6}
          y={-radius * 10}
          text={"V: " + complexToPolarString(v_data, roundTo)}
          // fontStyle={"bold"}
          fontSize={radius * 4}
          fill={resultColor}
        />
      )}

      {pf_data &&
        pf_data.map((equip, index) => {
          let barK = equip.k + 1;
          let barM = equip.m + 1;
          return (
            <Text
              key={index}
              x={-radius * 6}
              y={radius * 4 * index + 3 * radius}
              text={
                barK === parseInt(name)
                  ? "S" +
                    barK +
                    "_" +
                    barM +
                    ": " +
                    complexToRecString(equip.Skm, roundTo)
                  : "S" +
                    barM +
                    "_" +
                    barK +
                    ": " +
                    complexToRecString(equip.Smk, roundTo)
              }
              // fontStyle={"bold"}
              fontSize={radius * 4}
              fill={resultColor}
            />
          );
        })}
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
