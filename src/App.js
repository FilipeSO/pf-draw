import React from "react";
import { useState, useEffect } from "react";

import DrawCanvas from "./components/DrawCanvas";
import InputForms from "./components/InputForms";
import { parseTextFile } from "./utils";

export const App = () => {
  let rndBars = [];
  let orgEquips = [];
  const [bars, setBars] = useState(rndBars);
  const [equips, setEquips] = useState(orgEquips);
  const [title, setTitle] = useState("");
  useEffect(() => {
    fetch("/ieee30buses.txt")
      .then((result) => result.text())
      .then((text) => {
        var lines = text.split(/[\r\n]+/g).filter((line) => line !== "");
        let [title, fileBars, fileEquips] = parseTextFile(lines);
        setTitle(title);
        setBars(fileBars);
        setEquips(fileEquips);
      });
  }, []);

  const updateBars = (newState) => {
    setBars(newState);
  };

  const updateEquips = (newState) => {
    setEquips(newState);
  };

  return (
    <div>
      <a
        className="hidden lg:block"
        target="_blank"
        rel="noreferrer noopener"
        href="https://github.com/FilipeSO/pf-draw"
      >
        <img
          style={{ position: "absolute", top: 0, right: 0, border: 0 }}
          src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
          alt="Fork me on GitHub"
        />
      </a>
      <div className="bg-gray-700">
        <h1 className="text-white text-4xl font-bold text-center">
          POWER FLOW DRAW
        </h1>
      </div>
      <div className="container mx-auto px-2 md:px-0">
        <InputForms
          updateBars={updateBars}
          bars={bars}
          updateEquips={updateEquips}
          equips={equips}
        ></InputForms>
        <h2 className="text-lg font-bold mt-4 text-center text-gray-800">
          CONFIGURAÇÕES
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("ainda não implementado");
          }}
        >
          <div className="flex items-center mt-2">
            <label className="text-gray-700 text-sm font-bold mr-2">
              Solver:
            </label>
            <select
              className="flex-1 shadow border rounded py-1 px-1 text-gray-700 focus:outline-none focus:shadow-outline"
              name="solver"
            >
              <option value="0">Newton-Raphson</option>
              <option value="1">Desacoplado Rápido</option>
            </select>
          </div>
          <div className="flex">
            <input
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md mt-1 cursor-pointer"
              type="submit"
              value="Calcular"
            ></input>
          </div>
        </form>
        <h1 className="text-xl font-bold mt-4 text-center text-gray-800">
          Título:{title}, Barras:
          {Object.keys(bars).length}, Ramos:
          {Object.keys(equips).length} (LT:
          {
            Object.values(equips).filter((equip) => equip.type === "LT").length
          }{" "}
          TR:
          {Object.values(equips).filter((equip) => equip.type === "TR").length})
        </h1>
      </div>
      <DrawCanvas
        updateBars={updateBars}
        bars={bars}
        updateEquips={updateEquips}
        equips={equips}
      ></DrawCanvas>
    </div>
  );
};

export default App;
