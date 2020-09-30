import React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Group } from "react-konva";
import { _BARS } from "./bars";
import { _EQUIPS } from "./equips.js";
import Transformer from "./components/Transformer";
import Generator from "./components/Generator";
import Bar from "./components/Bar";
import TransmissionLine from "./components/TransmissionLine";
import { getLinePoints, getAngle } from "./utils";

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
        let n =
          orgEquips.filter(
            (equip) => equip.type === "TR" && equip.endPointA === key
          ).length + 1;

        let x1 = rndBars[TR.endPointA].pos.x;
        let y1 = rndBars[TR.endPointA].pos.y;
        let x2 = rndBars[TR.endPointB].pos.x;
        let y2 = rndBars[TR.endPointB].pos.y;
        let newX = (x1 + x2) / 2;
        let newY = (y1 + y2) / 2;
        if (n > 1) {
          let newPos = getLinePoints(x1, y1, x2, y2, n, 15);
          newX = (newPos[2] + newPos[4]) / 2;
          newY = (newPos[3] + newPos[5]) / 2;
        }

        orgEquips.push({
          ...TR,
          pos: {
            x: newX,
            y: newY,
          },
          n: n,
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
  const handleDrag = (e) => {
    e.evt.preventDefault();

    //redesenha TRs
    layerRef.current.children
      .filter((element) => element.attrs.type === "TR")
      .forEach((TR) => {
        let newEndPointA = layerRef.current.children.filter(
          (node) => node.attrs.name === TR.attrs.endPointA
        )[0].attrs;
        let newEndPointB = layerRef.current.children.filter(
          (node) => node.attrs.name === TR.attrs.endPointB
        )[0].attrs;
        let n = TR.attrs.n;
        let x1 = newEndPointA.x;
        let y1 = newEndPointA.y;
        let x2 = newEndPointB.x;
        let y2 = newEndPointB.y;
        let newX = (x1 + x2) / 2;
        let newY = (y1 + y2) / 2;
        if (n > 1) {
          let newPos = getLinePoints(x1, y1, x2, y2, n, 15);
          newX = (newPos[2] + newPos[4]) / 2;
          newY = (newPos[3] + newPos[5]) / 2;
        }
        getAngle(x2 - x1, y2 - y1);
        TR.rotation(getAngle(x2 - x1, y2 - y1));
        TR.position({
          x: newX,
          y: newY,
        });
      });

    // layerRef.current
    //   .getChildren((node) => node.getClassName() === "Group")
    //   .forEach((node) => {
    //     node
    //       .getChildren((node) => node.getClassName() === "Line")
    //       .forEach((line) => {
    //         // console.log(line);
    //         let newEndPointA = layerRef.current.children.filter(
    //           (element) => element.attrs.name === line.attrs.endPointA
    //         )[0].attrs;
    //         let newEndPointB;
    //         layerRef.current
    //           .getChildren((node) => node.getClassName() === "Group")
    //           .forEach((node) =>
    //             node
    //               .getChildren((node) => node.getClassName() === "Group")
    //               .forEach((equip) => {
    //                 console.log(equip);
    //                 if (equip.getAttr("name") === line.attrs.endPointB) {
    //                   console.log(equip.position());
    //                   newEndPointB = {
    //                     x: equip.getAttr("x"),
    //                     y: equip.getAttr("y"),
    //                   };
    //                 }
    //               })
    //           );

    //         // console.log(newEndPointB);
    //         let n = line.attrs.n;
    //         // line.attrs.points = getLinePoints(
    //         //   newEndPointA.x,
    //         //   newEndPointA.y,
    //         //   line.attrs.points[2],
    //         //   line.attrs.points[3],
    //         //   n
    //         // );

    //         line.attrs.points = getLinePoints(
    //           newEndPointA.x,
    //           newEndPointA.y,
    //           newEndPointB.x,
    //           newEndPointB.y,
    //           n
    //         );
    //       });
    //   });

    //redesenha todas as linhas
    layerRef.current
      .getChildren((node) => node.getClassName() === "Line")
      .forEach((line) => {
        // console.log(line);
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
                    endPointB={equip.endPointB}
                    bars={bars}
                    x={equip.pos.x}
                    y={equip.pos.y}
                    n={equip.n}
                    handleDrag={handleDrag}
                  />
                );
              // case "UG":
              //   return (
              //     <Generator
              //       key={index}
              //       type={equip.type}
              //       name={equip.name}
              //       endPointA={equip.endPointA}
              //       bars={bars}
              //       x={equip.pos.x}
              //       y={equip.pos.y}
              //       handleDrag={handleDrag}
              //     />
              //   );
              default:
                return null;
            }
          })}

          {Object.keys(bars).map((key, index) => (
            <Group
              key={index}
              draggable={true}
              onDragMove={(e) => handleDrag(e)}
            >
              {equips
                .filter(
                  (equip) => equip.endPointA === key && equip.type === "UG"
                )
                .map((equip, index) => {
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
                })}
            </Group>
          ))}
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
        </Layer>
      </Stage>
    </>
  );
};

export default App;
