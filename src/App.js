import React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Group } from "react-konva";

import { _BARS } from "./ieee30bars_rev1";
import { _EQUIPS } from "./ieee30branches_rev1";

// import { _BARS } from "./bars";
// import { _EQUIPS } from "./equips";

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
      .filter((node) => node.attrs.type === "TR")
      .forEach((TR) => {
        // console.log(TR);
        let newEndPointA = layerRef.current.children.filter(
          (node) => node.attrs.name === TR.attrs.endPointA
        )[0].attrs;
        let newEndPointB = layerRef.current.children.filter(
          (node) => node.attrs.name === TR.attrs.endPointB
        )[0].attrs;
        let n = TR.attrs.n;
        // console.log(newEndPointA, newEndPointB);
        let x1 = newEndPointA.x;
        let y1 = newEndPointA.y;
        let x2 = newEndPointB.x;
        let y2 = newEndPointB.y;
        let newX = (x1 + x2) / 2;
        let newY = (y1 + y2) / 2;
        // console.log(newX, newY, n);

        if (n > 1) {
          let newPos = getLinePoints(x1, y1, x2, y2, n, 5, 100, 100);
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

    //redesenha todas as linhas
    layerRef.current
      .getChildren((node) => node.getClassName() === "Line")
      .forEach((line) => {
        // console.log("linha", line);
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
  const handleDragEnd = (e) => {
    e.evt.preventDefault();
    let barState = bars[e.target.attrs.name];
    let newState = {
      ...bars,
      [e.target.attrs.name]: {
        ...barState,
        pos: e.target.position(),
      },
    };
    // setBars(newState);
    newState = equips;
    layerRef.current.children
      .filter((node) => node.attrs.type === "TR")
      .forEach((TR) => {
        console.log(TR.attrs.name, TR.position());
        let equipState = equips[TR.attrs.name];
        equipState.pos = TR.position();
        newState = {
          ...equips,
          [TR.attrs.name]: {
            ...equipState,
          },
        };
      });
    console.log(newState);
    // setEquips(newState);
  };

  const [bar, setBar] = useState(null);

  const handleBarSubmit = (e) => {
    e.preventDefault();
    let position = {
      x:
        window.innerWidth * 0.2 +
        Math.floor(Math.random() * (window.innerWidth * 0.6)),
      y: stageHeight * 0.2 + Math.floor(Math.random() * stageHeight * 0.6),
    };

    let newState = {
      ...bars,
      [bar.numero]: {
        ...bar,
        pos: position,
      },
    };
    setBars(newState);
  };

  const handleBarChange = (e) => {
    let newState = { ...bar, [e.target.name]: parseFloat(e.target.value) };
    setBar(newState);
    console.log(equips);
  };

  const [equip, setEquip] = useState(null);
  const handleEquipChange = (e) => {
    let newState = { ...equip, [e.target.name]: e.target.value };
    setEquip(newState);
    // console.log(newState);
  };

  const handleEquipSubmit = (e) => {
    e.preventDefault();
    let equipName = `LT_${[equip.endPointA] + [equip.endPointB]}`;
    let lineN =
      Object.values(equips).filter((equip) => equip.name === equipName).length +
      1;
    let newState = {
      ...equips,
      [equipName + "_" + lineN]: {
        ...equip,
        type: "LT",
        name: equipName,
        n: lineN,
      },
    };
    // console.log(newState);
    setEquips(newState);
  };

  const [fileEquips, setFileEquips] = useState(null);
  const handleFileChange = (e) => {
    if (e.target.files === undefined) return;
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      var lines = reader.result.split(/[\r\n]+/g).filter((line) => line !== "");
      let [title, fileBars, fileEquips] = parseTextFile(lines);
      setFileEquips({
        title: title,
        bars: fileBars,
        equips: fileEquips,
      });
    };
    reader.readAsText(file);
    console.log(file);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    setBars(fileEquips.bars);
    setEquips(fileEquips.equips);
    console.log(fileEquips);
  };

  return (
    <>
      <h1>POWER SYSTEM DRAW</h1>  
      <div>
        <h2>ENTRADA FORMATO IT743A 2S2020</h2>
        <form onSubmit={handleFileSubmit}>
          <label>Arquívo:</label>
          <input type="file" onChange={handleFileChange}></input>
          <br />
          {fileEquips && (
            <p>
              Título:{fileEquips.title}, Barras:
              {Object.keys(fileEquips.bars).length}, Ramos:
              {Object.keys(fileEquips.equips).length} (LT:
              {
                Object.values(fileEquips.equips).filter(
                  (equip) => equip.type === "LT"
                ).length
              }{" "}
              TR:
              {
                Object.values(fileEquips.equips).filter(
                  (equip) => equip.type === "TR"
                ).length
              }
              )
            </p>
          )}

          <input type="submit" value="Adicionar"></input>
        </form>
      </div>
      <div>
        <h2>BARRA</h2>
        <form onSubmit={handleBarSubmit}>
          <label>Número:</label>
          <input type="text" name="numero" onChange={handleBarChange}></input>
          <br />
          <label>Identificação:</label>
          <input type="text" name="id" onChange={handleBarChange}></input>
          <br />
          <label>Tipo:</label>
          <select name="tipo" onChange={handleBarChange}>
            <option value="0">PQ</option>
            <option value="1">PV</option>
            <option value="2">Referência</option>
          </select>
          <br />
          <label>V [pu]:</label>
          <input type="text" name="v_pu" onChange={handleBarChange}></input>
          <br />
          <label>&theta; [deg]</label>
          <input
            type="text"
            name="theta_deg"
            onChange={handleBarChange}
          ></input>
          <br />
          <label>P gerada [MW]:</label>
          <input type="text" name="p_g" onChange={handleBarChange}></input>
          <label>Q gerada [MVar]:</label>
          <input type="text" name="q_g" onChange={handleBarChange}></input>
          <br />
          <label>P carga [MW]:</label>
          <input type="text" name="p_c" onChange={handleBarChange}></input>
          <label>Q carga [MVar]:</label>
          <input type="text" name="q_c" onChange={handleBarChange}></input>
          <br />
          <label>Q min [MVar]:</label>
          <input type="text" name="q_min" onChange={handleBarChange}></input>
          <label>Q max [MVar]:</label>
          <input type="text" name="q_max" onChange={handleBarChange}></input>
          <br />
          <input type="submit" value="Adicionar"></input>
        </form>
      </div>
           
      <div>
        <h2>RAMOS</h2>
        <form onSubmit={handleEquipSubmit}>
          <label>Origem:</label>
          <input
            type="text"
            name="endPointA"
            onChange={handleEquipChange}
          ></input>
          <br />
          <label>Destino:</label>
          <input
            type="text"
            name="endPointB"
            onChange={handleEquipChange}
          ></input>
          <br />
          <label>r [pu]:</label>
          <input type="text" name="r_pu" onChange={handleEquipChange}></input>
          <label>x [pu]:</label>
          <input type="text" name="x_pu" onChange={handleEquipChange}></input>
          <br />
          <label>tap linear:</label>
          <input type="text" name="tap" onChange={handleEquipChange}></input>
          <label>tap &phi; [deg]:</label>
          <input
            type="text"
            name="tap_def_def"
            onChange={handleEquipChange}
          ></input>
          <br />
          <label>tap min:</label>
          <input type="text" name="tap" onChange={handleEquipChange}></input>
          <label>tap max:</label>
          <input type="text" name="tap" onChange={handleEquipChange}></input>
          <br />
          <input type="submit" value="Adicionar"></input>
        </form>
      </div>
      <Stage
        width={window.innerWidth / 2}
        height={stageHeight}
        onWheel={handleWheelZoom}
        draggable={true}
        ref={stageRef}
        style={{ border: "5px solid red", width: window.innerWidth / 2 }}
      >
        <Layer ref={layerRef}>
          {Object.values(equips).map((equip, index) => {
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
              //REMOVIDO UG POR ENQUANTO
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
              //       transformer={equip.transformer}
              //       handleDrag={handleDrag}
              //     />
              //   );
              default:
                return null;
            }
          })}

          {Object.keys(bars).map((key, index) => (
            <Bar
              x={bars[key].pos.x}
              y={bars[key].pos.y}
              handleDrag={handleDrag}
              handleDragEnd={handleDragEnd}
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
