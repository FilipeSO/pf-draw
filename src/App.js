import React, { useState, useEffect, useRef } from "react";

import DrawCanvas from "./components/DrawCanvas";
import InputForms from "./components/InputForms";
import ConfigForms from "./components/ConfigForms";
import Solution from "./components/Solution";
import { parseCSVFile } from "./utils";

// import { parseTextFile } from "./utils";

export const App = () => {
  const [bars, setBars] = useState([]);
  const [equips, setEquips] = useState([]);
  const [title, setTitle] = useState("");
  const [config, setConfig] = useState({
    bar_placement: "circle",
    solver: "newton-raphson",
  });

  const drawCanvasRef = useRef(null);

  useEffect(() => {
    // fetch("/ieee30buses.txt")
    // fetch("/teste2.txt")
    //   .then((result) => result.text())
    //   .then((text) => {
    //     var lines = text.split(/[\r\n]+/g).filter((line) => line !== "");
    //     let [title, fileBars, fileEquips] = parseTextFile(lines);
    //     setTitle(title);
    //     setBars(fileBars);
    //     setEquips(fileEquips);
    //   });

    fetch("/input.csv")
      .then((result) => result.text())
      .then((text) => {
        var lines = text
          .split(/[\r\n]+/g)
          .filter((line) => line.split(";")[0] !== "");
        let [title, fileBars, fileEquips] = parseCSVFile(lines);
        setTitle(title);
        setBars(fileBars);
        setEquips(fileEquips);
      });
  }, []);

  const updateBars = (newState) => {
    setBars(newState);
    // window.scrollTo(0, drawCanvasRef.current.offsetTop);
  };

  const updateEquips = (newState) => {
    setEquips(newState);
    // window.scrollTo(0, drawCanvasRef.current.offsetTop);
  };
  const updateConfig = (newState) => {
    setConfig(newState);
    // window.scrollTo(0, drawCanvasRef.current.offsetTop);
  };

  const updateTitle = (newState) => {
    setTitle(newState);
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
          updateTitle={updateTitle}
        ></InputForms>
        <ConfigForms config={config} updateConfig={updateConfig}></ConfigForms>

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
      <div ref={drawCanvasRef}>
        <DrawCanvas
          updateBars={updateBars}
          bars={bars}
          updateEquips={updateEquips}
          equips={equips}
        ></DrawCanvas>
      </div>
      <div className="bg-gray-700">
        <h1 className="text-white text-4xl font-bold text-center">SOLUTION</h1>
      </div>
      <Solution bars={bars} equips={equips}></Solution>
    </div>
  );
};

export default App;
