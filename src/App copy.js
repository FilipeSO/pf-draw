import React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { _BARS } from "./bars";
import { _EQUIPS } from "./equips.js";
import Transformer from "./components/Transformer";
import Generator from "./components/Generator";
import Bar from "./components/Bar";
import TransmissionLine from "./components/TransmissionLine";

export const App = () => {
  let rndBars = [];
  let orgEquips = [];
  let orgUGS = [];

  const stageHeight = 600;
  const [bars, setBars] = useState(rndBars);
  const [equips, setEquips] = useState(orgEquips);
  const [ugs, setUGS] = useState(orgUGS);
  //FALTA TRATAR TR E POSICAO DOS NODOS
  useEffect(() => {
    // preparar dados de barras
    for (let key in _BARS) {
      // console.log(key);
      rndBars = {
        ...rndBars,
        [key]: {
          color: _BARS[key].color,
          pos: {
            x:
              window.innerWidth * 0.2 +
              Math.floor(Math.random() * (window.innerWidth * 0.6)),
            y:
              stageHeight * 0.2 + Math.floor(Math.random() * stageHeight * 0.6),
          },
          type: _BARS[key].type,
          volt: _BARS[key].volt,
          potIn: _BARS[key].potIn,
          potOut: _BARS[key].potOut,
        },
      };
    }
    setBars(rndBars);
    var counts = {};
    _EQUIPS.forEach((equip) => {
      counts[equip.endPointA] = (counts[equip.endPointA] || 0) + 1;
    });
    console.log(counts);

    // preparar dados equipamentos
    for (var i = 0; i < _EQUIPS.length; i++) {
      let equipName =
        _EQUIPS[i].name || `LT_${_EQUIPS[i].endPointA + _EQUIPS[i].endPointB}`;

      if (_EQUIPS[i].type === "UG") {
        let ugNumber =
          1 +
          Object.values(orgUGS).filter(
            (ug) => ug.endPointA === _EQUIPS[i].endPointA
          ).length;
        let dx = Math.cos(((90 + 25 * (ugNumber - 1)) * Math.PI) / 180) * 40;
        let dy = Math.sin(((90 + 25 * (ugNumber - 1)) * Math.PI) / 180) * 40;

        // var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        // console.log(Object.values(orgUGS).filter((ug) => ug.endPointA === "A"));
        orgUGS = {
          ...orgUGS,
          [_EQUIPS[i].name]: {
            ..._EQUIPS[i],
            pos: {
              x: rndBars[_EQUIPS[i].endPointA].pos.x + dx,
              y: rndBars[_EQUIPS[i].endPointA].pos.y + dy,
            },
            n: ugNumber,
          },
        };
      }
      equips.push({
        ..._EQUIPS[i],
        name: equipName,
        n: 1 + equips.filter((equip) => equip.name === equipName).length,
      });
    }
    setEquips(orgEquips);
    setUGS(orgUGS);
    // console.log(orgUGS);
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

  const handleDrag = (e) => {
    let newState;
    if (e.target.attrs.type === "UG") {
      newState = {
        ...ugs,
        [e.target.attrs.name]: {
          ...ugs[e.target.attrs.name],
          pos: e.currentTarget.position(),
        },
      };
      // console.log(newState);
      setUGS(newState);
    } else {
      newState = {
        ...bars,
        [e.target.attrs.name]: {
          ...bars[e.target.attrs.name],
          pos: e.currentTarget.position(),
        },
      };
      setBars(newState);
    }
  };

  // const canvas = document.createElement("canvas");
  // const ctx = canvas.getContext("2d");
  // let gradient = ctx.createLinearGradient(
  //   bars[indexA].pos.x,
  //   bars[indexA].pos.y,
  //   bars[indexB].pos.x,
  //   bars[indexB].pos.y
  // );
  // gradient.addColorStop(0.0, bars[indexA].color);
  // gradient.addColorStop(1.0, bars[indexB].color);

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
        <Layer>
          {equips.map((equip, index) => {
            switch (equip.type) {
              case "LT":
                return <TransmissionLine key={index} {...equip} bars={bars} />;
              case "TR":
                return <Transformer key={index} {...equip} bars={bars} />;
              // case "UG":
              //   return (
              //     <Generator
              //       key={index}
              //       {...equip}
              //       bars={bars}
              //       handleDrag={handleDrag}
              //     />
              //   );
              default:
                return null;
            }
          })}

          {Object.keys(ugs).map((key, index) => (
            <Generator
              {...ugs[key]}
              x1={ugs[key].pos.x}
              y1={ugs[key].pos.y}
              x2={bars[ugs[key].endPointA].pos.x}
              y2={bars[ugs[key].endPointA].pos.y}
              key={index}
              handleDrag={handleDrag}
            />
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
          {/* <Generator x={50} y={50} /> */}
          <Transformer x={70} y={50} />
          <Bar x={90} y={50} color={"#000"} handleDrag={handleDrag} />
        </Layer>
      </Stage>
    </>
  );
};

export default App;
