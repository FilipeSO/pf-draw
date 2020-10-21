import React, { useState } from "react";
import { parseTextFile } from "../utils";

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
    // console.log(file);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    updateBars(fileEquips.bars);
    updateEquips(fileEquips.equips);
    // console.log(fileEquips);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
        ENTRADA FORMATO IT743A 2S2020
      </h2>

      <form onSubmit={handleFileSubmit}>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">
            Arquívo:
          </label>
          <input
            className="flex-1 cursor-pointer shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
            type="file"
            onChange={handleFileChange}
          ></input>
          <a
            className="ml-2 block text-blue-700 text-sm font-bold"
            target="_blank"
            rel="noreferrer noopener"
            href="/ieee30buses.txt"
          >
            entrada padrão
          </a>
        </div>
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
        <div className="flex">
          <input
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
            type="submit"
            value="Adicionar"
          ></input>
        </div>
      </form>
      <div>
        <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
          BARRA
        </h2>
        <form onSubmit={handleBarSubmit}>
          <div className="flex items-center">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Número:
            </label>
            <input
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              type="text"
              name="numero"
              onChange={handleBarChange}
            ></input>
          </div>

          <div className="flex items-center mt-2">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Identificação:
            </label>
            <input
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              type="text"
              name="id"
              onChange={handleBarChange}
            ></input>
          </div>

          <div className="flex items-center mt-2">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Tipo:
            </label>
            <select
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              name="tipo"
              onChange={handleBarChange}
            >
              <option value="0">PQ</option>
              <option value="1">PV</option>
              <option value="2">Referência</option>
            </select>
          </div>
          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                V [pu]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="v_pu"
                onChange={handleBarChange}
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                &theta; [deg]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="theta_deg"
                onChange={handleBarChange}
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                P gerada [MW]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="p_g"
                onChange={handleBarChange}
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                Q gerada [MVar]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="q_g"
                onChange={handleBarChange}
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                P carga [MW]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="p_c"
                onChange={handleBarChange}
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                Q carga [MVar]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="q_c"
                onChange={handleBarChange}
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                Q min [MVar]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="q_min"
                onChange={handleBarChange}
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                Q max [MVar]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="q_max"
                onChange={handleBarChange}
              ></input>
            </div>
          </div>
          <div className="flex">
            <input
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
              type="submit"
              value="Adicionar"
            ></input>
          </div>
        </form>
      </div>
      <div>
        <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
          RAMOS
        </h2>
        <form onSubmit={handleEquipSubmit}>
          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                Origem:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="endPointA"
                onChange={handleEquipChange}
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                Destino:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="endPointB"
                onChange={handleEquipChange}
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                r [pu]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="r_pu"
                onChange={handleEquipChange}
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                x [pu]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="x_pu"
                onChange={handleEquipChange}
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                tap linear:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="tap"
                onChange={handleEquipChange}
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                tap &phi; [deg]:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="tap_df_deg"
                onChange={handleEquipChange}
              ></input>
            </div>
          </div>

          <div className="md:flex md: items-center mt-2">
            <div className="flex items-center md:w-1/2">
              <label className="text-gray-700 text-sm font-bold mr-2">
                tap min:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="tap_min"
                onChange={handleEquipChange}
              ></input>
            </div>
            <div className="flex items-center md:w-1/2 md:mt-0 mt-2">
              <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                tap max:
              </label>
              <input
                className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                type="text"
                name="tap_max"
                onChange={handleEquipChange}
              ></input>
            </div>
          </div>
          <div className="flex">
            <input
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
              type="submit"
              value="Adicionar"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};
export default InputForms;
