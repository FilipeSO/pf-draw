import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Arrow } from "react-konva";
import { Group, Circle, Text } from "react-konva";
import { _SETTINGS } from "../../settings";
import { typeNumToStr } from "../../utils";

export default function BarPreview({ bar }) {
  const radius = _SETTINGS.BAR.radius || _SETTINGS.default.radius;
  const strokeWidth =
    _SETTINGS.BAR.strokeWidth || _SETTINGS.default.strokeWidth;
  const stroke = "#000"; //"#63b3ed";
  const fill = "#4299e1";

  // const v_polar = bar.v_pu + "∠" + bar.theta_deg;
  const v_polar = `[${typeNumToStr(bar.type)}] ${bar.v_pu}∠${bar.theta_deg}° ${
    bar.use_pu ? "pu" : "V"
  }`;
  const p_in = `P_in: ${bar.p_g} ${bar.use_pu ? "pu" : "MW"}`;
  const q_in = `Q_in: ${bar.q_g} ${bar.use_pu ? "pu" : "MVAr"}`;

  const p_out = `P_out: ${bar.p_c} ${bar.use_pu ? "pu" : "MW"}`;
  const q_out = `Q_out: ${bar.q_c} ${bar.use_pu ? "pu" : "MVAr"}`;

  const q_max = `Q_max: ${bar.q_max} ${bar.use_pu ? "pu" : "MW"}`;
  const q_min = `Q_min: ${bar.q_min} ${bar.use_pu ? "pu" : "MVAr"}`;

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
            <Group x={stageWidth / 2} y={16 + stageHeight / 2}>
              <Arrow
                points={[-100, 0, -radius * 2, 0]}
                stroke={stroke}
                strokeWidth={strokeWidth}
                // bezier={n > 1}
              />

              <Arrow
                points={[0, 0, 100, 0]}
                stroke={stroke}
                strokeWidth={strokeWidth}
                // bezier={n > 1}
              />
              <Text
                x={-radius * 6}
                y={-radius * 6}
                text={bar.id}
                fontStyle={"bold"}
                fontSize={radius * 4}
              />
              <Text
                x={-radius * 6}
                y={-radius * 12}
                text={v_polar}
                fontSize={radius * 4}
                fill={fill}
              />
              <Text
                x={-160}
                y={-radius * 6}
                text={p_in}
                fontSize={radius * 4}
                fill={fill}
              />
              <Text
                x={-160}
                y={radius * 3}
                text={q_in}
                fontSize={radius * 4}
                fill={fill}
              />
              <Text
                x={100}
                y={-radius * 6}
                text={p_out}
                fontSize={radius * 4}
                fill={fill}
              />
              <Text
                x={100}
                y={radius * 3}
                text={q_out}
                fontSize={radius * 4}
                fill={fill}
              />
              <Text
                x={-radius * 6}
                y={radius * 8}
                text={q_max}
                fontSize={radius * 4}
                fill={fill}
              />
              <Text
                x={-radius * 6}
                y={radius * 12}
                text={q_min}
                fontSize={radius * 4}
                fill={fill}
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
