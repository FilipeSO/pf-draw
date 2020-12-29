import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { Group, Circle, Rect, Text } from "react-konva";
import { _SETTINGS } from "../../settings";

export default function BranchPreview({ equip, bars }) {
  // console.log(equip);
  const radius = _SETTINGS.BAR.radius || _SETTINGS.default.radius;
  const strokeWidth =
    _SETTINGS.BAR.strokeWidth || _SETTINGS.default.strokeWidth;
  const stroke = "#000"; //"#63b3ed";
  const fill = "#4299e1";

  const [canvasReady, setCanvasReady] = useState(false);
  const drawCanvasRef = useRef(null);

  const stageHeight = drawCanvasRef.current?.clientHeight;
  const stageWidth = drawCanvasRef.current?.clientWidth;
  useEffect(() => {
    setCanvasReady(true); //necessario para drawcanvasref != undefined
  }, []);

  return (
    <div
      className="border-solid border-4 border-blue-500 container mx-auto relative mt-2"
      style={{ height: "200px" }}
      ref={drawCanvasRef}
    >
      <div className="bg-blue-500 absolute w-full z-50 flex justify-center items-center h-8 text-white">
        Preview
      </div>
      {canvasReady && (
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {/* k */}

            <Group x={stageWidth / 8} y={stageHeight / 2}>
              <Text
                x={-2 * radius}
                y={-radius * 6}
                text={
                  Object.values(bars).filter(
                    (bar) => bar.name === equip.endPointA
                  )[0]?.id
                }
                fontStyle={"bold"}
                fontSize={radius * 4}
              />
              <Circle
                radius={radius * 2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={stroke}
              />
            </Group>
            {/* inside TR */}
            {equip.type === "LT" && (
              <Line
                points={[
                  (stageWidth * 2.5) / 8 - 6 * radius,
                  stageHeight / 2,
                  (stageWidth * 2.5) / 8 + 6 * radius,
                  stageHeight / 2,
                ]}
                stroke={stroke}
              ></Line>
            )}
            {/* k--TR */}
            <Line
              points={[
                stageWidth / 8,
                stageHeight / 2,
                (stageWidth * 2.5) / 8 - 6 * radius,
                stageHeight / 2,
              ]}
              stroke={stroke}
            ></Line>

            {/* TR--p */}
            <Line
              points={[
                (stageWidth * 2.5) / 8 + 6 * radius,
                stageHeight / 2,
                (stageWidth * 4) / 8,
                stageHeight / 2,
              ]}
              stroke={stroke}
            ></Line>
            {/* TR */}
            {equip.type === "TR" && (
              <Group x={(stageWidth * 2.5) / 8} y={stageHeight / 2}>
                <Text
                  x={-6 * radius}
                  y={-radius * 8}
                  text={`1:${equip.tap}∠${equip.tap_df_deg}°`}
                  fontSize={radius * 4}
                  fill={fill}
                />
                <Text
                  x={-14 * radius}
                  y={radius * 8}
                  text={`max_linear=${equip.tap_max}`}
                  fontSize={radius * 4}
                  fill={fill}
                />
                <Text
                  x={-14 * radius}
                  y={radius * 12}
                  text={`min_linear=${equip.tap_min}`}
                  fontSize={radius * 4}
                  fill={fill}
                />
                <Circle
                  x={-2 * radius}
                  radius={radius * 4}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
                <Circle
                  x={2 * radius}
                  radius={radius * 4}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
              </Group>
            )}
            {/* LT line */}
            <Line
              points={[
                (stageWidth * 2.5) / 8 + 6 * radius,
                stageHeight / 2,
                (stageWidth * 7) / 8,
                stageHeight / 2,
              ]}
              stroke={stroke}
            ></Line>
            {/* shunt */}
            <Group x={(stageWidth * 4) / 8} y={stageHeight / 2}>
              <Circle
                radius={radius * 1}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={stroke}
              />
              <Text
                x={radius * 5}
                y={stageHeight / 10}
                text={`bsh=j${
                  equip.bsh_pu.length > 0
                    ? parseFloat(equip.bsh_pu.replace(",", ".")) / 2
                    : ""
                }pu`}
                fontSize={radius * 4}
                fill={fill}
              />
              <Line points={[0, 0, 0, stageHeight / 8]} stroke={stroke}></Line>
              <Line
                points={[
                  -radius * 4,
                  stageHeight / 8,
                  radius * 4,
                  stageHeight / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  -radius * 4,
                  radius * 2 + stageHeight / 8,
                  radius * 4,
                  radius * 2 + stageHeight / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  0,
                  radius * 2 + stageHeight / 8,
                  0,
                  radius * 2 + (2 * stageHeight) / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  -radius * 4,
                  radius * 2 + (2 * stageHeight) / 8,
                  radius * 4,
                  radius * 2 + (2 * stageHeight) / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  -radius * 2,
                  radius * 3 + (2 * stageHeight) / 8,
                  radius * 2,
                  radius * 3 + (2 * stageHeight) / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  -radius,
                  radius * 4 + (2 * stageHeight) / 8,
                  radius,
                  radius * 4 + (2 * stageHeight) / 8,
                ]}
                stroke={stroke}
              ></Line>
            </Group>
            <Group x={(stageWidth * 4.8) / 8} y={-radius * 2 + stageHeight / 2}>
              <Text
                x={-4 * radius}
                y={-radius * 6}
                text={`${equip.r_pu}+j${equip.x_pu}pu`}
                fontSize={radius * 4}
                fill={fill}
              />
              <Rect
                width={radius * 12}
                height={radius * 4}
                stroke={stroke}
                fill={"#FFF"}
              ></Rect>
            </Group>
            {/* shunt */}
            <Group x={(stageWidth * 6) / 8} y={stageHeight / 2}>
              <Circle
                radius={radius * 1}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={stroke}
              />
              <Line points={[0, 0, 0, stageHeight / 8]} stroke={stroke}></Line>
              <Text
                x={radius * 5}
                y={stageHeight / 10}
                text={`bsh=j${
                  equip.bsh_pu.length > 0
                    ? parseFloat(equip.bsh_pu.replace(",", ".")) / 2
                    : ""
                }pu`}
                fontSize={radius * 4}
                fill={fill}
              />
              <Line
                points={[
                  -radius * 4,
                  stageHeight / 8,
                  radius * 4,
                  stageHeight / 8,
                ]}
                stroke={stroke}
              ></Line>

              <Line
                points={[
                  -radius * 4,
                  radius * 2 + stageHeight / 8,
                  radius * 4,
                  radius * 2 + stageHeight / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  0,
                  radius * 2 + stageHeight / 8,
                  0,
                  radius * 2 + (2 * stageHeight) / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  -radius * 4,
                  radius * 2 + (2 * stageHeight) / 8,
                  radius * 4,
                  radius * 2 + (2 * stageHeight) / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  -radius * 2,
                  radius * 3 + (2 * stageHeight) / 8,
                  radius * 2,
                  radius * 3 + (2 * stageHeight) / 8,
                ]}
                stroke={stroke}
              ></Line>
              <Line
                points={[
                  -radius,
                  radius * 4 + (2 * stageHeight) / 8,
                  radius,
                  radius * 4 + (2 * stageHeight) / 8,
                ]}
                stroke={stroke}
              ></Line>
            </Group>
            {/* m */}
            <Group x={(stageWidth * 7) / 8} y={stageHeight / 2}>
              <Text
                x={-2 * radius}
                y={-radius * 6}
                text={
                  Object.values(bars).filter(
                    (bar) => bar.name === equip.endPointB
                  )[0]?.id
                }
                fontStyle={"bold"}
                fontSize={radius * 4}
              />
              <Circle
                radius={radius * 2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={stroke}
              />
            </Group>
          </Layer>
        </Stage>
      )}
    </div>
  );
}
