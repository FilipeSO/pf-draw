import React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Circle, Line, Group, Text } from "react-konva";
import { _BARS } from "./bars";
import { _EQUIPS } from "./equips.js";
import Transformer from "./components/Transformer";
import Generator from "./components/Generator";
import Bar from "./components/Bar";
import TransmissionLine from "./components/TransmissionLine";

export const App = () => {
  let rndNodes = [];
  let orgEquips = [];
  let orgUGS = [];

  const stageHeight = 600;
  const [nodes, setNodes] = useState(rndNodes);
  const [equips, setEquips] = useState(orgEquips);

  useEffect(() => {
    // preparar dados de barras
    for (let key in _BARS) {
      rndNodes = {
        ...rndNodes,
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
    setNodes(rndNodes);
    // preparar dados equipamentos
    for (var i = 0; i < _EQUIPS.length; i++) {
      let equipName =
        _EQUIPS[i].name || `LT_${_EQUIPS[i].endPointA + _EQUIPS[i].endPointB}`;

      if (_EQUIPS[i].type === "UG") {
        rndNodes = {
          ...rndNodes,
          [_EQUIPS[i].name]: {
            ..._EQUIPS[i],
            pos: {
              x:
                window.innerWidth * 0.2 +
                Math.floor(Math.random() * (window.innerWidth * 0.6)),
              y:
                stageHeight * 0.2 +
                Math.floor(Math.random() * stageHeight * 0.6),
            },
          },
        };
      }

      // switch (_EQUIPS[i].type) {
      //   case "LT":
      //     equipName = `LT_${_EQUIPS[i].endPointA + _EQUIPS[i].endPointB}`;
      //     break;
      //   case "UG":
      //     equipName = `UG_${_EQUIPS[i].endPointA}`;
      //     break;
      //   case "TR":
      //     equipName = `TR_${_EQUIPS[i].endPointA + _EQUIPS[i].endPointB}`;
      //     break;
      //   default:
      //     break;
      // }
      console.log(equipName);
      equips.push({
        ..._EQUIPS[i],
        name: equipName,
        n: 1 + equips.filter((equip) => equip.name === equipName).length,
      });
    }
    setNodes(rndNodes);
    setEquips(orgEquips);
    console.log(rndNodes);
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
    let newState = {
      ...nodes,
      [e.target.attrs.name]: {
        ...nodes[e.target.attrs.name],
        pos: e.currentTarget.position(),
      },
    };
    setNodes(newState);
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
                return <TransmissionLine key={index} {...equip} bars={nodes} />;
              case "TR":
                return <Transformer key={index} {...equip} bars={nodes} />;
              case "UG":
                return (
                  <Generator
                    key={index}
                    {...equip}
                    bars={nodes}
                    handleDrag={handleDrag}
                  />
                );
              default:
                return null;
            }
          })}

          {Object.keys(nodes).map((key, index) => (
            <Bar
              x={nodes[key].pos.x}
              y={nodes[key].pos.y}
              handleDrag={handleDrag}
              color={nodes[key].color}
              key={index}
              name={key}
            />
          ))}
          {/* 
          {Object.keys(ugs).map((key, index) => (
            <Generator
              x1={ugs[key].pos.x}
              y1={ugs[key].pos.y}
              x2={nodes[ugs[key].endPointA].pos.x}
              y2={nodes[ugs[key].endPointA].pos.y}
              key={index}
              handleDrag={handleDrag}
            />
          ))} */}

          {/* <Generator x={50} y={50} /> */}
          <Transformer x={70} y={50} />
          <Bar x={90} y={50} color={"#000"} handleDrag={handleDrag} />
        </Layer>
      </Stage>
    </>
  );
};

export default App;
