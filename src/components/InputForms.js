import React, { useState } from "react";
import { parseTextFile, parseCSVFile } from "../utils";

const InputForms = ({
  updateBars,
  updateEquips,
  bars,
  equips,
  updateTitle,
}) => {
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
    if (e.target.files !== undefined) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        var lines = reader.result
          .split(/[\r\n]+/g)
          .filter((line) => line !== "");
        let [title, parsedBars, parsedEquips] = parseTextFile(lines);
        setFileEquips({
          file: file,
          title: title,
          bars: parsedBars,
          equips: parsedEquips,
        });
      };
      reader.readAsText(file);
    }
    // console.log(file);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    updateBars([]);
    updateEquips([]);
    let bar_placement = e.target[1].value;
    var reader = new FileReader();
    reader.onloadend = function () {
      var lines = reader.result.split(/[\r\n]+/g).filter((line) => line !== "");
      let [title, parsedBars, parsedEquips] = parseTextFile(
        lines,
        bar_placement
      );

      updateBars(parsedBars);
      updateEquips(parsedEquips);
      updateTitle(title);
      setFileEquips(null);
    };
    reader.readAsText(fileEquips.file);
    e.target.reset();
    //

    // console.log(fileEquips);
  };

  const [fileCSVEquips, setFileCSVEquips] = useState(null);
  const handleCSVChange = (e) => {
    if (e.target.files !== undefined) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        var lines = reader.result
          .split(/[\r\n]+/g)
          .filter((line) => line.split(";")[0] !== "");
        let [title, parsedBars, parsedEquips] = parseCSVFile(lines);
        setFileCSVEquips({
          file: file,
          title: title,
          bars: parsedBars,
          equips: parsedEquips,
        });
      };
      reader.readAsText(file);
    }
    // console.log(file);
  };

  const handleCSVSubmit = (e) => {
    e.preventDefault();
    updateBars([]);
    updateEquips([]);
    let bar_placement = e.target[1].value;
    var reader = new FileReader();
    reader.onloadend = function () {
      var lines = reader.result
        .split(/[\r\n]+/g)
        .filter((line) => line.split(";")[0] !== "");
      let [title, parsedBars, parsedEquips] = parseCSVFile(
        lines,
        bar_placement
      );
      updateBars(parsedBars);
      updateEquips(parsedEquips);
      updateTitle(title);

      setFileCSVEquips(null);
    };
    reader.readAsText(fileCSVEquips.file);
    e.target.reset();
    //

    // console.log(fileEquips);
  };

  return (
    <div>
      <div>
        <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
          ENTRADA FORMATO IT743A 2S2020
        </h2>
        <form onSubmit={handleFileSubmit}>
          <div className="md:flex md:items-center">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Arquívo:
            </label>
            <input
              className="w-full md:flex-1 cursor-pointer shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              type="file"
              onChange={handleFileChange}
            ></input>
            <a
              className="text-center ml-2 block text-blue-700 text-sm font-bold"
              target="_blank"
              rel="noreferrer noopener"
              href="/ieee30buses.txt"
            >
              entrada padrão
            </a>
          </div>
          {fileEquips && (
            <div>
              <div className="flex items-center mt-2">
                <label className="text-gray-700 text-sm font-bold mr-2">
                  Disposição de Barras:
                </label>
                <select
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  name="bar_placement"
                >
                  <option value="circle">Circular</option>
                  <option value="random">Aleatório</option>
                </select>
              </div>
              <div className="flex">
                <input
                  className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
                  type="submit"
                  value={
                    fileEquips &&
                    "Adicionar Título:" +
                      fileEquips.title +
                      ", Barras:" +
                      Object.keys(fileEquips.bars).length +
                      ", Ramos:" +
                      Object.keys(fileEquips.equips).length +
                      " (LT:" +
                      Object.values(fileEquips.equips).filter(
                        (equip) => equip.type === "LT"
                      ).length +
                      " TR:" +
                      Object.values(fileEquips.equips).filter(
                        (equip) => equip.type === "TR"
                      ).length +
                      ")"
                  }
                ></input>
              </div>
            </div>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
          ENTRADA FORMATO CSV
        </h2>
        <form onSubmit={handleCSVSubmit}>
          <div className="md:flex md:items-center">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Arquívo:
            </label>
            <input
              className="w-full md:flex-1 cursor-pointer shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              type="file"
              onChange={handleCSVChange}
            ></input>
            <a
              className="text-center ml-2 block text-blue-700 text-sm font-bold"
              target="_blank"
              rel="noreferrer noopener"
              href="/input.csv"
            >
              entrada padrão
            </a>
          </div>
          {fileCSVEquips && (
            <div>
              <div className="flex items-center mt-2">
                <label className="text-gray-700 text-sm font-bold mr-2">
                  Disposição de Barras:
                </label>
                <select
                  className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  name="bar_placement"
                >
                  <option value="circle">Circular</option>
                  <option value="random">Aleatório</option>
                </select>
              </div>
              <div className="flex">
                <input
                  className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
                  type="submit"
                  value={
                    fileCSVEquips &&
                    "Adicionar Título:" +
                      fileCSVEquips.title +
                      ", Barras:" +
                      Object.keys(fileCSVEquips.bars).length +
                      ", Ramos:" +
                      Object.keys(fileCSVEquips.equips).length +
                      " (LT:" +
                      Object.values(fileCSVEquips.equips).filter(
                        (equip) => equip.type === "LT"
                      ).length +
                      " TR:" +
                      Object.values(fileCSVEquips.equips).filter(
                        (equip) => equip.type === "TR"
                      ).length +
                      ")"
                  }
                ></input>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="lg:flex lg:space-x-4">
        <div className="lg:w-1/2">
          <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
            ENTRADA MANUAL BARRA
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
                value="Adicionar Barra"
              ></input>
            </div>
          </form>
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
            ENTRADA MANUAL RAMOS
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

            <div className="md:flex items-center mt-2">
              <div className="flex items-center md:w-1/3">
                <label className="text-gray-700 text-sm font-bold mr-2">
                  r [pu]:
                </label>
                <input
                  className="w-full shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="r_pu"
                  onChange={handleEquipChange}
                ></input>
              </div>
              <div className="flex items-center md:w-1/3 md:mt-0 mt-2">
                <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                  x [pu]:
                </label>
                <input
                  className="w-full shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="x_pu"
                  onChange={handleEquipChange}
                ></input>
              </div>

              <div className="flex items-center md:w-1/3 md:mt-0 mt-2">
                <label className="md:ml-2 text-gray-700 text-sm font-bold mr-2">
                  bsh (total) [pu]:
                </label>
                <input
                  className="w-full shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
                  type="text"
                  name="bsh_pu"
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
                value="Adicionar Ramo"
              ></input>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default InputForms;
