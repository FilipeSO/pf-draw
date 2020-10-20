import React, { useState, useCallback } from "react";
import { getLinePoints, getAngle, parseTextFile } from "../utils";

const InputForms = ({ updateBars, updateEquips, bars, equips }) => {
  const stageHeight = 600;

  const [bar, setBar] = useState(null);
  const handleBarChange = (e) => {
    let newState = { ...bar, [e.target.name]: parseFloat(e.target.value) };
    setBar(newState);
  };
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
    updateBars(newState);
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
    updateEquips(newState);
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
    updateBars(fileEquips.bars);
    updateEquips(fileEquips.equips);
    console.log(fileEquips);
  };

  return (
    <>
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
    </>
  );
};
export default InputForms;
