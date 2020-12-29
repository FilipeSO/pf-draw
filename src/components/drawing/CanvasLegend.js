import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { Group, Circle, Rect, Text } from "react-konva";
import { _SETTINGS } from "../../settings";
import { getBarColor } from "../../utils";

export default function CanvasLegend() {
  const radius = _SETTINGS.BAR.radius || _SETTINGS.default.radius;
  const strokeWidth =
    _SETTINGS.BAR.strokeWidth || _SETTINGS.default.strokeWidth;
  const stroke = "#000";

  const [canvasReady, setCanvasReady] = useState(false);
  const drawCanvasRef = useRef(null);
  useEffect(() => {
    setCanvasReady(true); //necessario para drawcanvasref != undefined
  }, []);
  const stageHeight = drawCanvasRef.current?.clientHeight;
  const stageWidth = drawCanvasRef.current?.clientWidth;

  return (
    <div className="absolute bottom-0 right-0 h-32 w-1/3" ref={drawCanvasRef}>
      {canvasReady && (
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {/* SE */}
            <Group x={stageWidth / 8} y={(3 * stageHeight) / 8}>
              <Text
                x={radius * 4}
                y={-1.25 * radius}
                text={"Barra da Subestação"}
                fontSize={radius * 3}
              />
              <Circle
                radius={radius * 2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill={stroke}
              />
            </Group>
            {/* TR */}
            <Group x={stageWidth / 8} y={(5 * stageHeight) / 8}>
              <Text
                x={radius * 4}
                y={-1.25 * radius}
                text={"Transformador"}
                fontSize={radius * 3}
              />
              <Circle
                x={(-4 * radius) / 3}
                radius={radius * 2}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <Circle
                x={(4 * radius) / 3}
                radius={radius * 2}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            </Group>
            {/* case v_base >= 750: */}
            <Group x={(4.5 * stageWidth) / 8} y={stageHeight / 8}>
              <Text
                x={radius * 8}
                y={-radius}
                text={"V_base≥750kV"}
                fontSize={radius * 3}
              />
              <Rect
                width={radius * 6}
                height={radius}
                fill={getBarColor("765")}
                strokeWidth={strokeWidth}
              />
            </Group>
            {/* case v_base >= 500 && v_base < 750: */}
            <Group x={(4.5 * stageWidth) / 8} y={(2 * stageHeight) / 8}>
              <Text
                x={radius * 8}
                y={-radius}
                text={"500kV≤V_base<750kV"}
                fontSize={radius * 3}
              />
              <Rect
                width={radius * 6}
                height={radius}
                fill={getBarColor("550")}
                strokeWidth={strokeWidth}
              />
            </Group>
            {/* case v_base >= 440 && v_base < 500: */}
            <Group x={(4.5 * stageWidth) / 8} y={(3 * stageHeight) / 8}>
              <Text
                x={radius * 8}
                y={-radius}
                text={"440kV≤V_base<500kV"}
                fontSize={radius * 3}
              />
              <Rect
                width={radius * 6}
                height={radius}
                fill={getBarColor("440")}
                strokeWidth={strokeWidth}
              />
            </Group>
            {/* case v_base >= 345 && v_base < 440: */}
            <Group x={(4.5 * stageWidth) / 8} y={(4 * stageHeight) / 8}>
              <Text
                x={radius * 8}
                y={-radius}
                text={"345kV≤V_base<440kV"}
                fontSize={radius * 3}
              />
              <Rect
                width={radius * 6}
                height={radius}
                fill={getBarColor("345")}
                strokeWidth={strokeWidth}
              />
            </Group>

            {/* case v_base >= 230 && v_base < 345: */}
            <Group x={(4.5 * stageWidth) / 8} y={(5 * stageHeight) / 8}>
              <Text
                x={radius * 8}
                y={-radius}
                text={"230kV≤V_base<345kV"}
                fontSize={radius * 3}
              />
              <Rect
                width={radius * 6}
                height={radius}
                fill={getBarColor("230")}
                strokeWidth={strokeWidth}
              />
            </Group>

            {/* case v_base >= 138 && v_base < 230: */}
            <Group x={(4.5 * stageWidth) / 8} y={(6 * stageHeight) / 8}>
              <Text
                x={radius * 8}
                y={-radius}
                text={"138kV≤V_base<230kV"}
                fontSize={radius * 3}
              />
              <Rect
                width={radius * 6}
                height={radius}
                fill={getBarColor("138")}
                strokeWidth={strokeWidth}
              />
            </Group>

            {/* case v_base < 138 */}
            <Group x={(4.5 * stageWidth) / 8} y={(7 * stageHeight) / 8}>
              <Text
                x={radius * 8}
                y={-radius}
                text={"V_base<138kV"}
                fontSize={radius * 3}
              />
              <Rect
                width={radius * 6}
                height={radius}
                fill={getBarColor("69")}
                strokeWidth={strokeWidth}
              />
            </Group>
          </Layer>
        </Stage>
      )}
    </div>
  );
}
