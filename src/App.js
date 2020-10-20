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
    <>
      <h1>POWER FLOW DRAW</h1>  
      <InputForms
        updateBars={updateBars}
        bars={bars}
        updateEquips={updateEquips}
        equips={equips}
      ></InputForms>
      <h2>
        Título:{title}, Barras:
        {Object.keys(bars).length}, Ramos:
        {Object.keys(equips).length} (LT:
        {
          Object.values(equips).filter((equip) => equip.type === "LT").length
        }{" "}
        TR:
        {Object.values(equips).filter((equip) => equip.type === "TR").length})
      </h2>
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
