import React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Group } from "react-konva";

import { _BARS } from "./ieee30bars_rev1";
import { _EQUIPS } from "./ieee30branches_rev1";

// import { _BARS } from "./bars";
// import { _EQUIPS } from "./equips";

import DrawCanvas from "./components/DrawCanvas";
import InputForms from "./components/InputForms";

import Transformer from "./components/Transformer";
import Generator from "./components/Generator";
import Bar from "./components/Bar";
import TransmissionLine from "./components/TransmissionLine";
import { getLinePoints, getAngle, parseTextFile } from "./utils";

export const App = () => {
  let rndBars = [];
  let orgEquips = [];

  const stageHeight = 600;
  const [bars, setBars] = useState(rndBars);
  const [equips, setEquips] = useState(orgEquips);

  useEffect(() => {
    // preparar dados de barras
    let lastPos = {
      x:
        (window.innerWidth / 2) * 0.2 +
        Math.floor(Math.random() * ((window.innerWidth / 2) * 0.6)),
      y:
        (stageHeight / 2) * 0.2 +
        Math.floor(Math.random() * (stageHeight / 2) * 0.6),
    };

    for (let key in _BARS) {
      rndBars = {
        ...rndBars,
        [key]: {
          ..._BARS[key],
          pos: lastPos,
          name: key,
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
            50,
        y:
          lastPos.y +
          Math.sin(
            ((360 / Object.keys(_BARS).length) *
              Object.keys(rndBars).length *
              Math.PI) /
              180
          ) *
            50,
      };
      //preparar equipamentos conectados à barra
      let nodeEquips = _EQUIPS.filter((equip) => equip.endPointA === key);
      nodeEquips.forEach((nodeEquip) => {
        if (nodeEquip.type === "LT") {
          let equipName =
            nodeEquip.name || `LT_${nodeEquip.endPointA + nodeEquip.endPointB}`;
          let lineN =
            Object.values(orgEquips).filter((equip) => equip.name === equipName)
              .length + 1;
          orgEquips = {
            ...orgEquips,
            [equipName + "_" + lineN]: {
              ...nodeEquip,
              name: equipName,
              n: lineN,
            },
          };
        } else if (nodeEquip.type === "UG") {
          let n =
            Object.values(orgEquips).filter(
              (equip) => equip.type === "UG" && equip.endPointA === key
            ).length + 1;
          let m = n >= 15 ? parseInt(n / 15) * 20 + 40 : 40;
          let degOffSet = 12 * parseInt(n / 15);
          let dx =
            Math.cos(((-90 + 24 * (n - 1) + degOffSet) * Math.PI) / 180) * m;
          let dy =
            Math.sin(((-90 + 24 * (n - 1) + degOffSet) * Math.PI) / 180) * m;

          orgEquips = {
            ...orgEquips,
            [nodeEquip.name]: {
              ...nodeEquip,
              pos: {
                x: rndBars[nodeEquip.endPointA].pos.x + 100 + dx,
                y: rndBars[nodeEquip.endPointA].pos.y - 100 + dy,
              },
              n: n,
              transformer: nodeEquip.transformer || false,
            },
          };
        }
      });
    }
    // console.log(orgEquips);
    // preparar transformadores
    for (let key in _BARS) {
      let nodeTR = _EQUIPS.filter(
        (equip) => equip.type === "TR" && equip.endPointA === key
      );
      nodeTR.forEach((TR) => {
        let n =
          Object.values(orgEquips).filter(
            (equip) => equip.type === "TR" && equip.endPointA === key
          ).length + 1;
        let endPointA = rndBars[TR.endPointA] || orgEquips[TR.endPointA];
        let endPointB = rndBars[TR.endPointB] || orgEquips[TR.endPointB];
        let x1 = endPointA.pos.x;
        let y1 = endPointA.pos.y;
        let x2 = endPointB.pos.x;
        let y2 = endPointB.pos.y;
        let newX = (x1 + x2) / 2;
        let newY = (y1 + y2) / 2;
        if (n > 1) {
          let newPos = getLinePoints(x1, y1, x2, y2, n, 5, 100, 100);
          newX = (newPos[2] + newPos[4]) / 2;
          newY = (newPos[3] + newPos[5]) / 2;
        }
        orgEquips = {
          ...orgEquips,
          [TR.name]: {
            ...TR,
            pos: {
              x: newX,
              y: newY,
            },
            n: n,
          },
        };
      });
    }

    setBars(rndBars);
    setEquips(orgEquips);
    // console.log(orgEquips);
  }, []);

  const updateBars = (newState) => {
    setBars(newState);
  };

  const updateEquips = (newState) => {
    setEquips(newState);
  };

  return (
    <>
      <h1>POWER SYSTEM DRAW</h1>  
      <InputForms
        updateBars={updateBars}
        bars={bars}
        updateEquips={updateEquips}
        equips={equips}
      ></InputForms>
      <DrawCanvas
        updateBars={updateBars}
        bars={bars}
        updateEquips={updateEquips}
        equips={equips}
      ></DrawCanvas>
    </>
  );
};

export default App;
