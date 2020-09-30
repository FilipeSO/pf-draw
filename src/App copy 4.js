import React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { _BARS } from "./bars";
import { _EQUIPS } from "./equips.js";
import Transformer from "./components/Transformer";
import Generator from "./components/Generator";
import Bar from "./components/Bar";
import TransmissionLine from "./components/TransmissionLine";
import { getLinePoints, getDistance, getAngle } from "./utils";

export const App = () => {
  let rndBars = [];
  let orgEquips = [];

  const stageHeight = 600;
  const [bars, setBars] = useState(rndBars);
  const [equips, setEquips] = useState(orgEquips);
  //FALTA TRATAR TR E POSICAO DOS NODOS
  useEffect(() => {
    // preparar dados de barras
    let lastPos = {
      x:
        window.innerWidth * 0.2 +
        Math.floor(Math.random() * (window.innerWidth * 0.6)),
      y: stageHeight * 0.2 + Math.floor(Math.random() * stageHeight * 0.6),
    };

    for (let key in _BARS) {
      rndBars = {
        ...rndBars,
        [key]: {
          color: _BARS[key].color,
          pos: lastPos,
          type: _BARS[key].type,
          volt: _BARS[key].volt,
          potIn: _BARS[key].potIn,
          potOut: _BARS[key].potOut,
        },
      };

      lastPos = {
        x:
          lastPos.x +
          Math.cos(
            ((360 / Object.keys(_BARS).length) *
              Object.keys(rndBars).length *
              Math.PI) /
              180
          ) *
            400,
        y:
          lastPos.y +
          Math.sin(
            ((360 / Object.keys(_BARS).length) *
              Object.keys(rndBars).length *
              Math.PI) /
              180
          ) *
            400,
      };
      //preparar equipamentos conectados à barra
      let nodeEquips = _EQUIPS.filter((equip) => equip.endPointA === key);
      nodeEquips.forEach((nodeEquip) => {
        let equipName =
          nodeEquip.name || `LT_${nodeEquip.endPointA + nodeEquip.endPointB}`;
        if (nodeEquip.type === "LT") {
          orgEquips.push({
            ...nodeEquip,
            name: equipName,
            n: 1 + orgEquips.filter((equip) => equip.name === equipName).length,
          });
        } else if (nodeEquip.type === "UG") {
          let n = orgEquips.filter(
            (equip) => equip.type === "UG" && equip.endPointA === key
          ).length;
          let m = n >= 15 ? parseInt(n / 15) * 20 + 40 : 40;
          let degOffSet = 12 * parseInt(n / 15);
          let dx =
            Math.cos(((-90 + 24 * (n - 1) + degOffSet) * Math.PI) / 180) * m;
          let dy =
            Math.sin(((-90 + 24 * (n - 1) + degOffSet) * Math.PI) / 180) * m;

          orgEquips.push({
            ...nodeEquip,
            pos: {
              x: rndBars[nodeEquip.endPointA].pos.x + 100 + dx,
              y: rndBars[nodeEquip.endPointA].pos.y - 100 + dy,
            },
            n: 1 + n,
          });
        }
      });
    }

    //preparar transformadores
    for (let key in _BARS) {
      let nodeTR = _EQUIPS.filter(
        (equip) => equip.type === "TR" && equip.endPointA === key
      );
      nodeTR.forEach((TR) => {
        let n = orgEquips.filter(
          (equip) => equip.type === "TR" && equip.endPointA === key
        ).length;
        orgEquips.push({
          ...TR,
          pos: {
            x: (rndBars[TR.endPointB].pos.x + rndBars[TR.endPointA].pos.x) / 2,
            y: (rndBars[TR.endPointB].pos.y + rndBars[TR.endPointA].pos.y) / 2,
          },

          n: 1 + n,
        });
      });
    }

    setBars(rndBars);
    setEquips(orgEquips);
    console.log(equips);
  }, []);

  const stageRef = useRef(null);
  const scaleBy = 1.1;
  const handleWheelZoom = (e) => {
    e.evt.preventDefault();
    var oldScale = stageRef.current.scaleX();
    var pointer = stageRef.current.getPointerPosition();
    var mousePointTo = {
      x: (pointer.x - stageRef.current.x()) / oldScale,
      y: (pointer.y - stageRef.current.y()) / oldScale,
    };
    var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stageRef.current.scale({ x: newScale, y: newScale });
    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stageRef.current.position(newPos);
    stageRef.current.batchDraw();
  };

  const layerRef = useRef(null);
  // const handleDrag = (e) => {
  //   e.evt.preventDefault();
  //   let nodeName = e.target.attrs.name;
  //   // console.log(e.target);
  //   let newPos = e.currentTarget.position();
  //   layerRef.current.children
  //     .filter((element) => element.attrs.endPointA === nodeName)
  //     .forEach((line) => {
  //       let n = line.attrs.n;
  //       // let x1 = line.attrs.points.slice(0, 2)[0];
  //       // let y1 = line.attrs.points.slice(0, 2)[1];
  //       let x2 = line.attrs.points.slice(-2)[0];
  //       let y2 = line.attrs.points.slice(-2)[1];
  //       line.attrs.points = getLinePoints(newPos.x, newPos.y, x2, y2, n);
  //     });
  //   layerRef.current.children
  //     .filter((element) => element.attrs.endPointB === nodeName)
  //     .forEach((line) => {
  //       let n = line.attrs.n;
  //       let x1 = line.attrs.points.slice(0, 2)[0];
  //       let y1 = line.attrs.points.slice(0, 2)[1];
  //       // let x2 = line.attrs.points.slice(-2)[0];
  //       // let y2 = line.attrs.points.slice(-2)[1];
  //       line.attrs.points = getLinePoints(x1, y1, newPos.x, newPos.y, n);
  //     });
  //   layerRef.current.batchDraw();
  // };

  const handleDrag = (e) => {
    e.evt.preventDefault();
    //redesenha todas as linhas
    layerRef.current
      .getChildren((node) => node.getClassName() === "Line")
      .forEach((line) => {
        let newEndPointA = layerRef.current.children.filter(
          (element) => element.attrs.name === line.attrs.endPointA
        )[0].attrs;
        let newEndPointB = layerRef.current.children.filter(
          (element) => element.attrs.name === line.attrs.endPointB
        )[0].attrs;
        let n = line.attrs.n;
        line.attrs.points = getLinePoints(
          newEndPointA.x,
          newEndPointA.y,
          newEndPointB.x,
          newEndPointB.y,
          n
        );
      });
    layerRef.current.batchDraw();
  };

  return (
    <>
      <h1>POWER SYSTEM DRAW</h1>       
      <Stage
        width={window.innerWidth}
        height={stageHeight}
        onWheel={handleWheelZoom}
        draggable={true}
        ref={stageRef}
        style={{ border: "5px solid red", width: "100%" }}
      >
        <Layer ref={layerRef}>
          {equips.map((equip, index) => {
            switch (equip.type) {
              case "LT":
                return (
                  <TransmissionLine
                    key={index}
                    endPointA={equip.endPointA}
                    endPointB={equip.endPointB}
                    n={equip.n}
                    color={equip.color}
                    bars={bars}
                  />
                );
              case "TR":
                return (
                  <Transformer
                    key={index}
                    name={equip.name}
                    endPointA={equip.endPointA}
                    endPointA={equip.endPointB}
                    bars={bars}
                    x={equip.pos.x}
                    y={equip.pos.y}
                    handleDrag={handleDrag}
                  />
                );
              case "UG":
                return (
                  <Generator
                    key={index}
                    type={equip.type}
                    name={equip.name}
                    endPointA={equip.endPointA}
                    bars={bars}
                    x={equip.pos.x}
                    y={equip.pos.y}
                    handleDrag={handleDrag}
                  />
                );
              default:
                return null;
            }
          })}

          {Object.keys(bars).map((key, index) => (
            <Bar
              x={bars[key].pos.x}
              y={bars[key].pos.y}
              handleDrag={handleDrag}
              color={bars[key].color}
              key={index}
              name={key}
            />
          ))}
          {/* <Generator x={50} y={50} /> */}
          {/* <Transformer x={70} y={50} />
          <Bar x={90} y={50} color={"#000"} handleDrag={handleDrag} /> */}
        </Layer>
      </Stage>
    </>
  );
};

export default App;
