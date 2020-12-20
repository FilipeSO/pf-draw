import React, { useState, useEffect, useRef } from "react";

import DrawCanvas from "./components/DrawCanvas";
import TextFileInput from "./components/TextFileInput";
import CSVFileInput from "./components/CSVFileInput";
import BarInput from "./components/BarInput";
import BranchInput from "./components/BranchInput";
import ConfigForms from "./components/ConfigForms";
import Solution from "./components/Solution";
import { parseCSVFile } from "./utils";

export const App = () => {
  const [bars, setBars] = useState([]);
  const [equips, setEquips] = useState([]);
  const [title, setTitle] = useState("");
  const [config, setConfig] = useState({
    bar_placement: "",
    solver: "",
    err_tolerance: "",
    bars: undefined,
    equips: undefined,
  });

  const [canvasReady, setCanvasReady] = useState(false);
  const drawCanvasRef = useRef(null);

  useEffect(() => {
    // fetch("/ieee30buses.txt")
    //   // fetch("/teste2.txt")
    //   .then(result => result.text())
    //   .then(text => {
    //     var lines = text.split(/[\r\n]+/g).filter(line => line !== "");
    //     let [title, fileBars, fileEquips] = parseTextFile(lines);
    //     setTitle(title);
    //     setBars(fileBars);
    //     setEquips(fileEquips);
    //   });

    fetch("/input.csv")
      //   // fetch("/input30bar.csv")
      .then((result) => result.text())
      .then((text) => {
        var lines = text
          .split(/[\r\n]+/g)
          .filter((line) => line.split(";")[0] !== "");
        let [title, fileBars, fileEquips] = parseCSVFile(lines);
        setTitle(title);
        setBars(fileBars);
        setEquips(fileEquips);
        console.log("FILE INPUT", fileBars, fileEquips);
      });
    setCanvasReady(true); //necessario para drawcanvasref != undefined
  }, []);

  const updateBars = (newState) => {
    console.log("UPDATE BAR", newState);
    setBars(newState);
    // window.scrollTo(0, drawCanvasRef.current.offsetTop);
  };

  const updateEquips = (newState) => {
    setEquips(newState);
    // window.scrollTo(0, drawCanvasRef.current.offsetTop);
  };
  const updateConfig = (newState) => {
    let updateState = {
      ...newState,
      bars: bars,
      equips: equips,
    };
    // console.log("UPDATE", updateState);
    setConfig(updateState);
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
        <TextFileInput
          updateBars={updateBars}
          updateEquips={updateEquips}
          updateTitle={updateTitle}
        ></TextFileInput>
        <CSVFileInput
          updateBars={updateBars}
          updateEquips={updateEquips}
          updateTitle={updateTitle}
        ></CSVFileInput>

        <div className="lg:flex lg:space-x-4">
          <div className="lg:w-1/2">
            <BarInput updateBars={updateBars} bars={bars}></BarInput>
          </div>
          <div className="lg:w-1/2">
            <BranchInput
              updateEquips={updateEquips}
              equips={equips}
              bars={bars}
            ></BranchInput>
          </div>
        </div>
        <ConfigForms config={config} updateConfig={updateConfig}></ConfigForms>

        <h1 className="text-xl font-bold mt-4 text-center text-gray-800">
          Title: {title}, Bars: {Object.keys(bars).length}, Branches:{" "}
          {Object.keys(equips).length} (LT:{" "}
          {Object.values(equips).filter((equip) => equip.type === "LT").length}{" "}
          TR:{" "}
          {Object.values(equips).filter((equip) => equip.type === "TR").length})
        </h1>
      </div>
      <div
        ref={drawCanvasRef}
        className="border-solid border-4 border-blue-500 container mx-auto"
        style={{ height: "600px" }}
      >
        {canvasReady && (
          <DrawCanvas
            updateBars={updateBars}
            bars={bars}
            updateEquips={updateEquips}
            equips={equips}
            parentRef={drawCanvasRef}
          ></DrawCanvas>
        )}
      </div>
      <div className="bg-gray-700">
        <h1 className="text-white text-4xl font-bold text-center">SOLUTION</h1>
      </div>
      <Solution {...config} updateBars={updateBars}></Solution>
    </div>
  );
};

export default App;
